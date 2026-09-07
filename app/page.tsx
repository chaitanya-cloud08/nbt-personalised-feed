import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { isOnboardingComplete } from "@/lib/db";
import { buildFeed } from "@/lib/feed";
import { cityLabel } from "@/lib/data/cities";
import { briefTimeOfDay } from "@/lib/strings.hi";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";
import WidgetCarousel from "@/components/widgets/WidgetCarousel";
import BriefWidget from "@/components/widgets/BriefWidget";
import FeedSection from "@/components/FeedSection";
import FeaturedArticleCard from "@/components/FeaturedArticleCard";
import FeedAutoRefresh from "@/components/FeedAutoRefresh";

const BRIEF_HEADLINE_COUNT = 5;

export default async function FeedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!isOnboardingComplete(user)) {
    redirect("/onboarding");
  }

  const { featured, rest } = await buildFeed(user);
  const briefHeadlines = [featured, ...rest]
    .filter((a) => a !== null)
    .slice(0, BRIEF_HEADLINE_COUNT)
    .map((a) => a.headline_hi);

  return (
    <>
      <FeedAutoRefresh />
      <TopAppBar cityLabel={cityLabel(user.city)} />
      <main className="flex-1 w-full bg-surface-bright pb-6 flex flex-col gap-4">
        <BriefWidget cityLabel={cityLabel(user.city)} headlines={briefHeadlines} copy={briefTimeOfDay()} />
        <WidgetCarousel />
        {featured && <FeaturedArticleCard article={featured} />}
        <FeedSection feed={rest} hasFeatured={!!featured} />
      </main>
      <BottomNav />
    </>
  );
}
