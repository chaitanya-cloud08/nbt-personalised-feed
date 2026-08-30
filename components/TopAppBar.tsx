import Link from "next/link";
import { strings } from "@/lib/strings.hi";

export default function TopAppBar({ cityLabel }: { cityLabel: string | null }) {
  return (
    <header className="flex justify-between items-center px-4 h-14 w-full sticky top-0 z-10 bg-surface border-b border-outline-variant/40">
      <div className="flex items-center gap-2">
        <h1 className="font-headline text-xl font-bold text-primary tracking-tight">
          {strings.appName}
        </h1>
        {cityLabel && (
          <span className="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-full text-primary">
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">location_on</span>
            <span className="text-[12px] font-medium">{cityLabel}</span>
          </span>
        )}
      </div>
      <Link
        href="/settings"
        className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full"
        aria-label={strings.common.settings}
      >
        <span className="material-symbols-outlined" aria-hidden="true">settings</span>
      </Link>
    </header>
  );
}
