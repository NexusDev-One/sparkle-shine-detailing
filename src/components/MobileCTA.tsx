import { useEffect, useRef } from "react";
import { Phone } from "lucide-react";
import { gsap, scrollToSection, isReduced } from "../lib/motion";

/** Sticky bottom CTA for mobile — appears after the hero. */
export default function MobileCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (isReduced()) {
      el.style.transform = "translateY(0)";
      return;
    }
    let shown = false;
    const onScroll = () => {
      const should = window.scrollY > window.innerHeight * 0.7;
      if (should === shown) return;
      shown = should;
      gsap.to(el, {
        yPercent: should ? 0 : 140,
        autoAlpha: should ? 1 : 0,
        duration: 0.55,
        ease: "power3.out",
      });
    };
    gsap.set(el, { yPercent: 140, autoAlpha: 0 });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-x-3 bottom-3 z-[60] flex gap-2 md:hidden"
    >
      <button
        onClick={() => scrollToSection("#contact")}
        className="label flex flex-1 items-center justify-center gap-2 rounded-full bg-snow py-4 !text-[11px] font-semibold !tracking-[0.24em] text-ink shadow-[0_16px_40px_-12px_rgba(0,0,0,0.9)]"
      >
        GET A QUOTE
      </button>
      <a
        href="tel:+19033633322"
        aria-label="Call now"
        className="flex w-14 items-center justify-center rounded-full border border-snow/20 bg-ink/70 text-snow backdrop-blur-lg"
      >
        <Phone className="h-4 w-4" />
      </a>
    </div>
  );
}
