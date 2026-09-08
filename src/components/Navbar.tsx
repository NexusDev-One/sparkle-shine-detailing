import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X, Phone } from "lucide-react";
import { gsap, scrollToSection } from "../lib/motion";
import { cn } from "../utils/cn";
import { Magnetic } from "./shared";

const LINKS = [
  { label: "Services", to: "#services" },
  { label: "Results", to: "#results" },
  { label: "Process", to: "#process" },
  { label: "Service Area", to: "#area" },
  { label: "Contact", to: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      gsap.set(menu, { pointerEvents: "auto" });
      gsap.to(menu, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
      gsap.fromTo(
        menu.querySelectorAll(".m-link"),
        { yPercent: 120 },
        { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "power4.out", delay: 0.1 }
      );
    } else {
      gsap.to(menu, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => gsap.set(menu, { pointerEvents: "none" }),
      });
    }
  }, [open]);

  const go = (to: string) => {
    setOpen(false);
    setTimeout(() => scrollToSection(to), open ? 380 : 0);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70]">
        <div
          ref={barRef}
          className={cn(
            "mx-auto flex items-center justify-between gap-4 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
            scrolled
              ? "mt-3 max-w-5xl rounded-full border border-snow/10 bg-ink/60 px-5 py-2.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl md:mt-4 md:px-7"
              : "mt-0 max-w-none border-transparent bg-transparent px-6 py-5 md:px-10"
          )}
        >
          {/* logo */}
          <button
            onClick={() => go("#top")}
            className="group flex flex-col leading-none"
            aria-label="Sparkle and Shine — home"
          >
            <span className="text-[13px] font-[850] tracking-[0.18em] text-snow">
              SPARKLE
            </span>
            <span className="text-[13px] font-[850] tracking-[0.18em] text-mist transition-colors group-hover:text-snow">
              &amp; SHINE
            </span>
          </button>

          {/* desktop links */}
          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <button
                key={l.to}
                onClick={() => go(l.to)}
                className="navlink label !text-[10px] !tracking-[0.24em] text-mist transition-colors hover:text-snow"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic strength={0.3}>
              <button
                onClick={() => go("#contact")}
                className="group hidden items-center gap-2 rounded-full bg-snow px-5 py-2.5 text-ink transition-colors hover:bg-glint sm:flex"
              >
                <span className="label !text-[10px] font-semibold !tracking-[0.22em]">
                  GET A QUOTE
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </Magnetic>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-snow/15 text-snow lg:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* mobile overlay menu */}
      <div
        ref={menuRef}
        className="pointer-events-none fixed inset-0 z-[65] flex flex-col justify-between bg-ink/85 px-8 pb-10 pt-28 opacity-0 backdrop-blur-2xl"
      >
        <nav className="flex flex-col gap-2">
          {LINKS.map((l, i) => (
            <span key={l.to} className="block overflow-hidden">
              <button
                onClick={() => go(l.to)}
                className="m-link headline flex items-baseline gap-4 !text-[13vw] text-snow sm:!text-6xl"
              >
                <span className="label !text-[10px] text-glint">0{i + 1}</span>
                {l.label.toUpperCase()}
              </button>
            </span>
          ))}
        </nav>
        <div className="flex flex-col gap-4">
          <a href="tel:+19033633322" className="flex items-center gap-3 text-snow">
            <Phone className="h-4 w-4 text-glint" />
            <span className="text-xl font-bold tracking-tight">903-363-3322</span>
          </a>
          <a
            href="mailto:youcansparkleandshine@gmail.com"
            className="text-sm text-mist"
          >
            youcansparkleandshine@gmail.com
          </a>
        </div>
      </div>
    </>
  );
}
