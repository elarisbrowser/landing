import {
  motion,
  type PanInfo,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { SOURCE_HINT, SOURCE_HINT_STRETCH } from '../constants/annotation';

const {
  label,
  delay,
  letterStagger,
  letterDuration,
  drawDuration,
  headDuration,
  ease,
} = SOURCE_HINT;
const { maxStretch, resistance, unwindAt, spring } = SOURCE_HINT_STRETCH;

// Arrow draws once the note is fully written.
const arrowDelay = delay + label.length * letterStagger + letterDuration;

/**
 * Arrow control points (tail → tip) as [x, y, follow]: `follow` is how much
 * each point moves with the dragged note (1 = tail, 0 = tip pinned).
 */
const ARROW: [number, number, number][] = [
  [4, 62, 1],
  [24, 66, 1],
  [36, 44, 0.95],
  [26, 38, 0.9],
  [16, 32, 0.85],
  [10, 50, 0.8],
  [34, 52, 0.7],
  [62, 54, 0.45],
  [100, 44, 0.15],
  [104, 4, 0],
];

type Point = { x: number; y: number };

const at = (i: number): Point => ({ x: ARROW[i][0], y: ARROW[i][1] });
const TAIL = at(0);
const TIP = at(ARROW.length - 1);
const HEAD = 'M98 12 L104 4 L108 13';
// Rest directions the note and arrowhead are drawn along.
const TAIL_DIR = { x: TAIL.x - ARROW[1][0], y: TAIL.y - ARROW[1][1] };
const HEAD_DIR = { x: TIP.x - ARROW[8][0], y: TIP.y - ARROW[8][1] };

const sub = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Rotation (deg) that turns `rest` onto `v`, in (-180, 180]. */
const turn = (v: Point, rest: Point) => {
  const a = Math.atan2(v.y, v.x) - Math.atan2(rest.y, rest.x);
  return (Math.atan2(Math.sin(a), Math.cos(a)) * 180) / Math.PI;
};

/** Point on the cubic Bézier p0..p3 at `t`. */
const cubicAt = ([p0, p1, p2, p3]: Point[], t: number): Point => {
  const u = 1 - t;
  const [a, b, c, d] = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
};

/** Smooth, untwirled sweep from the dragged tail to the pinned tip. */
const sweep = (dx: number, dy: number): Point[] => {
  const tail = { x: TAIL.x + dx, y: TAIL.y + dy };
  const bend = { x: 96 + dx * 0.15, y: 50 + dy * 0.15 };
  return [
    tail,
    { x: lerp(tail.x, bend.x, 0.35), y: lerp(tail.y, bend.y, 0.35) },
    bend,
    TIP,
  ];
};

/** Arrow control points, blending from the loop to the sweep as it's pulled. */
const elasticPoints = (dx: number, dy: number) => {
  const t = Math.min(1, Math.hypot(dx, dy) / (maxStretch * unwindAt));
  const unwind = t * t * (3 - 2 * t);
  const curve = sweep(dx, dy);
  return ARROW.map(([x, y, f], i) => {
    const straight = cubicAt(curve, i / (ARROW.length - 1));
    return {
      x: lerp(x + dx * f, straight.x, unwind),
      y: lerp(y + dy * f, straight.y, unwind),
    };
  });
};

const cubicChain = (p: Point[]) => {
  const s = p.map(({ x, y }) => `${x} ${y}`);
  return `M${s[0]} C${s[1]} ${s[2]} ${s[3]} C${s[4]} ${s[5]} ${s[6]} C${s[7]} ${s[8]} ${s[9]}`;
};

/**
 * Radial rubber band: follows the pointer closely at first, then resistance
 * builds past `maxStretch` without a hard stop.
 */
const rubberBand = ({ x, y }: Point) => {
  const distance = Math.hypot(x, y);
  if (distance === 0) return { x: 0, y: 0 };
  const stretched =
    maxStretch * Math.log1p((distance * resistance) / maxStretch);
  const scale = stretched / distance;
  return { x: x * scale, y: y * scale };
};

/** Squiggly hand-drawn arrow + note pointing up at the GitHub icon button. */
export function SourceHint() {
  const shouldReduceMotion = useReducedMotion();
  const instant = { duration: 0 };
  const draw = (from: number, duration: number) =>
    shouldReduceMotion ? instant : { delay: from, duration, ease };

  // Pointer target -> spring, so the note carries weight and wobbles back.
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const springX = useSpring(targetX, spring);
  const springY = useSpring(targetY, spring);
  const x = shouldReduceMotion ? targetX : springX;
  const y = shouldReduceMotion ? targetY : springY;

  // Arrow shape, note tilt and arrowhead angle all follow the arrow's curve.
  const points = useTransform(() => elasticPoints(x.get(), y.get()));
  const pathD = useTransform(points, cubicChain);
  const noteRotate = useTransform(points, (p) =>
    turn(sub(p[0], p[1]), TAIL_DIR),
  );
  const headTransform = useTransform(
    points,
    (p) => `rotate(${turn(sub(p[9], p[8]), HEAD_DIR)} ${TIP.x} ${TIP.y})`,
  );

  const handlePan = (_: PointerEvent, { offset }: PanInfo) => {
    const stretched = rubberBand(offset);
    targetX.set(stretched.x);
    targetY.set(stretched.y);
  };
  const handlePanEnd = () => {
    targetX.set(0);
    targetY.set(0);
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-full right-0 mt-0.5 hidden items-end text-annotation sm:flex"
    >
      <motion.span
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{ x, y, rotate: noteRotate }}
        whileTap={{ scale: 1.06 }}
        className="pointer-events-auto mr-1.5 -mb-1 -rotate-3 origin-bottom-right cursor-grab touch-none select-none whitespace-pre font-hand text-[1.625rem] leading-none tracking-wide active:cursor-grabbing"
      >
        {Array.from(label, (char, i) => (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: static string, order never changes
            key={i}
            initial={{ opacity: 0, y: 3, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={draw(delay + i * letterStagger, letterDuration)}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </motion.span>

      <svg
        viewBox="0 0 120 70"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-[70px] w-[120px] overflow-visible"
      >
        <motion.path
          d={pathD}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={draw(arrowDelay, drawDuration)}
        />
        <motion.path
          d={HEAD}
          transform={headTransform}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={draw(arrowDelay + drawDuration, headDuration)}
        />
      </svg>
    </div>
  );
}
