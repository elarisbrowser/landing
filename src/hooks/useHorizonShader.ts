import { useReducedMotion } from 'motion/react';
import { type RefObject, useEffect, useState } from 'react';
import { horizonFragment, horizonVertex } from '../lib/shaders/horizon';

const MAX_PIXEL_RATIO = 1.5;

function readColor(name: string): [number, number, number] {
  const probe = document.createElement('div');
  probe.style.color = `var(${name})`;
  document.body.append(probe);
  const rgb = getComputedStyle(probe)
    .color.match(/[\d.]+/g)
    ?.map(Number);
  probe.remove();
  const [r = 0, g = 0, b = 0] = rgb ?? [];
  return [r / 255, g / 255, b / 255];
}

function readLength(name: string, basis: number): number {
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;width:var(${name})`;
  document.body.append(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width || basis;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Could not create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader compile failed');
  }
  return shader;
}

/**
 * Renders the horizon shader into `canvasRef`. Returns false when WebGL is
 * unavailable so the caller can fall back. Pauses off-screen and when the tab
 * is hidden; draws a single still frame for reduced motion.
 */
export function useHorizonShader(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const [supported, setSupported] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false });
    if (!canvas || !gl) {
      setSupported(false);
      return;
    }

    let program: WebGLProgram;
    try {
      program = gl.createProgram() as WebGLProgram;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, horizonVertex));
      gl.attachShader(
        program,
        compile(gl, gl.FRAGMENT_SHADER, horizonFragment),
      );
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error();
    } catch {
      setSupported(false);
      return;
    }
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook
    gl.useProgram(program);

    // One oversized triangle covers the viewport.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const uResolution = uniform('uResolution');
    const uTime = uniform('uTime');
    const uDiameter = uniform('uDiameter');
    gl.uniform1f(
      uniform('uCrest'),
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--planet-crest',
        ),
      ) / 100 || 0.54,
    );
    gl.uniform3fv(uniform('uPage'), readColor('--color-page'));
    gl.uniform3fv(uniform('uRim'), readColor('--planet-rim'));
    gl.uniform3fv(uniform('uGlow'), readColor('--planet-glow'));

    let ratio = 1;
    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uDiameter, readLength('--planet-size', width) * ratio);
    };

    let frame = 0;
    let visible = true;
    const start = performance.now();
    const draw = () => {
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => {
      draw();
      frame = requestAnimationFrame(loop);
    };
    const play = () => {
      cancelAnimationFrame(frame);
      if (shouldReduceMotion || !visible || document.hidden) draw();
      else frame = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      play();
    });
    intersection.observe(canvas);
    document.addEventListener('visibilitychange', play);

    resize();
    play();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', play);
      // Free GPU resources but keep the context: StrictMode remounts reuse
      // this canvas, and a lost context can't be recovered.
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [canvasRef, shouldReduceMotion]);

  return supported;
}
