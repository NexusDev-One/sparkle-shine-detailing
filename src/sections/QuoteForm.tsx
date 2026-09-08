import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { gsap, isReduced, revealLines, fadeIns } from "../lib/motion";
import { Eyebrow, Line } from "../components/shared";
import { bgState } from "../lib/bgState";

const SERVICE_OPTIONS = [
  "Dazzle Wash",
  "Glamorous Wash",
  "Sparkling Detail",
  "Interior Detailing",
  "Exterior Detailing",
  "Full Detail",
  "Not sure yet — help me choose",
];

export default function QuoteForm() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    revealLines(root.current!);
    fadeIns(root.current!);
    if (isReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".field",
        { y: 34, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: "form", start: "top 82%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const line = (k: string) => `${k}: ${d.get(k) || "—"}`;
    const body = [
      "QUOTE REQUEST — SPARKLE AND SHINE MOBILE DETAILING",
      "",
      line("Name"),
      line("Phone"),
      line("Email"),
      line("Vehicle"),
      line("Service"),
      line("City / ZIP"),
      line("Preferred Date"),
      "",
      "Message:",
      `${d.get("Message") || "—"}`,
    ].join("\n");
    const subject = `Quote Request — ${d.get("Service") || "Mobile Detail"} (${d.get("Name") || ""})`;
    window.location.href = `mailto:youcansparkleandshine@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section
      ref={root}
      id="contact"
      className="relative py-[16vh]"
      onFocusCapture={() => (bgState.focusBoost = 0.85)}
      onBlurCapture={() => (bgState.focusBoost = 0)}
    >
      <div className="wrap grid gap-16 lg:grid-cols-5 lg:gap-12">
        {/* left */}
        <div className="lg:col-span-2">
          <Eyebrow className="mb-8">GET A QUOTE</Eyebrow>
          <h2 className="headline text-[clamp(3.2rem,8vw,8rem)]">
            <Line>LET&rsquo;S MAKE</Line>
            <Line delay={0.07}>
              IT <span className="chrome-text" data-text="SHINE.">SHINE.</span>
            </Line>
          </h2>
          <p className="fi mt-8 max-w-sm text-sm leading-relaxed text-mist md:text-base">
            Tell us what you drive and where you are in DFW — we&rsquo;ll come
            back with a quote. Usually the same day.
          </p>

          <div className="mt-12 flex flex-col gap-5">
            <a href="tel:+19033633322" className="group flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-snow/15 text-glint transition-colors duration-300 group-hover:border-glint group-hover:bg-glint group-hover:text-ink">
                <Phone className="h-4 w-4" />
              </span>
              <span className="text-lg font-[700] tracking-tight text-snow md:text-xl">
                903-363-3322
              </span>
            </a>
            <a
              href="mailto:youcansparkleandshine@gmail.com"
              className="group flex items-center gap-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-snow/15 text-glint transition-colors duration-300 group-hover:border-glint group-hover:bg-glint group-hover:text-ink">
                <Mail className="h-4 w-4" />
              </span>
              <span className="break-all text-sm font-[600] text-snow/85 transition-colors group-hover:text-snow md:text-base">
                youcansparkleandshine@gmail.com
              </span>
            </a>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-snow/15 text-glint">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="text-sm text-mist">Dallas–Fort Worth, Texas — we come to you</span>
            </div>
          </div>
        </div>

        {/* form */}
        <form
          onSubmit={onSubmit}
          className="relative grid gap-x-8 gap-y-9 self-start sm:grid-cols-2 lg:col-span-3"
        >
          <div className="field">
            <label htmlFor="q-name">Name *</label>
            <input id="q-name" name="Name" required placeholder="Your name" autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="q-phone">Phone *</label>
            <input id="q-phone" name="Phone" type="tel" required placeholder="(___) ___-____" autoComplete="tel" />
          </div>
          <div className="field">
            <label htmlFor="q-email">Email</label>
            <input id="q-email" name="Email" type="email" placeholder="you@email.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="q-vehicle">Vehicle</label>
            <input id="q-vehicle" name="Vehicle" placeholder="Year / Make / Model" />
          </div>
          <div className="field">
            <label htmlFor="q-service">Service *</label>
            <select id="q-service" name="Service" required defaultValue="">
              <option value="" disabled>
                Select a level of shine
              </option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="q-city">City / ZIP</label>
            <input id="q-city" name="City / ZIP" placeholder="Where should we come?" />
          </div>
          <div className="field">
            <label htmlFor="q-date">Preferred Date</label>
            <input id="q-date" name="Preferred Date" type="date" />
          </div>
          <div className="field">
            <label htmlFor="q-msg">Message</label>
            <input id="q-msg" name="Message" placeholder="Anything we should know?" />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-snow py-5 transition-transform duration-300 active:scale-[0.99]"
            >
              <span className="absolute inset-0 -translate-x-[101%] bg-glint transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0" />
              <span className="label relative z-10 !text-[11px] font-semibold !tracking-[0.28em] text-ink">
                GET MY QUOTE
              </span>
              <ArrowUpRight className="relative z-10 h-4 w-4 text-ink transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            {sent && (
              <p className="mt-5 flex items-start gap-3 rounded-2xl border border-glint/30 bg-glint/10 p-4 text-sm leading-relaxed text-snow/90">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-glint" />
                Almost done — your email app just opened with everything
                pre-filled. Hit send, or skip the wait and call
                <a href="tel:+19033633322" className="ml-1 font-semibold text-glint">
                  903-363-3322
                </a>
              </p>
            )}
            <p className="label mt-4 !text-[8px] !leading-[1.8] text-mist/60">
              SUBMITTING OPENS YOUR EMAIL APP WITH THE DETAILS PRE-FILLED — NO
              SPAM, EVER.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
