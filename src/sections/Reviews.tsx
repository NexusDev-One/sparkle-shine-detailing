import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star, BadgeCheck } from "lucide-react";
import { gsap, isReduced } from "../lib/motion";
import { Eyebrow, Magnetic } from "../components/shared";

/** Placeholder structure — verified reviews will replace these once collected. */
const REVIEWS = [
  {
    quote:
      "This is where your five-star story goes. Sparkle & Shine is now collecting verified Google reviews from DFW driveways.",
    name: "Your Name Here",
    meta: "Dallas–Fort Worth, TX",
  },
  {
    quote:
      "Book a detail, watch your vehicle transform in your own driveway — then tell all of DFW about it right here.",
    name: "Future Customer",
    meta: "Dallas–Fort Worth, TX",
  },
  {
    quote:
      "Real words from real customers will occupy this space soon. No invented testimonials — only verified feedback.",
    name: "Next In Line",
    meta: "Dallas–Fort Worth, TX",
  },
];

export default function Reviews() {
  const root = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);

  const animateTo = (dir: 1 | -1) => {
    const card = cardRef.current;
    if (!card || busy) return;
    setBusy(true);
    gsap.to(card, {
      y: dir * -46,
      autoAlpha: 0,
      filter: "blur(8px)",
      duration: 0.42,
      ease: "power2.in",
      onComplete: () => {
        setIndex((i) => (i + dir + REVIEWS.length) % REVIEWS.length);
        gsap.fromTo(
          card,
          { y: dir * 46, autoAlpha: 0, filter: "blur(8px)" },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            onComplete: () => setBusy(false),
          }
        );
      },
    });
  };

  useEffect(() => {
    if (isReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".rv-in",
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        }
      );
      gsap.fromTo(
        ".rv-mark",
        { scale: 0.6, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 0.06,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const r = REVIEWS[index];

  return (
    <section ref={root} className="relative flex min-h-[92vh] items-center overflow-hidden py-[14vh]">
      <span
        aria-hidden
        className="rv-mark pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[70vw] font-[900] leading-none text-snow md:text-[34vw]"
      >
        &rdquo;
      </span>

      <div className="wrap relative z-10 flex flex-col items-center text-center">
        <Eyebrow className="rv-in mb-10 justify-center">REVIEWS</Eyebrow>

        <div ref={cardRef} className="flex max-w-5xl flex-col items-center will-change-transform">
          <div className="mb-8 flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-glint text-glint" strokeWidth={1} />
            ))}
          </div>

          <blockquote className="text-[clamp(1.6rem,3.6vw,3.2rem)] font-[650] leading-[1.18] tracking-[-0.02em] text-snow">
            &ldquo;{r.quote}&rdquo;
          </blockquote>

          <div className="mt-10 flex items-center gap-3">
            <span className="label inline-flex items-center gap-2 rounded-full border border-glint/40 bg-glint/10 px-4 py-2 !text-[9px] text-glint">
              <BadgeCheck className="h-3.5 w-3.5" />
              PLACEHOLDER — VERIFIED CUSTOMER REVIEW
            </span>
          </div>

          <p className="mt-6 text-lg font-[700] tracking-tight text-snow">{r.name}</p>
          <p className="label mt-2 !text-[9px] text-mist">{r.meta}</p>
        </div>

        <div className="mt-14 flex items-center gap-6">
          <Magnetic strength={0.4}>
            <button
              onClick={() => animateTo(-1)}
              aria-label="Previous review"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-snow/25 text-snow transition-colors duration-300 hover:border-glint hover:bg-glint hover:text-ink"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Magnetic>
          <span className="label !text-[10px] text-mist">
            {index + 1} / {REVIEWS.length}
          </span>
          <Magnetic strength={0.4}>
            <button
              onClick={() => animateTo(1)}
              aria-label="Next review"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-snow/25 text-snow transition-colors duration-300 hover:border-glint hover:bg-glint hover:text-ink"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
