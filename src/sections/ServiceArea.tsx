import { useEffect, useRef, useState } from "react";
import { Phone, MapPin, ExternalLink, Moon, Sun } from "lucide-react";
import { gsap, isReduced, revealLines, fadeIns } from "../lib/motion";
import { Eyebrow, Line } from "../components/shared";

const CITIES = [
  { name: "ALL DFW", query: "Dallas-Fort Worth Metroplex, TX", isAll: true },
  { name: "DALLAS", query: "Dallas, TX" },
  { name: "FORT WORTH", query: "Fort Worth, TX" },
  { name: "ARLINGTON", query: "Arlington, TX" },
  { name: "PLANO", query: "Plano, TX" },
  { name: "FRISCO", query: "Frisco, TX" },
  { name: "IRVING", query: "Irving, TX" },
];

const DFW_DEFAULT_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d428586.4253380489!2d-97.16858169128038!3d32.82390847958611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e6e122dc807ad%3A0xa4af8bf8dd69acbd!2sDallas-Fort%20Worth%20Metroplex%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus";

export default function ServiceArea() {
  const root = useRef<HTMLElement>(null);
  const [activeCity, setActiveCity] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    revealLines(root.current!);
    fadeIns(root.current!);
    if (isReduced()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".map-box",
        { y: 80, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".map-box", start: "top 85%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const currentMapUrl = CITIES[activeCity].isAll
    ? DFW_DEFAULT_EMBED
    : `https://maps.google.com/maps?q=${encodeURIComponent(CITIES[activeCity].query)}&t=&z=11&ie=UTF8&iwloc=&output=embed`;

  return (
    <section ref={root} id="area" className="relative overflow-hidden py-[14vh]">
      <div className="wrap grid items-center gap-16 lg:grid-cols-2">
        <div>
          <Eyebrow className="mb-8">SERVICE AREA</Eyebrow>
          <h2 className="headline text-[clamp(3.4rem,10vw,9.5rem)]">
            <Line>DFW.</Line>
            <Line delay={0.07}>
              WE&rsquo;RE <span className="text-outline">MOBILE.</span>
            </Line>
          </h2>
          <p className="fi mt-8 max-w-md text-sm leading-relaxed text-mist md:text-base">
            Based in the Dallas–Fort Worth metroplex and fully mobile — home,
            office, gym parking lot. If you&rsquo;re in the area, we come to you.
          </p>

          <div className="fi mt-10">
            <p className="label mb-3 !text-[10px] text-glint">
              CLICK A CITY TO VIEW COVERAGE ON GOOGLE MAPS:
            </p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setActiveCity(i)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wider transition-all ${
                    activeCity === i
                      ? "bg-glint text-ink shadow-[0_0_20px_rgba(59,167,255,0.4)]"
                      : "border border-snow/15 bg-coal/50 text-mist hover:border-snow/30 hover:text-snow"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="fi mt-12" data-d="0.1">
            <p className="label mb-4 !text-[10px] text-glint">
              NOT SURE IF WE COME TO YOUR AREA?
            </p>
            <a
              href="tel:+19033633322"
              className="group inline-flex items-center gap-4 text-[clamp(1.6rem,3.4vw,2.8rem)] font-[800] tracking-[-0.02em] text-snow"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-glint text-ink transition-transform duration-500 group-hover:rotate-[360deg]">
                <Phone className="h-5 w-5" />
              </span>
              <span className="navlink">CALL 903-363-3322</span>
            </a>
            <p className="mt-5 text-xs leading-relaxed text-mist/80">
              Exact service coverage is confirmed when you book.
            </p>
          </div>
        </div>

        {/* Real Interactive Google Maps Box */}
        <div className="map-box relative flex flex-col overflow-hidden rounded-3xl border border-snow/10 bg-coal/70 backdrop-blur-md">
          {/* Top header bar */}
          <div className="flex items-center justify-between border-b border-snow/10 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glint opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-glint" />
              </span>
              <span className="label !text-[10px] text-snow/90">
                GOOGLE MAPS — {CITIES[activeCity].name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to standard map colors" : "Switch to dark theme"}
                className="flex items-center gap-1 rounded-lg border border-snow/15 bg-steel/60 px-2.5 py-1 text-[10px] text-mist transition-colors hover:border-snow/30 hover:text-snow"
              >
                {darkMode ? <Sun className="h-3 w-3 text-glint" /> : <Moon className="h-3 w-3" />}
                <span className="hidden sm:inline">{darkMode ? "Light" : "Dark"}</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CITIES[activeCity].query)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-lg border border-snow/15 bg-steel/60 px-2.5 py-1 text-[10px] text-mist transition-colors hover:border-glint/50 hover:text-snow"
              >
                <span>Full Map</span>
                <ExternalLink className="h-3 w-3 text-glint" />
              </a>
            </div>
          </div>

          {/* Map iframe viewport */}
          <div className="relative h-[400px] w-full bg-ink sm:h-[460px] md:h-[500px]">
            <iframe
              key={currentMapUrl}
              title={`Google Map of ${CITIES[activeCity].name}`}
              src={currentMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={`h-full w-full transition-all duration-500 ${
                darkMode
                  ? "brightness-[0.88] contrast-[0.9] invert-[0.92] hue-rotate-180"
                  : ""
              }`}
            />

            {/* Subtle mobile badge overlay */}
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-xl border border-snow/15 bg-ink/80 px-3 py-2 shadow-lg backdrop-blur-md">
              <MapPin className="h-4 w-4 text-glint" />
              <div className="text-[11px] font-medium leading-tight text-snow">
                Mobile Detailing Unit
                <span className="block text-[9px] text-mist">We travel directly to your location</span>
              </div>
            </div>
          </div>

          {/* Bottom info bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-snow/10 px-5 py-3 text-[10px] text-mist/70">
            <span>LIVE INTERACTIVE GOOGLE MAP • DFW REGION</span>
            <span>MOBILE SERVICE RADIUS: 45+ MILES</span>
          </div>
        </div>
      </div>
    </section>
  );
}
