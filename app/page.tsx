import { redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import { ensureUser, isOnboardingComplete } from "@/lib/db";
import { buildFeed } from "@/lib/feed";
import { cityLabel } from "@/lib/data/cities";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";
import WidgetCarousel from "@/components/widgets/WidgetCarousel";
import FeedSection from "@/components/FeedSection";
import FeaturedArticleCard from "@/components/FeaturedArticleCard";

export default async function FeedPage() {
  const userId = await getUserId();
  const user = ensureUser(userId);

  if (!isOnboardingComplete(user)) {
    redirect("/onboarding");
  }

  const { featured, rest } = await buildFeed(user);

  return (
    <>
      <TopAppBar cityLabel={cityLabel(user.city)} />
      <main className="flex-1 w-full bg-surface-bright pb-6 flex flex-col gap-4">
        <WidgetCarousel />
        {featured && <FeaturedArticleCard article={featured} />}
        <FeedSection feed={rest} />
      </main>
      <BottomNav />
    </>
  );
}
