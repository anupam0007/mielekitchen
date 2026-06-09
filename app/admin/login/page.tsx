"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-sm">
            <Image src="/logo.png" alt="Miele" width={52} height={52} className="h-full w-full object-contain" />
          </div>
          <h1 className="font-serif text-2xl text-[#2d1b0e]">Miele Admin</h1>
          <p className="text-sm text-[#9a7c5c]">Sign in to manage your kitchen</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-[#2d1b0e]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-[#e8d5c0] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#2d1b0e] outline-none focus:border-[#c8873a] focus:ring-2 focus:ring-[#c8873a]/20"
              placeholder="chef@mielekitchen.com"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-[#2d1b0e]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-[#e8d5c0] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#2d1b0e] outline-none focus:border-[#c8873a] focus:ring-2 focus:ring-[#c8873a]/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#c8873a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b07530] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
