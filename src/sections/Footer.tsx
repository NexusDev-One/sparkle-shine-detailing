import { ArrowUp, Mail, Phone } from "lucide-react";
import { scrollToSection, getLenis } from "../lib/motion";
import { Magnetic } from "../components/shared";

const NAV = [
  { label: "Services", to: "#services" },
  { label: "Results", to: "#results" },
  { label: "Service Area", to: "#area" },
  { label: "Contact", to: "#contact" },
];

export default function Footer() {
  const toTop = () => {
    const l = getLenis();
    if (l) l.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-snow/10 pb-28 pt-20 md:pb-12">
      <div className="wrap">
        <div className="grid gap-14 md:grid-cols-12">
          {/* brand */}
          <div className="md:col-span-5">
            <button onClick={toTop} className="group text-left">
              <span className="headline block text-[clamp(2.6rem,5.5vw,4.8rem)] text-snow transition-colors group-hover:text-glint">
                SPARKLE
              </span>
              <span className="headline block text-[clamp(2.6rem,5.5vw,4.8rem)] text-outline transition-all group-hover:text-glint group-hover:[-webkit-text-stroke:0px]">
                &amp; SHINE
              </span>
            </button>
            <p className="label mt-5 !text-[10px] text-mist">MOBILE DETAILING</p>
          </div>

          {/* contact */}
          <div className="md:col-span-4">
            <p className="label mb-6 !text-[9px] text-mist/70">CONTACT</p>
            <div className="flex flex-col gap-4">
              <a
                href="tel:+19033633322"
                className="navlink inline-flex w-fit items-center gap-3 text-snow"
              >
                <Phone className="h-4 w-4 text-glint" />
                903-363-3322
              </a>
              <a
                href="mailto:youcansparkleandshine@gmail.com"
                className="navlink inline-flex w-fit items-center gap-3 break-all text-snow"
              >
                <Mail className="h-4 w-4 shrink-0 text-glint" />
                youcansparkleandshine@gmail.com
              </a>
              <span className="text-sm text-mist">Dallas–Fort Worth, TX — we come to you</span>
            </div>
          </div>

          {/* nav */}
          <div className="md:col-span-3">
            <p className="label mb-6 !text-[9px] text-mist/70">EXPLORE</p>
            <div className="flex flex-col gap-4">
              {NAV.map((l) => (
                <button
                  key={l.to}
                  onClick={() => scrollToSection(l.to)}
                  className="navlink w-fit text-left text-snow"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-snow/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-mist">
            © {new Date().getFullYear()} Sparkle and Shine Mobile Detailing — Dallas–Fort Worth, TX
          </p>
          <p className="text-xs text-mist/60">
            Demo imagery via Pexels — real customer gallery launching soon.
          </p>
          <Magnetic strength={0.4}>
            <button
              onClick={toTop}
              aria-label="Back to top"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-snow/20 text-snow transition-colors hover:border-glint hover:bg-glint hover:text-ink"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
