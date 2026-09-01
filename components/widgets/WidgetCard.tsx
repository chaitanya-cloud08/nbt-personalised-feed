import { WidgetEligible } from "@/lib/types";
import { strings } from "@/lib/strings.hi";

export default function WidgetCard({ widget }: { widget: WidgetEligible }) {
  if (widget.type === "live_match") {
    const { team_a, team_b, score_a, score_b, status_hi } = widget.data;
    return (
      <div className="shrink-0 w-64 h-40 rounded-lg p-4 shadow-sm flex flex-col justify-between bg-live-bg border border-live-bg">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
          <span className="text-error font-bold text-[10px] uppercase tracking-wider">
            {strings.widgets.live.badge}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-secondary leading-none mb-1">{team_a}</span>
            <span className="font-headline text-[26px] text-on-surface font-bold leading-tight">
              {score_a}
            </span>
          </div>
          <span className="text-outline text-xs">vs</span>
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-secondary leading-none mb-1">{team_b}</span>
            <span className="font-headline text-[26px] text-on-surface font-bold leading-tight">
              {score_b}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-secondary font-medium uppercase tracking-tight pt-2 border-t border-outline-variant/30">
          {status_hi}
        </p>
      </div>
    );
  }

  if (widget.type === "festival") {
    const { name_hi, days_remaining } = widget.data;
    return (
      <div className="shrink-0 w-64 h-40 rounded-lg p-4 shadow-sm flex flex-col justify-between bg-festival-bg border border-festival-bg">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-festival-accent text-[24px]" aria-hidden="true">light_mode</span>
          <span className="text-[10px] text-festival-accent uppercase tracking-widest font-bold">
            त्योहार
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="font-headline text-on-surface text-lg font-bold">{name_hi}</h3>
          <p className="font-headline text-[22px] text-festival-accent font-bold leading-tight">
            {strings.widgets.festival.daysRemaining(name_hi, days_remaining)}
          </p>
        </div>
      </div>
    );
  }

  const { rashi_label_hi, text_hi, url } = widget.data;
  const horoscopeContent = (
    <>
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
        <span className="material-symbols-outlined text-horoscope-accent text-[20px]" aria-hidden="true">bedtime</span>
        <span className="text-[11px] text-horoscope-accent uppercase tracking-widest font-bold">
          {strings.widgets.horoscope.title}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-headline text-on-surface mb-1 text-lg leading-tight">{rashi_label_hi}</h3>
        <p className="text-on-surface-variant text-[13px] leading-snug line-clamp-3">{text_hi}</p>
      </div>
    </>
  );
  const horoscopeClassName =
    "shrink-0 w-64 h-40 rounded-lg p-4 shadow-sm flex flex-col justify-between bg-horoscope-bg border border-horoscope-bg";

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={horoscopeClassName}>
        {horoscopeContent}
      </a>
    );
  }
  return <div className={horoscopeClassName}>{horoscopeContent}</div>;
}
