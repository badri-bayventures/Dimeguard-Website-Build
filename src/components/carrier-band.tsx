"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { siteConfig, type CarrierLogo } from "@/site.config";
import { Container } from "./container";

/**
 * Independent / multi-carrier trust band. Renders the carrier + partner logos
 * from siteConfig.carriers (never hardcoded) as a quietly-alive strip:
 *
 * - Six fixed-size slots at every breakpoint: 2×3 on phones, 3×2 on tablets,
 *   one row of 6 on desktop.
 * - The full list cycles through the slots by crossfade-in-place — one slot at
 *   a time swaps its logo (out drifts down, in drifts up) on an offset
 *   schedule, so nothing ever scrolls or races.
 * - Cycling pauses when the band is off-screen (IntersectionObserver).
 * - If there are as many logos as slots (or fewer), cycling is skipped.
 * - prefers-reduced-motion / static fallback: ALL configured logos in a
 *   wrapped static grid (with a capped staggered reveal when motion is OK).
 * - Logos render in full brand color at all times and sit in fixed-size boxes
 *   so a swap never shifts layout.
 */

const DESKTOP_SLOTS = 6;
const SWAP_INTERVAL_MS = 2700;
const CROSSFADE_MS = 600;

export function CarrierBand() {
  const { enabled, items } = siteConfig.carriers;

  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // With 11 logos we always cycle; the branch below keeps the component correct
  // if the config ever shrinks to <= the slot count.
  const canCycle = items.length > DESKTOP_SLOTS && !reducedMotion;

  const [slots, setSlots] = useState<CarrierLogo[]>(() =>
    items.slice(0, DESKTOP_SLOTS),
  );
  const queueRef = useRef<CarrierLogo[]>(items.slice(DESKTOP_SLOTS));
  const nextSlotRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setRevealed(true);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!canCycle || !inView) return;
    const id = window.setInterval(() => {
      const slot = nextSlotRef.current;
      setSlots((prev) => {
        const queue = queueRef.current;
        if (queue.length === 0) return prev;
        const outgoing = prev[slot];
        const incoming = queue.shift() as CarrierLogo;
        queue.push(outgoing);
        const next = prev.slice();
        next[slot] = incoming;
        return next;
      });
      nextSlotRef.current = (slot + 1) % DESKTOP_SLOTS;
    }, SWAP_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [canCycle, inView]);

  if (!enabled || items.length === 0) return null;

  // Static presentation (reduced motion, or <= slot count): all logos.
  const staticItems = items;

  return (
    <section
      ref={sectionRef}
      aria-label="Independent multi-carrier appointments"
      className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]"
    >
      <Container className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink-soft)] md:text-xs">
            Independent — Multi-carrier
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[color:var(--color-ink)] md:text-4xl">
            We work with the carriers. We answer to you.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--color-muted)]">
            Dimeguard isn&rsquo;t tied to any one insurer — recommendations come
            from comparing across carriers like these, supported by estate- and
            trust-planning partners.
          </p>
        </div>

        {canCycle ? (
          <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-2 place-items-center gap-x-6 gap-y-8 sm:grid-cols-3 md:mt-14 md:gap-x-10 lg:grid-cols-6">
            {slots.map((logo, i) => (
              <li key={`slot-${i}`} className="flex w-full justify-center">
                <CrossfadeSlot logo={logo} animate={!reducedMotion} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-2 place-items-center gap-x-6 gap-y-8 sm:grid-cols-3 md:mt-14 md:gap-x-10 lg:grid-cols-6">
            {staticItems.map((logo, i) => (
              <li
                key={logo.file}
                className="flex w-full justify-center"
                style={
                  revealed && !reducedMotion
                    ? {
                        animation: `carrierReveal 500ms ease-out both`,
                        animationDelay: `${Math.min(i, 8) * 90}ms`,
                      }
                    : undefined
                }
              >
                <LogoImage logo={logo} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

/**
 * One slot. Keeps the outgoing logo mounted alongside the incoming one for the
 * duration of the crossfade so both can animate (no animation library needed).
 */
function CrossfadeSlot({
  logo,
  animate,
}: {
  logo: CarrierLogo;
  animate: boolean;
}) {
  const [current, setCurrent] = useState<CarrierLogo>(logo);
  const [previous, setPrevious] = useState<CarrierLogo | null>(null);

  useEffect(() => {
    if (logo.file === current.file) return;
    if (!animate) {
      setCurrent(logo);
      setPrevious(null);
      return;
    }
    setPrevious(current);
    setCurrent(logo);
    const t = window.setTimeout(() => setPrevious(null), CROSSFADE_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logo, animate]);

  return (
    <div className="relative flex h-[22px] w-[120px] items-center justify-center md:h-[30px] md:w-[150px]">
      {previous ? (
        <div
          key={`prev-${previous.file}`}
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: `carrierOut ${CROSSFADE_MS}ms ease-in-out both` }}
        >
          <LogoImage logo={previous} />
        </div>
      ) : null}
      <div
        key={`cur-${current.file}`}
        className="absolute inset-0 flex items-center justify-center"
        style={
          animate && previous
            ? { animation: `carrierIn ${CROSSFADE_MS}ms ease-in-out both` }
            : undefined
        }
      >
        <LogoImage logo={current} />
      </div>
    </div>
  );
}

function LogoImage({ logo }: { logo: CarrierLogo }) {
  return (
    <Image
      src={`/carriers/${logo.file}`}
      alt={logo.name}
      width={150}
      height={30}
      sizes="150px"
      style={{ width: "auto" }}
      className="h-[22px] max-w-[120px] object-contain md:h-[30px] md:max-w-[150px]"
    />
  );
}
