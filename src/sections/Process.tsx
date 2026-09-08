import { useEffect, useRef } from "react";
import { gsap, isReduced, revealLines, fadeIns } from "../lib/motion";
import { Eyebrow, Line } from "../components/shared";

const STEPS = [
  {
    n: "01",
    title: "REQUEST\nA QUOTE",
    sub: "Call, or send the form below. Tell us the vehicle and the service — takes a minute.",
  },
  {
    n: "02",
    title: "CHOOSE YOUR\nLOCATION",
    sub: "Home, office, or anywhere in the DFW metroplex. You pick the exact spot.",
  },
  {
    n: "03",
    title: "WE COME\nTO YOU",
    sub: "We arrive with our own water, our own power, and everything needed to detail.",
  },
  {
    n: "04",
    title: "ENJOY\nTHE RESULT",
    sub: "Walk out to a vehicle that looks like it just left the showroom.",
  },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const seq = useRef<HTMLDivElement>(null);

  useEffect(() => {
    revealLines(root.current!);
    fadeIns(root.current!);
    if (isReduced()) return;

    const steps = gsap.utils.toArray<HTMLElement>(".pr-step");
    const ctx = gsap.context(() => {
      gsap.set(steps, { autoAlpha: 0 });
      gsap.set(steps[0], { autoAlpha: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: seq.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      steps.forEach((st, i) => {
        if (i > 0) {
          const prev = steps[i - 1];
          tl.to(prev, { yPercent: -16, autoAlpha: 0, filter: "blur(8px)", duration: 0.5 }, i)
            .fromTo(
              st,
              { yPercent: 22, autoAlpha: 0, filter: "blur(10px)" },
              { yPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.6 },
              i + 0.08
            )
            .fromTo(
              st.querySelector(".pr-num"),
              { scale: 1.25, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.6 },
              i + 0.08
            );
        }
      });

      // fill line
      gsap.fromTo(
        ".pr-fill",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: seq.current, start: "top top", end: "bottom bottom", scrub: 0.4 },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const stepMarkup = (s: (typeof STEPS)[number]) => (
    <>
      <span
        aria-hidden
        className="pr-num pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none text-[38vw] font-[900] leading-none text-outline-faint md:text-[26vw]"
      >
        {s.n}
      </span>
      <div className="wrap relative z-10">
        <span className="label mb-6 block !text-[10px] text-glint">STEP {s.n}</span>
        <h3 className="headline whitespace-pre-line text-[clamp(3rem,9vw,8.5rem)] text-snow">
          {s.title}
        </h3>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-mist md:text-base">{s.sub}</p>
      </div>
    </>
  );

  if (isReduced()) {
    return (
      <section id="process" className="relative py-[14vh]">
        <div className="wrap">
          <Eyebrow className="mb-8">HOW IT WORKS</Eyebrow>
          <h2 className="headline text-[clamp(3rem,9vw,9rem)]">FOUR STEPS. ZERO EFFORT.</h2>
        </div>
        {STEPS.map((s) => (
          <div key={s.n} className="relative flex min-h-[60vh] items-center overflow-hidden border-t border-snow/10">
            {stepMarkup(s)}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={root} id="process" className="relative py-[14vh]">
      <div className="wrap">
        <Eyebrow className="mb-8">HOW IT WORKS</Eyebrow>
        <h2 className="headline text-[clamp(3rem,9vw,9rem)]">
          <Line>FOUR STEPS.</Line>
          <Line delay={0.07}>
            <span className="text-outline">ZERO EFFORT.</span>
          </Line>
        </h2>
      </div>

      <div ref={seq} className="relative mt-[6vh] h-[440vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          {STEPS.map((s) => (
            <div key={s.n} className="pr-step absolute inset-0 flex items-center will-change-transform">
              {stepMarkup(s)}
            </div>
          ))}
          {/* progress rail */}
          <div className="absolute bottom-16 left-6 right-6 z-20 h-px bg-snow/12 md:left-10 md:right-10">
            <span className="pr-fill block h-full w-full origin-left rounded-full bg-glint" />
          </div>
        </div>
      </div>
    </section>
  );
}
