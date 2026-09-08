import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, isReduced } from "../lib/motion";

const WORDS = ["MOBILE DETAILING", "DFW", "WE COME TO YOU", "WATER INCLUDED", "POWER INCLUDED"];

function Row({ outline }: { outline?: boolean }) {
  const items = Array.from({ length: 6 }).flatMap(() => WORDS);
  return (
    <div className="mq-row flex w-max items-baseline whitespace-nowrap will-change-transform">
      {items.map((w, i) => (
        <span key={i} className="flex items-baseline">
          <span
            className={
              "mx-6 text-[clamp(2.6rem,7.5vw,7.5rem)] font-[850] uppercase leading-none tracking-[-0.03em] " +
              (outline ? "text-outline-faint" : "text-snow")
            }
          >
            {w}
          </span>
          <span className="h-3 w-3 shrink-0 translate-y-[-0.4em] rounded-full bg-glint/80 md:h-4 md:w-4" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mq-a",
        { xPercent: 2 },
        {
          xPercent: -22,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
      gsap.fromTo(
        ".mq-b",
        { xPercent: -24 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.4 },
        }
      );

      // motion-blur style skew from scroll velocity
      const clampSkew = gsap.utils.clamp(-7, 7);
      const proxy = { skew: 0 };
      const setSkew = gsap.quickSetter(".mq-row", "skewX", "deg");
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const s = clampSkew(self.getVelocity() / -380);
          if (Math.abs(s) > Math.abs(proxy.skew)) {
            proxy.skew = s;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.9,
              ease: "power3",
              overwrite: true,
              onUpdate: () => setSkew(proxy.skew),
            });
          }
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden py-[10vh]">
      <div className="mq-a">
        <Row />
      </div>
      <div className="mq-b mt-6 md:mt-10">
        <Row outline />
      </div>
    </section>
  );
}
