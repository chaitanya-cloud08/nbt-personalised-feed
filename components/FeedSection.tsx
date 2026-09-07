import { Fragment } from "react";
import { ScoredArticle } from "@/lib/types";
import { strings } from "@/lib/strings.hi";
import ArticleCard from "@/components/ArticleCard";
import FeedResetCard from "@/components/FeedResetCard";

// After this many articles, an inline "reset your interests" prompt is
// shown once (see FeedResetCard) so recalibrating doesn't require leaving
// the feed.
const RESET_CARD_AFTER = 5;

export default function FeedSection({ feed, hasFeatured = false }: { feed: ScoredArticle[]; hasFeatured?: boolean }) {
  // The featured/hero card above this section (if any) is visually the
  // feed's first article, so it counts toward RESET_CARD_AFTER too — without
  // this offset, "after 5 articles" would actually land after the 6th.
  const triggerIndex = RESET_CARD_AFTER - 1 - (hasFeatured ? 1 : 0);

  return (
    <section className="px-4 flex flex-col gap-3">
      <h2 className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-wide">
        {strings.feed.forYou}
      </h2>
      {feed.length === 0 ? (
        <p className="text-on-surface-variant">{strings.feed.empty}</p>
      ) : (
        feed.map((article, index) => (
          <Fragment key={article.id}>
            <ArticleCard article={article} />
            {index === triggerIndex && <FeedResetCard />}
          </Fragment>
        ))
      )}
    </section>
  );
}
