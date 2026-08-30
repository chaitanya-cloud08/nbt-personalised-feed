import { ScoredArticle } from "@/lib/types";
import { strings } from "@/lib/strings.hi";
import ArticleCard from "@/components/ArticleCard";

export default function FeedSection({ feed }: { feed: ScoredArticle[] }) {
  return (
    <section className="px-4 flex flex-col gap-3">
      <h2 className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-wide">
        {strings.feed.forYou}
      </h2>
      {feed.length === 0 ? (
        <p className="text-on-surface-variant">{strings.feed.empty}</p>
      ) : (
        feed.map((article) => <ArticleCard key={article.id} article={article} />)
      )}
    </section>
  );
}
