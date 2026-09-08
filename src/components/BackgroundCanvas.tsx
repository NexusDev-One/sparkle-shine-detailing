import { useEffect, useRef } from "react";
import * as THREE from "three";
import { bgState, DEFAULT_PARAMS, type BgParams } from "../lib/bgState";
import { isReduced, isTouch, clampN } from "../lib/motion";

/**
 * ONE continuous animated world behind the entire site.
 * A full-viewport fragment shader renders flowing liquid gloss, metallic
 * reflection bands, traveling light trails, droplets and depth particles.
 * Scroll keyframes morph the world continuously from hero to footer.
 */

type Key = { at: number } & BgParams;

const KEYS: Key[] = [
  { at: 0.0, warp: 0.14, trails: 0.04, water: 0.1, drops: 0.3, parts: 0.04, metal: 0.45, dark: 0.02, sweep: 0.0, bloom: 0 },
  { at: 0.07, warp: 0.95, trails: 0.5, water: 0.14, drops: 0.35, parts: 0.12, metal: 0.5, dark: 0.08, sweep: 0.12, bloom: 0 },
  { at: 0.15, warp: 0.38, trails: 1.0, water: 0.16, drops: 0.4, parts: 0.16, metal: 0.55, dark: 0.04, sweep: 0.0, bloom: 0 },
  { at: 0.26, warp: 0.32, trails: 0.72, water: 0.34, drops: 0.55, parts: 0.12, metal: 0.52, dark: 0.06, sweep: 0.0, bloom: 0 },
  { at: 0.4, warp: 0.42, trails: 0.5, water: 0.55, drops: 0.8, parts: 0.3, metal: 0.55, dark: 0.08, sweep: 0.0, bloom: 0 },
  { at: 0.52, warp: 0.3, trails: 0.45, water: 0.32, drops: 1.0, parts: 1.0, metal: 0.78, dark: 0.04, sweep: 0.0, bloom: 0 },
  { at: 0.64, warp: 0.26, trails: 0.35, water: 0.24, drops: 0.6, parts: 0.42, metal: 0.95, dark: 0.14, sweep: 0.05, bloom: 0 },
  { at: 0.76, warp: 0.3, trails: 0.45, water: 0.5, drops: 0.5, parts: 0.3, metal: 0.7, dark: 0.2, sweep: 0.1, bloom: 0 },
  { at: 0.86, warp: 0.2, trails: 0.3, water: 0.3, drops: 0.3, parts: 0.2, metal: 0.6, dark: 0.6, sweep: 0.55, bloom: 0 },
  { at: 0.94, warp: 0.16, trails: 0.24, water: 0.2, drops: 0.26, parts: 0.16, metal: 0.5, dark: 0.86, sweep: 1.0, bloom: 0 },
  { at: 1.0, warp: 0.22, trails: 0.3, water: 0.26, drops: 0.36, parts: 0.22, metal: 0.55, dark: 0.6, sweep: 0.35, bloom: 0 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

function sample(p: number, out: BgParams) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].at) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const span = Math.max(1e-5, b.at - a.at);
  const t = smooth(clampN((p - a.at) / span, 0, 1));
  (Object.keys(DEFAULT_PARAMS) as (keyof BgParams)[]).forEach((k) => {
    out[k] = a[k] + (b[k] - a[k]) * t;
  });
  return out;
}

const VERT = /* glsl */ `
  void main() { gl_Position = vec4(position, 1.0); }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;
  uniform float uScroll;
  uniform float uVel;
  uniform float uWarp;
  uniform float uTrails;
  uniform float uWater;
  uniform float uDrops;
  uniform float uParts;
  uniform float uMetal;
  uniform float uDark;
  uniform float uSweep;
  uniform float uBloom;

  float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < OCT; i++){ v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 frag = gl_FragCoord.xy;
    vec2 p = (frag - 0.5 * uRes) / uRes.y;
    float t = uTime;

    /* camera: slow push-in + subtle rotation as you scroll */
    float push = 1.0 + 0.30 * uScroll;
    float ang = 0.10 * sin(uScroll * 3.14159) + uMouse.x * 0.02;
    mat2 R = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
    vec2 q = (p + uMouse * vec2(0.045, 0.03)) / push;
    q = R * q;

    /* surface bends and stretches with scroll */
    vec2 w1 = vec2(fbm(q * 1.35 + vec2(t * 0.05, 3.1)), fbm(q * 1.35 + vec2(7.7, -t * 0.04)));
    vec2 qq = q + (w1 - 0.5) * uWarp * 1.15;

    /* water ripple distortion */
    qq += uWater * 0.02 * vec2(sin(qq.y * 21.0 + t * 1.3), cos(qq.x * 17.0 - t * 1.05));

    /* liquid gloss height field */
    float f1 = fbm(qq * 2.05 + vec2(t * 0.045, -t * 0.03));
    float f2 = fbm(qq * 4.6 - vec2(t * 0.055, t * 0.02) + f1);
    float v = f1 * 0.62 + f2 * 0.38;

    vec3 col = mix(vec3(0.004, 0.007, 0.013), vec3(0.016, 0.024, 0.04), smoothstep(0.12, 0.9, v));

    /* broad moving sheen */
    float sheen = smoothstep(0.30, 0.92, fbm(qq * 1.25 + vec2(-t * 0.022, t * 0.014) + v * 0.9));
    vec3 sheenCol = mix(vec3(0.045, 0.065, 0.095), vec3(0.10, 0.14, 0.19), uMetal);
    col += sheen * sheenCol * (0.6 + 0.4 * sin(t * 0.06 + qq.x * 1.5));

    /* metallic reflection bands */
    float band = pow(0.5 + 0.5 * sin(v * 14.0 - qq.x * 3.5 + t * 0.22), 6.0);
    col += band * sheen * uMetal * vec3(0.09, 0.12, 0.16);

    /* traveling white specular glints */
    float glint = pow(max(fbm(qq * 3.1 + vec2(-t * 0.08, t * 0.05)) - 0.60, 0.0), 2.0) * 7.0;
    col += glint * vec3(0.85, 0.92, 1.0) * (0.18 + 0.30 * uMetal);

    /* thin white light trail following flow contours */
    float t1 = fbm(qq * vec2(1.15, 3.1) + vec2(-t * 0.11, 1.7) + v * 0.7);
    float line1 = 1.0 - smoothstep(0.0, 0.045, abs(t1 - 0.5));
    float gate1 = smoothstep(0.35, 0.75, noise(vec2(qq.x * 1.6 - t * 0.4, 4.0)));
    col += line1 * gate1 * uTrails * vec3(0.55, 0.75, 1.0) * 0.8;

    #if MOBILE == 0
    /* blue electric trail */
    float t2 = fbm(qq * vec2(0.9, 2.3) + vec2(t * 0.06, 8.3));
    float line2 = 1.0 - smoothstep(0.0, 0.028, abs(t2 - 0.47));
    float gate2 = smoothstep(0.4, 0.8, noise(vec2(qq.x * 2.2 + t * 0.55, 9.0)));
    col += line2 * gate2 * uTrails * vec3(0.23, 0.65, 1.0) * 1.5;
    #endif

    /* water droplets glinting on the surface */
    float dropZoom = mix(20.0, 9.0, clamp(uDrops, 0.0, 1.0));
    vec2 dg = (qq + vec2(0.0, -uScroll * 0.5)) * dropZoom;
    vec2 id = floor(dg); vec2 gf = fract(dg) - 0.5;
    float rnd = hash(id);
    vec2 offs = (vec2(hash(id + 1.31), hash(id + 2.71)) - 0.5) * 0.7;
    float dd = length(gf - offs);
    float drop = (1.0 - smoothstep(0.015, 0.13, dd)) * step(0.68, rnd);
    float tw = 0.5 + 0.5 * sin(t * (1.0 + rnd * 2.5) + rnd * 39.0);
    col += drop * tw * uDrops * vec3(0.65, 0.82, 1.0) * 0.45;

    #if MOBILE == 0
    /* particles with depth, drifting toward camera */
    for (int i = 0; i < 3; i++){
      float fi = float(i);
      float sc = 26.0 - fi * 7.0;
      vec2 pp = qq * sc + vec2(fi * 3.7, t * (0.22 + fi * 0.18));
      vec2 iid = floor(pp); vec2 ffr = fract(pp) - 0.5;
      float r = hash(iid + fi * 13.7);
      vec2 o = (vec2(hash(iid + 4.1), hash(iid + 8.7)) - 0.5) * 0.65;
      float dl = length(ffr - o);
      float glow = (1.0 - smoothstep(0.005, 0.05 + r * 0.06, dl)) * step(0.86, r);
      col += glow * vec3(0.5, 0.7, 1.0) * uParts * (0.10 + 0.10 * fi);
    }
    #endif

    /* soft light following the pointer */
    float ml = exp(-2.8 * length(p - uMouse * vec2(0.85, 0.5)));
    col += ml * vec3(0.10, 0.14, 0.20) * (0.35 + 0.35 * uMetal);

    /* sweeping beam across the screen (finale) */
    float sx = p.x * 1.15 - p.y * 0.18 - (fract(t * 0.075) * 2.8 - 1.4);
    float beam = pow(max(1.0 - abs(sx), 0.0), 20.0) * uSweep;
    col += beam * vec3(0.35, 0.62, 1.0) * 0.9;
    col += pow(max(1.0 - abs(sx), 0.0), 90.0) * uSweep * vec3(1.0);

    /* focus bloom (form interaction) */
    col += uBloom * sheen * vec3(0.08, 0.16, 0.34);

    /* scroll velocity shimmer */
    col *= 1.0 + min(abs(uVel), 3.0) * 0.05;

    /* finale darkening */
    col *= 1.0 - uDark * 0.82;

    /* vignette + grain */
    float vig = 1.0 - smoothstep(0.4, 1.55, length(p * vec2(1.0, 1.2)));
    col *= mix(0.72, 1.0, vig);
    col += (hash(frag + fract(t) * 11.0) - 0.5) * 0.012;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const failRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fail = failRef.current;
    if (!canvas) return;

    const touch = isTouch();
    const reduced = isReduced();
    const RES_SCALE = touch ? 0.6 : 0.7;
    const target: BgParams = { ...DEFAULT_PARAMS };
    const current: BgParams = { ...DEFAULT_PARAMS };
    const uniformFor: Record<keyof BgParams, string> = {
      warp: "uWarp", trails: "uTrails", water: "uWater", drops: "uDrops",
      parts: "uParts", metal: "uMetal", dark: "uDark", sweep: "uSweep", bloom: "uBloom",
    };

    let raf = 0;
    let last = performance.now();
    let time = Math.random() * 100;
    let lastScroll = window.scrollY;
    let teardown: (() => void) | undefined;

    /* (re)builds the renderer + shader + render loop; called on mount and after
       every WebGL context restore so a lost GPU context never blanks the site */
    const start = () => {
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        });
      } catch {
        if (fail) fail.style.opacity = "1";
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, touch ? 1.2 : 1.5));

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const uniforms: Record<string, THREE.IUniform> = {
        uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0, 0) }, uScroll: { value: 0 }, uVel: { value: 0 },
        uWarp: { value: DEFAULT_PARAMS.warp }, uTrails: { value: DEFAULT_PARAMS.trails },
        uWater: { value: DEFAULT_PARAMS.water }, uDrops: { value: DEFAULT_PARAMS.drops },
        uParts: { value: DEFAULT_PARAMS.parts }, uMetal: { value: DEFAULT_PARAMS.metal },
        uDark: { value: DEFAULT_PARAMS.dark }, uSweep: { value: DEFAULT_PARAMS.sweep }, uBloom: { value: 0 },
      };
      const material = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG, uniforms,
        defines: { OCT: touch ? 3 : 4, MOBILE: touch ? 1 : 0 },
        depthWrite: false, depthTest: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);

      const resize = () => {
        const w = Math.max(2, Math.floor(window.innerWidth * RES_SCALE));
        const h = Math.max(2, Math.floor(window.innerHeight * RES_SCALE));
        renderer.setSize(w, h, false);
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        (uniforms.uRes.value as THREE.Vector2).set(w, h);
      };
      resize();
      window.addEventListener("resize", resize);

      const loop = () => {
        raf = requestAnimationFrame(loop);
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (document.hidden) return;

        time += dt * (reduced ? 0.18 : 1);
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const p = clampN(window.scrollY / max, 0, 1);
        bgState.progress = p;
        const rawVel = (window.scrollY - lastScroll) / Math.max(dt * 1000, 1);
        lastScroll = window.scrollY;
        bgState.velocity += (clampN(rawVel * 18, -3, 3) - bgState.velocity) * Math.min(1, dt * 6);
        bgState.mx += (bgState.tx - bgState.mx) * Math.min(1, dt * 4.5);
        bgState.my += (bgState.ty - bgState.my) * Math.min(1, dt * 4.5);

        sample(reduced ? Math.min(p, 0.12) : p, target);
        if (bgState.override && !reduced) {
          (Object.keys(bgState.override) as (keyof BgParams)[]).forEach((k) => {
            const val = bgState.override![k];
            if (typeof val === "number") target[k] = val;
          });
        }
        target.bloom += bgState.focusBoost;

        const ease = 1 - Math.exp(-dt * 3.4);
        (Object.keys(DEFAULT_PARAMS) as (keyof BgParams)[]).forEach((k) => {
          current[k] += (target[k] - current[k]) * ease;
          uniforms[uniformFor[k]].value = current[k];
        });
        uniforms.uTime.value = time;
        uniforms.uScroll.value = p;
        uniforms.uVel.value = bgState.velocity;
        (uniforms.uMouse.value as THREE.Vector2).set(bgState.mx, bgState.my);

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        mesh.geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    // single stable context-loss handlers (attached once, survive restarts)
    const onLost = (e: Event) => {
      e.preventDefault(); // allow the browser to restore the context
      cancelAnimationFrame(raf);
    };
    const onRestored = () => {
      last = performance.now();
      teardown = start();
    };
    canvas.addEventListener("webglcontextlost", onLost as EventListener, false);
    canvas.addEventListener("webglcontextrestored", onRestored as EventListener, false);

    // pointer (shared, kept across restarts)
    const onPointer = (e: PointerEvent) => {
      bgState.tx = (e.clientX / window.innerWidth) * 2 - 1;
      bgState.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    teardown = start();

    return () => {
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onLost as EventListener);
      canvas.removeEventListener("webglcontextrestored", onRestored as EventListener);
      teardown?.();
    };
  }, []);

  return (
    <>
      {/* guaranteed CSS world — always present behind the canvas so the
          background is never empty, even transiently during a context loss */}
      <div ref={failRef} aria-hidden="true" className="bg-fallback" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-0 block h-full w-full"
      />
    </>
  );
}
