import Link from "next/link";
import { notFound } from "next/navigation";
import { FESTIVAL_CALENDAR } from "@/lib/data/festivals";
import { getFestivalContent } from "@/lib/data/festivalContent";
import { strings, formatDateHi } from "@/lib/strings.hi";

export default async function FestivalPage({ params }: PageProps<"/festival/[tag]">) {
  const { tag } = await params;
  const festival = FESTIVAL_CALENDAR.find((f) => f.tag === tag);
  if (!festival) notFound();

  const content = await getFestivalContent(festival.tag, festival.name_hi, festival.date);
  const s = strings.widgets.festivalPage;

  return (
    <main className="flex-1 w-full bg-surface-bright pb-10">
      <header className="flex items-center gap-2 px-4 h-14 w-full sticky top-0 z-10 bg-surface border-b border-outline-variant/40">
        <Link
          href="/"
          className="text-on-surface-variant hover:text-primary transition-colors p-1 -ml-1 rounded-full"
          aria-label={s.backToFeed}
        >
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        </Link>
        <h1 className="font-headline text-lg font-bold text-on-surface truncate">{festival.name_hi}</h1>
      </header>

      <section className="bg-festival-bg px-4 pt-8 pb-10 flex flex-col items-center text-center gap-3">
        <span
          className="material-symbols-outlined text-festival-accent text-[40px] bg-surface-container-lowest rounded-full p-3 shadow-sm"
          aria-hidden="true"
        >
          light_mode
        </span>
        <h2 className="font-headline text-3xl font-bold text-on-surface">{festival.name_hi}</h2>
        <p className="text-festival-accent font-semibold">{formatDateHi(festival.date)}</p>
        {content && <p className="text-on-surface-variant leading-relaxed max-w-md">{content.summary_hi}</p>}
      </section>

      <div className="px-4 flex flex-col gap-5 mt-6">
        {!content && (
          <p className="text-on-surface-variant text-center py-6 rounded-lg border border-outline-variant/40 bg-surface-container-lowest">
            {s.unavailable}
          </p>
        )}

        {content && (
          <>
            <section className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5 flex flex-col gap-2">
              <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-festival-accent text-[20px]" aria-hidden="true">
                  auto_stories
                </span>
                {s.significance}
              </h3>
              <p className="text-on-surface-variant leading-relaxed">{content.significance_hi}</p>
            </section>

            <section className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5 flex flex-col gap-3">
              <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-festival-accent text-[20px]" aria-hidden="true">
                  checklist
                </span>
                {s.tips}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {content.tips_hi.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="material-symbols-outlined text-festival-accent text-[18px] mt-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      task_alt
                    </span>
                    <span className="text-on-surface-variant leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl bg-festival-bg p-5 flex flex-col gap-2 border border-festival-accent/20">
              <h3 className="font-headline text-base font-bold text-festival-accent flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">favorite</span>
                {s.inspiration}
              </h3>
              <p className="text-on-surface leading-relaxed italic">{content.inspiration_hi}</p>
            </section>
          </>
        )}

        <Link
          href="/"
          className="mt-2 text-center rounded-lg bg-primary text-on-primary text-lg font-semibold py-3"
        >
          {s.backToFeed}
        </Link>
      </div>
    </main>
  );
}
