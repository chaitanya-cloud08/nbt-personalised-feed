import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { isOnboardingComplete } from "@/lib/db";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(isOnboardingComplete(user) ? "/" : "/onboarding");

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
