import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, isReduced, setLenis } from "./lib/motion";
import BackgroundCanvas from "./components/BackgroundCanvas";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import MobileCTA from "./components/MobileCTA";
import Hero from "./sections/Hero";
import Manifesto from "./sections/Manifesto";
import Services from "./sections/Services";
import Immersive from "./sections/Immersive";
import Showcase from "./sections/Showcase";
import BeforeAfter from "./sections/BeforeAfter";
import Marquee from "./sections/Marquee";
import Process from "./sections/Process";
import Gallery from "./sections/Gallery";
import Reviews from "./sections/Reviews";
import ServiceArea from "./sections/ServiceArea";
import QuoteForm from "./sections/QuoteForm";
import FinalCTA from "./sections/FinalCTA";
import Footer from "./sections/Footer";

export default function App() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    if (!isReduced()) {
      lenis = new Lenis({ lerp: 0.092, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts) document.fonts.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-ink font-display text-snow">
      {/* one continuous animated world behind everything */}
      <BackgroundCanvas />
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Manifesto />
        <Services />
        <Immersive />
        <Showcase />
        <BeforeAfter />
        <Marquee />
        <Process />
        <Gallery />
        <Reviews />
        <ServiceArea />
        <QuoteForm />
        <FinalCTA />
      </main>

      <Footer />
      <MobileCTA />
    </div>
  );
}
