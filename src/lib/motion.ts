import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const isReduced = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

/* ---------- lenis singleton ---------- */
let lenisInstance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenisInstance = l;
};
export const getLenis = () => lenisInstance;

export const scrollToSection = (sel: string) => {
  const el = document.querySelector(sel);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { duration: 1.7, offset: 0 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
};

/* ---------- shared reveal: masked lines ---------- */
export function revealLines(root: ParentNode) {
  if (isReduced()) return;
  gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".rl")).forEach((rl) => {
    const inner = rl.querySelector<HTMLElement>("span");
    if (!inner) return;
    gsap.fromTo(
      inner,
      { yPercent: 118, rotate: 4 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.35,
        ease: "power4.out",
        delay: rl.dataset.d ? parseFloat(rl.dataset.d) : 0,
        scrollTrigger: {
          trigger: rl,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}

/* ---------- soft fade for small labels (used sparingly) ---------- */
export function fadeIns(root: ParentNode) {
  if (isReduced()) return;
  gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".fi")).forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 26 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: el.dataset.d ? parseFloat(el.dataset.d) : 0,
        scrollTrigger: { trigger: el, start: "top 94%" },
      }
    );
  });
}

export const clampN = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
