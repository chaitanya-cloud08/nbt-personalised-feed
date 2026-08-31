import { ScoredArticle } from "@/lib/types";
import { sectionLabel } from "@/lib/data/sections";
import { cityLabel } from "@/lib/data/cities";
import { SECTION_ICONS } from "@/lib/data/sectionIcons";
import { strings, timeAgoHi } from "@/lib/strings.hi";

// The lead "thumb" story — always the top-scored article from the user's own
// city (see pickFeaturedCityArticle in lib/feedScoring.ts). Rendered larger
// than a regular ArticleCard to read as the top-of-feed story.
export default function FeaturedArticleCard({ article }: { article: ScoredArticle }) {
  const city = cityLabel(article.city);
  const content = (
    <>
      <div className="w-full h-36 bg-primary-container/10 relative flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-[56px]" aria-hidden="true">
          {SECTION_ICONS[article.section]}
        </span>
        {city && (
          <span className="absolute top-2 left-2 bg-primary text-on-primary px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
            {strings.feed.cityBadge}
          </span>
        )}
      </div>
      <div className="p-3">
        <h2 className="font-headline text-on-surface text-xl font-bold leading-snug">
          {article.headline_hi}
        </h2>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[10px] font-semibold border border-outline text-on-surface-variant px-2 py-0.5 rounded uppercase tracking-wide">
            {sectionLabel(article.section)}
          </span>
          <span className="text-[11px] text-on-surface-variant">{city ?? strings.feed.nationalTag}</span>
          <span className="text-[11px] text-on-surface-variant">·</span>
          <span className="text-[11px] text-on-surface-variant">{timeAgoHi(article.published_at)}</span>
        </div>
      </div>
    </>
  );
  const className = "mx-4 rounded-lg border border-outline-variant/40 bg-surface-container-lowest overflow-hidden shadow-sm";

  if (article.url) {
    return (
      <article className="mx-0">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className={`block ${className}`}>
          {content}
        </a>
      </article>
    );
  }

  return <article className={className}>{content}</article>;
}
