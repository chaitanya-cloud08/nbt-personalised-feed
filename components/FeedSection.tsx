import { Fragment } from "react";
import { ScoredArticle } from "@/lib/types";
import { strings } from "@/lib/strings.hi";
import ArticleCard from "@/components/ArticleCard";
import FeedResetCard from "@/components/FeedResetCard";

// After this many articles, an inline "reset your interests" prompt is
// shown once (see FeedResetCard) so recalibrating doesn't require leaving
// the feed.
const RESET_CARD_AFTER = 8;

export default function FeedSection({ feed }: { feed: ScoredArticle[] }) {
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
            {index === RESET_CARD_AFTER - 1 && <FeedResetCard />}
          </Fragment>
        ))
      )}
    </section>
  );
}
