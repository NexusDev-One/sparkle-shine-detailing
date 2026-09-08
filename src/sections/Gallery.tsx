import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { gsap, isReduced, isTouch, revealLines, fadeIns } from "../lib/motion";
import { Eyebrow, Line } from "../components/shared";
import { MEDIA } from "../lib/media";

const SHAPES = [
  { w: "w-[78vw] md:w-[42vw]", h: "h-[54vh] md:h-[62vh]", mt: "" },
  { w: "w-[66vw] md:w-[30vw]", h: "h-[44vh] md:h-[46vh]", mt: "md:mt-[16vh]" },
  { w: "w-[80vw] md:w-[38vw]", h: "h-[58vh] md:h-[70vh]", mt: "md:mt-[4vh]" },
  { w: "w-[60vw] md:w-[26vw]", h: "h-[42vh] md:h-[40vh]", mt: "md:mt-[20vh]" },
  { w: "w-[82vw] md:w-[40vw]", h: "h-[56vh] md:h-[64vh]", mt: "md:mt-[8vh]" },
  { w: "w-[58vw] md:w-[22vw]", h: "h-[40vh] md:h-[38vh]", mt: "md:mt-[18vh]" },
];

export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const horizontal = !isReduced() && !isTouch();

  useEffect(() => {
    revealLines(root.current!);
    fadeIns(root.current!);
    if (!horizontal) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const getDist = () => Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.06);

      gsap.to(track, {
        x: () => -getDist(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [horizontal]);

  /* lightbox animation */
  useEffect(() => {
    const lb = lightRef.current;
    if (!lb) return;
    if (open !== null) {
      gsap.set(lb, { pointerEvents: "auto" });
      gsap.to(lb, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(lb.querySelector("img"), { scale: 0.92, y: 30 }, { scale: 1, y: 0, duration: 0.65, ease: "power3.out" });
    } else {
      gsap.to(lb, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: () => gsap.set(lb, { pointerEvents: "none" }),
      });
    }
  }, [open]);

  const panels = (
    <>
      {MEDIA.gallery.map((g, i) => (
        <figure
          key={g.src}
          className={`gal-panel group relative shrink-0 snap-center overflow-hidden rounded-2xl border border-snow/10 isolate ${SHAPES[i].w} ${SHAPES[i].h} ${SHAPES[i].mt}`}
          data-cursor="VIEW"
          onClick={() => setOpen(i)}
        >
          <img
            src={g.src}
            alt={g.cap}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-40" />
          <figcaption className="label absolute bottom-5 left-5 z-10 !text-[9px] text-snow/85">
            {g.cap}
          </figcaption>
          <span className="label absolute right-5 top-5 z-10 !text-[9px] text-snow/50">
            0{i + 1}
          </span>
        </figure>
      ))}
      <figcaption className="flex shrink-0 items-end pb-4 pl-2 md:w-[22vw]">
        <p className="label max-w-[220px] !text-[9px] !leading-[1.9] text-mist">
          SHOWCASE GALLERY — REPRESENTATIVE FINISHES & CLIENT TRANSFORMATIONS. REAL DFW CUSTOMER
          GALLERY LAUNCHING SOON.
        </p>
      </figcaption>
    </>
  );

  return (
    <section ref={root} id="results" className="relative pt-[14vh]">
      <div className="wrap">
        <Eyebrow className="mb-8">RESULTS</Eyebrow>
        <h2 className="headline text-[clamp(3rem,9vw,9rem)]">
          <Line>THE RESULT</Line>
          <Line delay={0.07}>
            <span className="text-outline">SPEAKS FOR ITSELF.</span>
          </Line>
        </h2>
      </div>

      {horizontal ? (
        <div ref={wrapRef} className="relative mt-[6vh] h-[340vh]">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <div ref={trackRef} className="flex items-start gap-[4vw] px-[6vw] will-change-transform">
              {panels}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-[6vh] flex snap-x snap-mandatory items-start gap-5 overflow-x-auto px-6 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {panels}
        </div>
      )}

      {/* lightbox */}
      <div
        ref={lightRef}
        className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center bg-ink/90 p-6 opacity-0 backdrop-blur-xl"
        onClick={() => setOpen(null)}
      >
        {open !== null && (
          <>
            <img
              src={MEDIA.gallery[open].src}
              alt={MEDIA.gallery[open].cap}
              className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            <span className="label absolute bottom-8 left-1/2 -translate-x-1/2 !text-[9px] text-snow/70">
              {MEDIA.gallery[open].cap}
            </span>
          </>
        )}
        <button
          aria-label="Close"
          className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-snow/25 text-snow"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
