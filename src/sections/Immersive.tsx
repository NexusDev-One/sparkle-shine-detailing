import { useEffect, useRef } from "react";
import { gsap, isReduced, clampN } from "../lib/motion";
import { bgState } from "../lib/bgState";
import { Line } from "../components/shared";

const STAGES = [
  {
    k: "STAGE 01 — ARRIVAL",
    top: "WE COME",
    bottom: "TO YOU.",
    sub: "Driveway, office, or anywhere in DFW.",
  },
  {
    k: "STAGE 02 — ONBOARD WATER",
    top: "WE BRING",
    bottom: "THE WATER.",
    sub: "Our rigs carry their own water supply.",
    fx: "water",
  },
  {
    k: "STAGE 03 — SELF-POWERED",
    top: "WE BRING",
    bottom: "THE POWER.",
    sub: "Our equipment brings its own electricity.",
    fx: "power",
  },
  {
    k: "THE RESULT",
    top: "YOU JUST",
    bottom: "ENJOY THE SHINE.",
    sub: "No errands. No hookups. No waiting rooms.",
  },
];

export default function Immersive() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReduced()) return;
    const stages = gsap.utils.toArray<HTMLElement>(".im-stage");
    const ticks = gsap.utils.toArray<HTMLElement>(".im-tick");

    const ctx = gsap.context(() => {
      gsap.set(stages, { autoAlpha: 0 });
      gsap.set(stages[0], { autoAlpha: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            const sf = p * (STAGES.length - 1);
            const water = clampN(1 - Math.abs(sf - 1) / 0.7, 0, 1);
            const power = clampN(1 - Math.abs(sf - 2) / 0.7, 0, 1);
            bgState.override = {
              water: 0.3 + water * 0.65,
              drops: 0.5 + water * 0.5,
              trails: 0.45 + power * 0.95,
              parts: 0.25 + power * 0.75,
              metal: 0.55,
            };
            ticks.forEach((tk, i) => {
              const on = sf >= i - 0.35;
              tk.style.background = on ? "rgba(59,167,255,0.9)" : "rgba(246,247,248,0.18)";
              tk.style.width = on ? "2.5rem" : "1.25rem";
            });
          },
          onLeave: () => (bgState.override = null),
          onLeaveBack: () => (bgState.override = null),
        },
      });

      stages.forEach((st, i) => {
        if (i === 0) {
          const first = st.querySelectorAll(".rl > span");
          tl.fromTo(first, { yPercent: 110 }, { yPercent: 0, duration: 0.5, stagger: 0.06 }, 0.02);
        }
        if (i > 0) {
          tl.fromTo(
            st,
            { autoAlpha: 0, scale: 1.14, filter: "blur(14px)" },
            { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.55 },
            i
          );
          // lines slide up inside the incoming stage
          const inners = st.querySelectorAll(".rl > span");
          tl.fromTo(inners, { yPercent: 110 }, { yPercent: 0, duration: 0.5, stagger: 0.06 }, i + 0.05);
        }
        if (i < stages.length - 1) {
          tl.to(st, { autoAlpha: 0, scale: 0.94, filter: "blur(10px)", duration: 0.5 }, i + 0.62);
        }
      });
      tl.to({}, { duration: 0.3 }); // breathing room at the end
    }, root);
    return () => {
      bgState.override = null;
      ctx.revert();
    };
  }, []);

  const reduced = isReduced();

  const stageContent = (s: (typeof STAGES)[number]) => (
    <>
      {s.fx === "water" && (
        <>
          <span className="ripple-ring" />
          <span className="ripple-ring" style={{ animationDelay: "1.7s" }} />
        </>
      )}
      {s.fx === "power" && (
        <>
          <span className="spark-line left-[10%] top-[30%] w-[80vw]" />
          <span className="spark-line left-[10%] top-[52%] w-[80vw]" style={{ animationDelay: "0.8s" }} />
          <span className="spark-line left-[10%] top-[72%] w-[80vw]" style={{ animationDelay: "1.5s" }} />
        </>
      )}
      <div className="relative z-10 text-center">
        <p className="label mb-6 !text-[10px] text-glint">{s.k}</p>
        <h3 className="headline text-[clamp(3.4rem,11vw,10.5rem)]">
          <Line>{s.top}</Line>
          <Line delay={0.05}>
            {s.bottom.includes("SHINE") ? (
              <>
                ENJOY THE <span className="chrome-text" data-text="SHINE.">SHINE.</span>
              </>
            ) : s.bottom.includes("WATER") ? (
              <>
                THE <span className="text-glint">WATER.</span>
              </>
            ) : s.bottom.includes("POWER") ? (
              <>
                THE <span className="text-glint">POWER.</span>
              </>
            ) : (
              s.bottom
            )}
          </Line>
        </h3>
        <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-mist md:text-base">
          {s.sub}
        </p>
      </div>
    </>
  );

  /* reduced-motion: plain stacked stages */
  if (reduced) {
    return (
      <section className="relative">
        {STAGES.map((s) => (
          <div key={s.k} className="flex min-h-[70vh] items-center justify-center py-16">
            {stageContent(s)}
          </div>
        ))}
      </section>
    );
  }

  return (
    <div ref={root} className="relative" style={{ height: `${STAGES.length * 110 + 130}vh` }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {STAGES.map((s) => (
          <div key={s.k} className="im-stage absolute inset-0 flex items-center justify-center will-change-transform">
            {stageContent(s)}
          </div>
        ))}
        {/* progress ticks */}
        <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {STAGES.map((s, i) => (
            <span
              key={s.k}
              className="im-tick h-[3px] w-5 rounded-full bg-snow/20 transition-all duration-500"
              style={i === 0 ? { width: "2.5rem", background: "rgba(59,167,255,0.9)" } : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
