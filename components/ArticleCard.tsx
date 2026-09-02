import { ScoredArticle } from "@/lib/types";
import { sectionLabel } from "@/lib/data/sections";
import { cityLabel } from "@/lib/data/cities";
import { SECTION_ICONS } from "@/lib/data/sectionIcons";
import { strings, timeAgoHi } from "@/lib/strings.hi";

export default function ArticleCard({ article }: { article: ScoredArticle }) {
  const city = cityLabel(article.city);
  const content = (
    <>
      <div className="w-20 h-20 shrink-0 rounded-md bg-secondary-container flex items-center justify-center relative overflow-hidden">
        <span className="material-symbols-outlined text-primary text-[28px]" aria-hidden="true">
          {SECTION_ICONS[article.section]}
        </span>
        {article.thumbnail_url && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${article.thumbnail_url})` }}
          />
        )}
      </div>
      <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
        <h3 className="font-headline text-on-surface leading-snug text-[17px] font-semibold line-clamp-3">
          {article.headline_hi}
        </h3>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[10px] font-semibold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded uppercase tracking-wide">
            {article.city ? strings.feed.regionalBadge : sectionLabel(article.section)}
          </span>
          <span className="text-[11px] text-on-surface-variant">{city ?? strings.feed.nationalTag}</span>
          <span className="text-[11px] text-on-surface-variant">·</span>
          <span className="text-[11px] text-on-surface-variant">{timeAgoHi(article.published_at)}</span>
        </div>
      </div>
    </>
  );
  const className = "flex gap-3 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40";

  if (article.url) {
    return (
      <article>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className={className}>
          {content}
        </a>
      </article>
    );
  }

  return <article className={className}>{content}</article>;
}
