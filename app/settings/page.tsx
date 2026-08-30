import { getUserId } from "@/lib/session";
import { ensureUser } from "@/lib/db";
import SettingsClient from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
  const userId = await getUserId();
  const user = ensureUser(userId);

  return (
    <SettingsClient initialCity={user.city} initialRashi={user.rashi} />
  );
}
