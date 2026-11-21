export const horizonVertex = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

/**
 * Sunrise over a planet limb: light is strongest where the sun sits behind
 * the planet and falls off along the curve, with shimmering atmosphere,
 * glare, night-side spill, twinkling stars, and dithering against banding.
 * Geometry matches the CSS planet (--planet-size / --planet-crest).
 */
export const horizonFragment = /* glsl */ `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uDiameter;
uniform float uCrest;
uniform vec3 uPage;
uniform vec3 uRim;
uniform vec3 uGlow;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float t = uTime;
  float radius = uDiameter * 0.5;
  vec2 center = vec2(uResolution.x * 0.5, uResolution.y * (1.0 - uCrest) - radius);
  vec2 toFrag = frag - center;
  float d = length(toFrag) - radius; // px from the limb; > 0 is sky
  float h = max(d, 0.0);
  float sky = smoothstep(-1.0, 1.0, d);
  float night = 1.0 - sky;

  // Angle along the limb, 0 at the crest. The sun sits just behind the
  // planet and drifts slowly, so light is uneven along the curve.
  float along = atan(toFrag.x, toFrag.y);
  float sunAngle = 0.08 * sin(t * 0.06);
  float sun = exp(-pow((along - sunAngle) / 0.05, 2.0));
  float daylight = exp(-pow((along - sunAngle) / 0.32, 2.0));

  // Atmosphere: thicker and brighter towards the sun, shimmering slowly.
  float shimmer = fbm(vec2(along * 30.0 + t * 0.04, h * 0.02 - t * 0.05));
  float thickness = mix(28.0, 110.0, daylight);
  float atmosphere = exp(-h / thickness) * mix(0.18, 1.0, daylight);
  atmosphere *= 0.8 + 0.35 * shimmer;
  float haze = exp(-h / 380.0) * mix(0.03, 0.12, daylight);

  // Colour shifts from deep blue to a warm white near the sun.
  vec3 warm = vec3(1.0, 0.94, 0.86);
  vec3 airColor = mix(uGlow, uRim, exp(-h / 24.0));
  airColor = mix(airColor, warm, sun * exp(-h / 40.0));

  vec3 color = uPage;
  color += airColor * atmosphere * 0.5 * sky;
  color += uGlow * haze * sky;

  // Bright, thin limb that swells where the sun is.
  float limb = exp(-abs(d) / mix(1.5, 4.0, daylight));
  color += mix(uRim, warm, sun) * limb * mix(0.25, 1.1, daylight);

  // Night side: light spilling over the limb onto faint cloud tops.
  float clouds = fbm(vec2(toFrag.x * 0.004, d * 0.012) + vec2(t * 0.01, 0.0));
  float spill = exp(min(d, 0.0) / mix(30.0, 140.0, daylight));
  color += uGlow * spill * daylight * (0.05 + 0.12 * clouds) * night;

  // Sun glare: soft bloom plus a faint horizontal streak at the hotspot.
  vec2 sunPoint = center + radius * vec2(sin(sunAngle), cos(sunAngle));
  vec2 offset = frag - sunPoint;
  float bloom = exp(-length(offset) / (uResolution.y * 0.12));
  float streak = exp(-abs(offset.y) / 2.5) * exp(-abs(offset.x) / (uResolution.x * 0.08));
  color += warm * (bloom * 0.18 + streak * 0.18) * (0.4 + 0.6 * sky);

  // Stars: soft 2px points, twinkling, fading out near the atmosphere.
  vec2 grid = frag / 4.0;
  vec2 cell = floor(grid);
  float seed = hash(cell);
  vec2 starPos = vec2(hash(cell + 7.1), hash(cell + 3.7));
  float core = smoothstep(0.35, 0.0, length(fract(grid) - starPos));
  float twinkle = 0.55 + 0.45 * sin(t * (0.8 + seed * 2.0) + seed * 600.0);
  float starMask = step(0.992, seed) * smoothstep(80.0, 360.0, h) * sky;
  color += vec3(core * twinkle * starMask * 0.9);

  // Dither to hide 8-bit banding in the long gradients.
  color += (hash(frag + fract(t)) - 0.5) / 255.0;

  gl_FragColor = vec4(color, 1.0);
}
`;
