import { useEffect, useRef } from "react";
import { Phone } from "lucide-react";
import { gsap, isReduced } from "../lib/motion";
import { CTAButton } from "../components/shared";
import { carSilhouette } from "../lib/media";

export default function FinalCTA() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReduced()) return;
    const ctx = gsap.context(() => {
      gsap.set(".fi-line", { yPercent: 120 });
      gsap.set(".fin-b", { autoAlpha: 0, yPercent: 24, scale: 0.95 });
      gsap.set(".fin-cta", { autoAlpha: 0, y: 44 });
      gsap.set(".fin-sweep", { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // the world dims
      tl.fromTo(".fin-veil", { autoAlpha: 0.25 }, { autoAlpha: 0.9, duration: 1.4 }, 0);

      // thin light travels across the screen
      tl.fromTo(".fin-sweep", { xPercent: -260, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.25)
        .to(".fin-sweep", { xPercent: 340, duration: 1.6 }, 0.3)
        .to(".fin-sweep", { autoAlpha: 0, duration: 0.3 }, 1.7);

      // silhouette emerges from black
      tl.fromTo(
        ".fin-car",
        { autoAlpha: 0, scale: 1.16, filter: "blur(14px)" },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.5 },
        0.55
      );

      // statement lines
      tl.fromTo(
        ".fin-a .fi-line",
        { yPercent: 120 },
        { yPercent: 0, duration: 0.55, stagger: 0.28, ease: "power2.out" },
        1.1
      ).to(".fin-a", { yPercent: -14, autoAlpha: 0, scale: 0.94, filter: "blur(8px)", duration: 0.6 }, 2.55);

      // finale question + CTAs
      tl.fromTo(
        ".fin-b",
        { yPercent: 24, autoAlpha: 0, scale: 0.95, filter: "blur(10px)" },
        { yPercent: 0, autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
        2.75
      ).fromTo(
        ".fin-cta",
        { y: 44, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" },
        3.25
      );
      tl.to({}, { duration: 0.5 });
    }, root);
    return () => ctx.revert();
  }, []);

  const statement = (
    <div className="fin-a absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
      <h3 className="headline text-[clamp(2.6rem,7.6vw,7.4rem)]">
        <span className="rl"><span className="fi-line">YOUR CAR.</span></span>
        <span className="rl"><span className="fi-line">YOUR LOCATION.</span></span>
        <span className="rl">
          <span className="fi-line">
            OUR <span className="text-glint">DETAIL.</span>
          </span>
        </span>
      </h3>
    </div>
  );

  const question = (
    <div className="fin-b relative z-10 flex flex-col items-center text-center">
      <h3 className="headline text-[clamp(3.6rem,12vw,12rem)]">
        READY
        <br />
        TO <span className="chrome-text" data-text="SHINE?">SHINE?</span>
      </h3>
    </div>
  );

  const ctas = (
    <div className="fin-cta absolute inset-x-0 bottom-[10vh] z-20 flex flex-wrap items-center justify-center gap-4 px-6">
      <CTAButton label="GET A QUOTE" to="#contact" />
      <a
        href="tel:+19033633322"
        className="group inline-flex items-center gap-3 rounded-full border border-snow/25 px-7 py-4 transition-colors duration-300 hover:border-glint"
      >
        <Phone className="h-4 w-4 text-glint" />
        <span className="label !text-[11px] font-semibold !tracking-[0.26em] text-snow">
          CALL 903-363-3322
        </span>
      </a>
    </div>
  );

  const car = (
    <img
      src={carSilhouette}
      alt="Freshly detailed black vehicle revealed by light"
      className="fin-car pointer-events-none absolute left-1/2 top-1/2 w-[min(94vw,1150px)] -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-screen will-change-transform"
    />
  );

  if (isReduced()) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink py-24">
        <img src={carSilhouette} alt="" className="absolute inset-0 m-auto w-[min(94vw,1150px)] mix-blend-screen" />
        <div className="relative z-10 flex flex-col items-center gap-10 text-center">
          <h3 className="headline text-[clamp(3rem,10vw,9rem)]">
            READY TO <span className="chrome-text" data-text="SHINE?">SHINE?</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <CTAButton label="GET A QUOTE" to="#contact" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div ref={root} className="relative h-[340vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="fin-veil absolute inset-0 z-[5] bg-ink" />
        <div className="fin-sweep pointer-events-none absolute inset-y-[-25%] left-0 z-[6] w-[24vw] rotate-[12deg] bg-gradient-to-r from-transparent via-snow/70 to-transparent opacity-0 blur-xl" />
        <div className="fin-sweep pointer-events-none absolute inset-y-[-25%] left-[-4vw] z-[6] w-[44vw] rotate-[12deg] bg-gradient-to-r from-transparent via-glint/25 to-transparent opacity-0 blur-2xl" />
        {car}
        {statement}
        {question}
        {ctas}
      </div>
    </div>
  );
}
