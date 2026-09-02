"use client";

import { useState } from "react";
import { strings } from "@/lib/strings.hi";

type Mode = "login" | "register";

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const s = strings.auth;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).catch(() => null);

    if (!res) {
      setError(s.genericError);
      setSubmitting(false);
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? s.genericError);
      setSubmitting(false);
      return;
    }

    // Hard navigation, not router.push: a plain client-side push here can
    // replay a stale Router Cache entry from before login (the same class
    // of bug that caused the onboarding-completion redirect loop).
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/";
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-headline text-xl font-bold text-on-surface">
          {mode === "login" ? s.loginTitle : s.registerTitle}
        </h2>
        <p className="text-on-surface-variant mt-1">{s.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={s.emailPlaceholder}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-lg outline-none focus:border-primary"
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={s.passwordPlaceholder}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-lg outline-none focus:border-primary"
        />

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-primary disabled:bg-surface-dim disabled:text-on-surface-variant text-on-primary text-lg font-semibold py-3 transition"
        >
          {mode === "login" ? s.loginButton : s.registerButton}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setError(null);
        }}
        className="text-sm font-medium text-primary hover:opacity-80 self-center"
      >
        {mode === "login" ? s.switchToRegister : s.switchToLogin}
      </button>
    </div>
  );
}
