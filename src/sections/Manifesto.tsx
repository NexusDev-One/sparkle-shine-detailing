import { useEffect, useRef } from "react";
import { gsap, isReduced } from "../lib/motion";
import { Eyebrow, Line } from "../components/shared";

const LINES = [
  "We bring the equipment.",
  "We bring the water.",
  "We bring the power.",
  "We bring the detail to you.",
];

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const sweepA = useRef<HTMLDivElement>(null);
  const sweepB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReduced()) return;
    const ctx = gsap.context(() => {
      // blue light passes across the entire screen on entry
      const st = { trigger: root.current, start: "top bottom", end: "top 5%", scrub: 0.5 };
      gsap.fromTo(sweepA.current, { x: "-60vw", autoAlpha: 0 }, { x: "140vw", autoAlpha: 0.9, ease: "none", scrollTrigger: st });
      gsap.fromTo(
        sweepB.current,
        { x: "-70vw", autoAlpha: 0 },
        { x: "145vw", autoAlpha: 1, ease: "none", scrollTrigger: { ...st, scrub: 0.35 } }
      );

      // headline lines
      gsap.utils.toArray<HTMLElement>(".mf-line > span").forEach((sp, i) => {
        gsap.fromTo(
          sp,
          { yPercent: 118, rotate: 4 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.4,
            ease: "power4.out",
            delay: i * 0.07,
            scrollTrigger: { trigger: ".mf-head", start: "top 88%" },
          }
        );
      });

      // statements sharpen one at a time — blur → focus, scrubbed
      gsap.utils.toArray<HTMLElement>(".mf-row").forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0.04, y: 70, scale: 1.03, filter: "blur(16px)" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: { trigger: row, start: "top 88%", end: "top 48%", scrub: 0.6 },
          }
        );
        const num = row.querySelector(".mf-num");
        if (num) {
          gsap.fromTo(
            num,
            { color: "rgba(59,167,255,0)" },
            {
              color: "rgba(59,167,255,1)",
              ease: "none",
              scrollTrigger: { trigger: row, start: "top 80%", end: "top 55%", scrub: 0.6 },
            }
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative pb-[16vh] pt-[14vh]">
      {/* blue light pass */}
      <div
        ref={sweepA}
        className="pointer-events-none fixed -inset-y-[20%] left-0 z-[5] w-[36vw] rotate-[14deg] bg-gradient-to-r from-transparent via-glint/20 to-transparent opacity-0 blur-2xl"
      />
      <div
        ref={sweepB}
        className="pointer-events-none fixed -inset-y-[20%] left-0 z-[5] w-[16vw] rotate-[14deg] bg-gradient-to-r from-transparent via-snow/40 to-transparent opacity-0 blur-xl"
      />

      <div className="wrap">
        <Eyebrow className="mb-10">THE IDEA</Eyebrow>
        <h2 className="mf-head headline text-[clamp(3.2rem,9.5vw,9.5rem)]">
          <Line className="mf-line">YOUR LOCATION.</Line>
          <Line className="mf-line md:ml-[10vw]">
            <span className="text-outline">OUR DETAIL SHOP.</span>
          </Line>
        </h2>

        <div className="mt-[16vh] md:mt-[18vh]">
          {LINES.map((l, i) => (
            <div
              key={l}
              className="mf-row flex items-baseline gap-6 border-t border-snow/10 py-9 md:gap-12 md:py-12 will-change-transform"
            >
              <span className="mf-num label shrink-0 !text-xs text-glint/0">
                0{i + 1}
              </span>
              <p className="text-[clamp(1.7rem,4.6vw,4rem)] font-[800] uppercase leading-[1.02] tracking-[-0.02em] text-snow">
                {l}
              </p>
            </div>
          ))}
        </div>

        <p className="fi mt-14 max-w-sm text-sm leading-relaxed text-mist" data-d="0.1">
          Fully self-sufficient detailing rigs serving the entire Dallas–Fort
          Worth metroplex. No hookups. No dropping off. No waiting rooms.
        </p>
      </div>
    </section>
  );
}
