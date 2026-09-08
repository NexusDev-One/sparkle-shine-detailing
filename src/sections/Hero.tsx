import { useEffect, useRef } from "react";
import { gsap, isReduced, isTouch } from "../lib/motion";
import { CTAButton, Line } from "../components/shared";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const chrome = useRef<HTMLSpanElement>(null);

  /* pointer-reactive reflection + depth */
  useEffect(() => {
    if (isTouch() || isReduced()) return;
    const el = root.current!;
    const xTo = gsap.quickTo(content.current, "x", { duration: 0.9, ease: "power3.out" });
    const yTo = gsap.quickTo(content.current, "y", { duration: 0.9, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const rx = e.clientX / window.innerWidth - 0.5;
      const ry = e.clientY / window.innerHeight - 0.5;
      xTo(rx * -18);
      yTo(ry * -12);
      chrome.current?.style.setProperty("--sx", `${160 - (e.clientX / window.innerWidth) * 260}%`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  /* entrance + scroll-exit: headline separates into layers */
  useEffect(() => {
    if (isReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-line > span",
        { yPercent: 118, rotate: 4 },
        { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.1, ease: "power4.out", delay: 0.25 }
      );
      gsap.fromTo(
        ".hero-fi",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "power3.out", delay: 0.9 }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });
      tl.to(".hero-fi", { y: -70, autoAlpha: 0, stagger: 0.03, ease: "none" }, 0)
        .to("#hl-1", { xPercent: -16, scale: 1.05, autoAlpha: 0, filter: "blur(8px)", ease: "none" }, 0.05)
        .to("#hl-2", { xPercent: 13, scale: 1.1, autoAlpha: 0, filter: "blur(8px)", ease: "none" }, 0.1)
        .to("#hl-3", { xPercent: -9, scale: 1.03, autoAlpha: 0, filter: "blur(8px)", ease: "none" }, 0.16)
        .to(".hero-scroll", { autoAlpha: 0, ease: "none" }, 0);

      // light rolls across the chrome word as you leave
      gsap.fromTo(
        chrome.current,
        { "--sx": "160%" },
        {
          "--sx": "-120%",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "75% top", scrub: 0.6 },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <div ref={content} className="wrap relative z-10 pt-24 will-change-transform">
        <p className="hero-fi label mb-8 flex items-center gap-3 text-mist opacity-0">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-glint" />
          DFW • MOBILE AUTO DETAILING
        </p>

        <h1 className="headline text-[clamp(4.2rem,13.5vw,12.5rem)]">
          <Line className="hero-line" delay={0}>
            <span id="hl-1" className="inline-block">WE BRING</span>
          </Line>
          <Line className="hero-line" delay={0.06}>
            <span id="hl-2" className="inline-block">
              THE{" "}
              <span ref={chrome} className="chrome-text" data-text="SHINE">
                SHINE
              </span>
            </span>
          </Line>
          <Line className="hero-line" delay={0.12}>
            <span id="hl-3" className="inline-block">TO YOU.</span>
          </Line>
        </h1>

        <div className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-end md:justify-between">
          <p className="hero-fi max-w-md text-base leading-relaxed text-mist opacity-0 md:text-lg">
            Professional mobile detailing brought directly to your home or
            workplace — water and power included.
          </p>
          <div className="hero-fi flex flex-wrap items-center gap-4 opacity-0">
            <CTAButton label="GET A QUOTE" to="#contact" />
            <CTAButton label="CALL NOW" variant="ghost" href="tel:+19033633322" />
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div className="hero-scroll absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-8">
        <span className="label !text-[9px] text-mist/70">SCROLL</span>
        <div className="scroll-line" />
      </div>

      {/* soft top scrim for navbar legibility */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />
    </section>
  );
}
