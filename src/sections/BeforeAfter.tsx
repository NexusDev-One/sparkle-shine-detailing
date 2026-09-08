import { useEffect, useRef } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { gsap, isReduced, revealLines, fadeIns, clampN } from "../lib/motion";
import { Eyebrow, Line } from "../components/shared";
import { afterCar } from "../lib/media";

export default function BeforeAfter() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const beforeLayer = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const glowBand = useRef<HTMLDivElement>(null);

  useEffect(() => {
    revealLines(root.current!);
    fadeIns(root.current!);
    const reduced = isReduced();

    const state = { pos: 22, target: 62 };
    const apply = () => {
      const p = state.pos;
      if (beforeLayer.current)
        beforeLayer.current.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      if (handle.current) handle.current.style.left = `${p}%`;
      if (glowBand.current) {
        glowBand.current.style.left = `${p}%`;
        const vel = Math.min(1, Math.abs(state.target - state.pos) / 12);
        glowBand.current.style.opacity = `${0.15 + vel * 0.7}`;
      }
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      state.pos += (state.target - state.pos) * 0.16;
      apply();
    };
    raf = requestAnimationFrame(loop);
    apply();

    if (!reduced) {
      // intro sweep hint
      gsap.fromTo(
        state,
        { target: 22 },
        {
          target: 62,
          duration: 2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: frame.current, start: "top 70%", once: true },
        }
      );

      // frame reveal
      gsap.fromTo(
        frame.current,
        { clipPath: "inset(12% 6% 12% 6% round 24px)", scale: 0.96 },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top 92%", end: "top 35%", scrub: 0.6 },
        }
      );
    }

    const setFromEvent = (e: PointerEvent) => {
      const r = frame.current!.getBoundingClientRect();
      state.target = clampN(((e.clientX - r.left) / r.width) * 100, 2, 98);
    };
    const el = frame.current!;
    let dragging = false;
    const down = (e: PointerEvent) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      setFromEvent(e);
    };
    const move = (e: PointerEvent) => dragging && setFromEvent(e);
    const up = () => (dragging = false);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <section ref={root} className="relative py-[14vh]">
      <div className="wrap">
        <Eyebrow className="mb-8">BEFORE / AFTER</Eyebrow>
        <h2 className="headline text-[clamp(3rem,9vw,9rem)]">
          <Line>DRAG THE</Line>
          <Line delay={0.07}>
            <span className="text-outline">DIFFERENCE.</span>
          </Line>
        </h2>

        <div
          ref={frame}
          data-cursor="DRAG"
          className="relative mt-[8vh] h-[62vh] touch-pan-y select-none overflow-hidden rounded-3xl border border-snow/10 will-change-transform md:h-[74vh]"
        >
          {/* AFTER (base) */}
          <img
            src={afterCar}
            alt="Freshly detailed glossy black sedan"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <span className="label absolute right-6 top-6 z-10 rounded-full border border-snow/20 bg-ink/50 px-4 py-2 !text-[9px] text-snow backdrop-blur-md">
            AFTER
          </span>

          {/* BEFORE (clipped) */}
          <div
            ref={beforeLayer}
            className="absolute inset-0 z-10 will-change-[clip-path]"
            style={{ clipPath: "inset(0 78% 0 0)" }}
          >
            <img
              src={afterCar}
              alt=""
              aria-hidden
              className="dirty-filter absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            {/* road grime overlays */}
            <div
              className="absolute inset-0 mix-blend-multiply"
              style={{
                background:
                  "radial-gradient(60% 45% at 30% 78%, rgba(74,60,42,0.55), transparent 70%), radial-gradient(45% 38% at 72% 70%, rgba(60,52,40,0.5), transparent 70%), radial-gradient(80% 60% at 50% 30%, rgba(52,48,40,0.35), transparent 75%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3a3226]/35 via-transparent to-transparent mix-blend-multiply" />
            <span className="label absolute left-6 top-6 rounded-full border border-snow/20 bg-ink/50 px-4 py-2 !text-[9px] text-snow backdrop-blur-md">
              BEFORE
            </span>
          </div>

          {/* moving light following the handle */}
          <div
            ref={glowBand}
            className="pointer-events-none absolute inset-y-0 z-10 w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-snow/25 to-transparent opacity-30 blur-md"
          />

          {/* handle */}
          <div
            ref={handle}
            className="absolute inset-y-0 z-20 -translate-x-1/2"
            style={{ left: "22%" }}
          >
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-snow/90 shadow-[0_0_20px_rgba(246,247,248,0.7)]" />
            <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-snow/40 bg-ink/60 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <ChevronsLeftRight className="h-5 w-5 text-snow" />
            </div>
          </div>

          <span className="label pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 !text-[9px] text-snow/60">
            DRAG TO COMPARE — DEMONSTRATION VEHICLE
          </span>
        </div>

        <div className="mt-[10vh]">
          <h3 className="headline text-[clamp(2.6rem,7.5vw,7.5rem)]">
            <Line>
              <span className="text-outline">NOT JUST CLEAN.</span>
            </Line>
            <Line delay={0.08}>
              FINISHED<span className="text-glint">.</span>
            </Line>
          </h3>
          <p className="fi mt-8 max-w-md text-sm leading-relaxed text-mist md:text-base">
            Every service ends at the same standard — no shortcuts, no “good
            enough”. Request a quote and see it in your own driveway.
          </p>
        </div>
      </div>
    </section>
  );
}
