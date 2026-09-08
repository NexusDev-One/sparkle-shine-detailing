import { useEffect, useRef } from "react";
import { gsap, isReduced } from "../lib/motion";
import { MEDIA } from "../lib/media";

const LAYERS = [
  { img: MEDIA.showcase.paint, label: "PAINT", sub: "Machine-polished to a deep, wet gloss." },
  { img: MEDIA.showcase.interior, label: "INTERIOR", sub: "Every surface cleaned, conditioned, reset." },
  { img: MEDIA.showcase.wheels, label: "WHEELS", sub: "Barrels, faces and tires fully dressed." },
  { img: MEDIA.showcase.detail, label: "DETAIL", sub: "Edges, emblems, crevices — finished by hand." },
];

export default function Showcase() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReduced()) return;
    const layers = gsap.utils.toArray<HTMLElement>(".sc-layer");
    const bars = gsap.utils.toArray<HTMLElement>(".sc-bar");

    const ctx = gsap.context(() => {
      gsap.set(layers, { autoAlpha: 0 });
      gsap.set(layers[0], { autoAlpha: 1 });
      gsap.set(".sc-reveal", { yPercent: 60, autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
          onUpdate: (self) => {
            const sf = self.progress * (LAYERS.length - 1);
            bars.forEach((b, i) => {
              const p = Math.max(0, Math.min(1, sf - i + 1));
              b.style.transform = `scaleY(${i === 0 ? Math.max(p, 0.06) : p})`;
            });
          },
        },
      });

      layers.forEach((layer, i) => {
        const img = layer.querySelector("img");
        const txt = layer.querySelectorAll(".sc-reveal");
        if (i > 0) {
          tl.fromTo(
            layer,
            { autoAlpha: 0, scale: 1.18, filter: "blur(10px)" },
            { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.6 },
            i
          );
        }
        // camera keeps pushing closer within each layer
        tl.fromTo(img, { scale: 1.12, yPercent: -4 }, { scale: 1.02, yPercent: 4, duration: 1 }, i);
        tl.fromTo(txt, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06 }, i + 0.1);
        if (i < layers.length - 1) {
          tl.to(layer, { autoAlpha: 0, scale: 1.06, filter: "blur(8px)", duration: 0.5 }, i + 0.72);
        }
      });
      tl.to({}, { duration: 0.3 });
    }, root);
    return () => ctx.revert();
  }, []);

  if (isReduced()) {
    return (
      <section className="wrap grid gap-6 py-24 md:grid-cols-2">
        {LAYERS.map((l, i) => (
          <figure key={l.label} className="relative overflow-hidden rounded-2xl">
            <img src={l.img} alt={l.label} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <figcaption className="label absolute bottom-4 left-5 !text-[10px] text-snow">
              0{i + 1} — {l.label}
            </figcaption>
          </figure>
        ))}
      </section>
    );
  }

  return (
    <div ref={root} className="relative h-[420vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {LAYERS.map((l, i) => (
          <div key={l.label} className="sc-layer absolute inset-0 will-change-transform">
            <img
              src={l.img}
              alt={l.label}
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/40" />
            <div className="absolute inset-x-0 bottom-0 pb-[10vh]">
              <div className="wrap flex items-end justify-between gap-6">
                <div className="overflow-hidden">
                  <span className="sc-reveal label mb-4 block !text-[10px] text-glint">
                    0{i + 1} / 04 — IN FOCUS
                  </span>
                  <h3 className="sc-reveal headline block text-[clamp(3.4rem,11vw,11rem)] text-snow">
                    {l.label}
                  </h3>
                </div>
                <p className="sc-reveal mb-3 hidden max-w-[240px] text-right text-sm leading-snug text-snow/75 md:block">
                  {l.sub}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* progress rail */}
        <div className="absolute right-6 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 md:right-10">
          {LAYERS.map((l) => (
            <span key={l.label} className="h-10 w-[3px] overflow-hidden rounded-full bg-snow/15">
              <span className="sc-bar block h-full w-full origin-top scale-y-0 rounded-full bg-glint" />
            </span>
          ))}
        </div>

        <p className="label absolute left-6 top-28 z-20 !text-[9px] text-snow/50 md:left-10">
          THE STANDARD — EVERY VEHICLE, EVERY VISIT
        </p>
      </div>
    </div>
  );
}
