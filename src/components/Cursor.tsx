import { useEffect, useRef } from "react";
import { gsap, isTouch, isReduced } from "../lib/motion";

/**
 * Premium custom cursor (desktop only).
 * dot + trailing ring; expands on links, labels VIEW / DRAG on demand.
 * "image" mode: the cursor becomes a rounded image card (data-cursor-img).
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const imgCursorRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isTouch()) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const imgCursor = imgCursorRef.current!;
    const img = imgRef.current!;
    const reduced = isReduced();

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let mode: "default" | "link" | "label" | "image" = "default";
    let labelText = "";
    let currentImgSrc = "";
    let raf = 0;
    let visible = false;

    const setMode = (m: "default" | "link" | "label" | "image", text = "", imgSrc = "") => {
      if (m === mode && text === labelText && imgSrc === currentImgSrc) return;
      mode = m;
      labelText = text;
      currentImgSrc = imgSrc;

      if (m === "image") {
        // swap src if needed
        if (img.src !== imgSrc) img.src = imgSrc;
        gsap.to(imgCursor, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out" });
        gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
      } else {
        gsap.to(imgCursor, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: "power3.in" });

        if (m === "label") {
          label.textContent = text;
          gsap.to(ring, {
            width: 84,
            height: 84,
            backgroundColor: "rgba(246,247,248,0.96)",
            borderColor: "rgba(246,247,248,0)",
            duration: 0.35,
            ease: "power3.out",
          });
          gsap.to(label, { autoAlpha: 1, duration: 0.25 });
          gsap.to(dot, { autoAlpha: 0, duration: 0.15 });
        } else if (m === "link") {
          gsap.to(ring, {
            width: 56,
            height: 56,
            backgroundColor: "rgba(246,247,248,0)",
            borderColor: "rgba(246,247,248,0.9)",
            duration: 0.35,
            ease: "power3.out",
          });
          gsap.to(label, { autoAlpha: 0, duration: 0.15 });
          gsap.to(dot, { autoAlpha: 1, scale: 0.5, duration: 0.25 });
        } else {
          gsap.to(ring, {
            width: 34,
            height: 34,
            backgroundColor: "rgba(246,247,248,0)",
            borderColor: "rgba(246,247,248,0.45)",
            duration: 0.35,
            ease: "power3.out",
          });
          gsap.to(label, { autoAlpha: 0, duration: 0.15 });
          gsap.to(dot, { autoAlpha: 1, scale: 1, duration: 0.25 });
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t || typeof t.closest !== "function") return;

      // image-cursor mode
      const imgEl = t.closest<HTMLElement>("[data-cursor-img]");
      if (imgEl) {
        setMode("image", "", imgEl.dataset.cursorImg || "");
        return;
      }

      const labeled = t.closest<HTMLElement>("[data-cursor]");
      if (labeled) {
        setMode("label", labeled.dataset.cursor || "VIEW");
        return;
      }
      if (t.closest("a, button, [role='button'], input, select, textarea, label, .svc-row")) {
        setMode("link");
        return;
      }
      setMode("default");
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
      gsap.to(imgCursor, { autoAlpha: 0, duration: 0.2 });
    };

    const lerpFactor = reduced ? 1 : 0.16;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (x - rx) * lerpFactor;
      ry += (y - ry) * lerpFactor;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      // image cursor tracks exact mouse position (no lerp — feels glued to cursor)
      imgCursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (typeof window !== "undefined" && isTouch()) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[120] h-1.5 w-1.5 rounded-full bg-snow opacity-0"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[119] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-snow/45 opacity-0"
      >
        <span
          ref={labelRef}
          className="label select-none text-[9px] font-semibold tracking-[0.22em] text-ink opacity-0"
        />
      </div>

      {/* image cursor — becomes the pointer in the Services section */}
      <div
        ref={imgCursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[121] h-[200px] w-[160px] overflow-hidden rounded-2xl opacity-0 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
        style={{ transform: "translate3d(-9999px,-9999px,0) translate(-50%,-50%)" }}
      >
        <img
          ref={imgRef}
          src=""
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </>
  );
}
