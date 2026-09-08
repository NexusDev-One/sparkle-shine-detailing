import { useRef, type ReactNode, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, isTouch, scrollToSection } from "../lib/motion";
import { cn } from "../utils/cn";

/* ---------------- Magnetic wrapper ---------------- */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (isTouch() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const relX = e.clientX - (r.left + r.width / 2);
    const relY = e.clientY - (r.top + r.height / 2);
    gsap.to(ref.current, {
      x: relX * strength,
      y: relY * strength,
      duration: 0.4,
      ease: "power3.out",
    });
  };
  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.35)" });
  };

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}

/* ---------------- Masked line ---------------- */
export function Line({
  children,
  className,
  innerClassName,
  delay,
  style,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <span className={cn("rl", className)} data-d={delay} style={style}>
      <span className={innerClassName}>{children}</span>
    </span>
  );
}

/* ---------------- Eyebrow label ---------------- */
export function Eyebrow({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={cn("fi flex items-center gap-3", className)} data-d={delay}>
      <span className="h-px w-10 bg-glint/80" />
      <span className="label text-mist">{children}</span>
    </div>
  );
}

/* ---------------- CTA buttons ---------------- */
export function CTAButton({
  label,
  variant = "solid",
  href,
  to,
  className,
  icon = true,
}: {
  label: string;
  variant?: "solid" | "ghost";
  href?: string;
  to?: string;
  className?: string;
  icon?: boolean;
}) {
  const inner = (
    <span
      className={cn(
        "group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 transition-colors duration-500",
        variant === "solid"
          ? "bg-snow text-ink"
          : "border border-snow/25 text-snow hover:border-snow/60",
        className
      )}
    >
      {variant === "solid" && (
        <span className="absolute inset-0 -translate-x-[101%] rounded-full bg-glint transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:translate-x-0" />
      )}
      <span className="label relative z-10 !text-[11px] font-semibold !tracking-[0.26em]">
        {label}
      </span>
      {icon && (
        <ArrowUpRight
          className="relative z-10 h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
          strokeWidth={2.2}
        />
      )}
    </span>
  );

  const handle = (e: React.MouseEvent) => {
    if (to) {
      e.preventDefault();
      scrollToSection(to);
    }
  };

  return (
    <Magnetic>
      <a href={href || to || "#"} onClick={handle} className="inline-block" data-hover>
        {inner}
      </a>
    </Magnetic>
  );
}
