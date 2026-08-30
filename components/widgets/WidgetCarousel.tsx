"use client";

import { useEffect, useRef, useState } from "react";
import { WidgetEligible } from "@/lib/types";
import WidgetCard from "./WidgetCard";

// Poll cadence for widget eligibility (covers the live-match check, which is
// the only time-sensitive one — festival/horoscope barely change minute to
// minute but re-checking them here too keeps this the single source of truth).
const POLL_INTERVAL_MS = 2.5 * 60 * 1000;

export default function WidgetCarousel() {
  const [widgets, setWidgets] = useState<WidgetEligible[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/widgets/eligible");
        const data = await res.json();
        if (!cancelled) setWidgets(data.widgets ?? []);
      } catch {
        if (!cancelled) setWidgets((prev) => prev ?? []);
      }
    }

    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !widgets || widgets.length < 2) return;

    function onScroll() {
      if (!track) return;
      const containerCenter = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let minDistance = Infinity;
      Array.from(track.children).forEach((child, index) => {
        const el = child as HTMLElement;
        const cardCenter = el.offsetLeft - track.offsetLeft + el.clientWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closest = index;
        }
      });
      setActiveIndex(closest);
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [widgets]);

  if (!widgets || widgets.length === 0) return null;

  if (widgets.length === 1) {
    return (
      <section className="py-4 px-4">
        <WidgetCard widget={widgets[0]} />
      </section>
    );
  }

  return (
    <section className="py-4 bg-surface-container-lowest">
      <div
        ref={trackRef}
        className="widget-carousel px-4 items-stretch"
      >
        {widgets.map((widget, i) => (
          <div
            key={`${widget.type}-${i}`}
            className={`transition-all duration-300 ${
              i === activeIndex ? "scale-100 opacity-100" : "scale-90 opacity-60"
            }`}
          >
            <WidgetCard widget={widget} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {widgets.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-3 bg-primary" : "w-1.5 bg-outline-variant"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
