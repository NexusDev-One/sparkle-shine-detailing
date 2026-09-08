import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { gsap, isReduced, isTouch, revealLines, fadeIns } from "../lib/motion";
import { Eyebrow, Line } from "../components/shared";
import { MEDIA } from "../lib/media";
import { cn } from "../utils/cn";

const SERVICES = [
  { n: "01", name: "DAZZLE WASH", tag: "The essential exterior hand wash & dry." },
  { n: "02", name: "GLAMOROUS WASH", tag: "Hand wash, glowing wax, wheels & tires dressed." },
  { n: "03", name: "SPARKLING DETAIL", tag: "A complete inside-out refresh for daily drivers." },
  { n: "04", name: "INTERIOR DETAILING", tag: "Deep-clean cabin — seats, carpets, vents, glass." },
  { n: "05", name: "EXTERIOR DETAILING", tag: "Decontamination, polish and lasting protection." },
  { n: "06", name: "FULL DETAIL", tag: "The complete top-to-bottom transformation." },
];

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const touch = isTouch();

  useEffect(() => {
    revealLines(root.current!);
    fadeIns(root.current!);
    if (isReduced()) return;

    const ctx = gsap.context(() => {
      // rows cascade in
      gsap.fromTo(
        ".svc-row",
        { y: 70, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: ".svc-list", start: "top 82%" },
        }
      );
    }, root);

    if (touch || !glow.current) return () => ctx.revert();

    // ambient glow follows cursor
    const gx = gsap.quickTo(glow.current, "x", { duration: 1.1, ease: "power3.out" });
    const gy = gsap.quickTo(glow.current, "y", { duration: 1.1, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const sectionR = root.current!.getBoundingClientRect();
      gx(e.clientX - sectionR.left - 300);
      gy(e.clientY - sectionR.top - 300);
    };
    root.current!.addEventListener("pointermove", onMove);
    return () => {
      ctx.revert();
      root.current?.removeEventListener("pointermove", onMove);
    };
  }, [touch]);

  return (
    <section ref={root} id="services" className="relative py-[14vh]">
      {/* light following cursor */}
      <div
        ref={glow}
        className="pointer-events-none absolute left-0 top-0 z-0 hidden h-[600px] w-[600px] rounded-full bg-glint/[0.07] blur-[120px] mix-blend-screen md:block"
      />

      <div className="wrap relative z-10">
        <Eyebrow className="mb-8">SERVICES</Eyebrow>
        <h2 className="headline text-[clamp(3rem,9vw,9rem)]">
          <Line>CHOOSE YOUR</Line>
          <Line delay={0.07}>
            LEVEL OF <span className="text-glint">SHINE.</span>
          </Line>
        </h2>

        {/* cursor-none on desktop so the image cursor takes over */}
        <div className="svc-list relative mt-[9vh] md:cursor-none" onPointerLeave={() => setActive(null)}>
          {SERVICES.map((s, i) => (
            <div key={s.n} data-cursor-img={MEDIA.services[i]} className="border-t border-snow/10 last:border-b">
              <div
                role="button"
                tabIndex={0}
                onPointerEnter={() => !touch && setActive(i)}
                onClick={() => setActive(active === i ? null : i)}
                onKeyDown={(e) => e.key === "Enter" && setActive(i)}
                className={cn(
                  "svc-row group relative flex items-center gap-5 overflow-hidden py-7 outline-none transition-all duration-500 md:gap-10 md:py-9",
                  active !== null && active !== i && "opacity-30 blur-[1px]"
                )}
              >
                {/* hover wash */}
                <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-r from-snow/[0.05] via-snow/[0.03] to-transparent transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100" />

                <span className="label w-10 shrink-0 !text-[11px] text-mist transition-colors duration-300 group-hover:text-glint">
                  {s.n}
                </span>

                <h3 className="relative z-10 flex-1 text-[clamp(1.55rem,4.6vw,4.2rem)] font-[850] uppercase leading-none tracking-[-0.02em] text-snow transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-3 group-hover:tracking-[0]">
                  {s.name}
                </h3>

                <p className="hidden max-w-[220px] shrink-0 text-right text-sm leading-snug text-mist transition-colors duration-300 group-hover:text-snow/80 lg:block">
                  {s.tag}
                </p>

                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-snow/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-glint group-hover:bg-glint md:h-14 md:w-14">
                  <ArrowUpRight className="h-4 w-4 text-snow transition-colors duration-300 group-hover:text-ink md:h-5 md:w-5" />
                </span>
              </div>

              {/* mobile accordion image */}
              <div
                className={cn(
                  "grid transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] md:hidden",
                  active === i ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <img
                    src={MEDIA.services[i]}
                    alt={s.name}
                    loading="lazy"
                    className="h-52 w-full rounded-xl object-cover"
                  />
                  <p className="mt-3 text-sm text-mist">{s.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="fi mt-12 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-mist">
          Not sure which level your vehicle needs?
          <a
            href="tel:+19033633322"
            className="group inline-flex items-center gap-2 font-semibold text-snow"
          >
            <Phone className="h-3.5 w-3.5 text-glint" />
            <span className="navlink">Call 903-363-3322</span>
          </a>
        </p>
      </div>
    </section>
  );
}
