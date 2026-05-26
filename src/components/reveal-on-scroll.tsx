"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";

type RevealOnScrollProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section";
  threshold?: number;
  rootMargin?: string;
};

export function RevealOnScroll({
  as = "div",
  threshold = 0.12,
  rootMargin = "0px 0px -10% 0px",
  className = "",
  children,
  ...rest
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, threshold, rootMargin]);

  const motionCls = reduced
    ? ""
    : `transition-[opacity,transform] duration-700 ease-out will-change-[opacity,transform] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`;

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={`${motionCls} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
