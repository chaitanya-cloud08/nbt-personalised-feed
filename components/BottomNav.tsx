"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { strings } from "@/lib/strings.hi";

const TABS = [
  { href: "/", label: strings.nav.home, icon: "home" },
  { href: "/settings", label: strings.nav.settings, icon: "settings" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 left-0 w-full z-10 flex justify-around items-center h-16 bg-surface-container-lowest border-t border-outline-variant/40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center transition-colors ${
              active ? "text-primary font-bold" : "text-secondary hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              aria-hidden="true"
            >
              {tab.icon}
            </span>
            <span className="text-[10px]">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
