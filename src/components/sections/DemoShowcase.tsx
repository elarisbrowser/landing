import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useRef } from 'react';
import { demo } from '../../config/content';
import { Animated, loadDelay } from '../../motion';

const DEMO_PERSPECTIVE = 1600;

/** Browser screenshot that tilts upright and scales in as it scrolls into view. */
export function DemoShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section
      ref={ref}
      aria-label="Product preview"
      className="relative w-full overflow-x-clip pl-4 sm:overflow-x-visible sm:px-8"
    >
      <Animated preset="rise" delay={loadDelay(5)}>
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { rotateX, scale, y, transformPerspective: DEMO_PERSPECTIVE }
          }
          className="w-[170%] max-w-none origin-top-left overflow-hidden rounded-demo shadow-demo sm:mx-auto sm:w-auto sm:max-w-5xl sm:origin-top"
        >
          <img
            src={demo.src}
            alt={demo.alt}
            width={demo.width}
            height={demo.height}
            fetchPriority="high"
            className="block h-auto w-full"
          />
        </motion.div>
      </Animated>
    </section>
  );
}
