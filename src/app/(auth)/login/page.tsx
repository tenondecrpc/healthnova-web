"use client";

import { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, Activity } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn({ username: email, password });
      router.push("/"); // go to dashboard
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 p-4">
      {/* Background aesthetics */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 shadow-inner">
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
            <p className="text-center text-sm text-zinc-400">
              Login to your Healthnova dashboard to monitor your vital statistics.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="ml-1 text-sm font-medium text-zinc-300" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white transition-all placeholder:text-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="ml-1 flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white transition-all placeholder:text-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group h-12 w-full rounded-xl bg-white font-medium text-zinc-950 transition-all hover:bg-zinc-200"
            >
              <span>{loading ? "Signing in..." : "Sign in"}</span>
              {!loading && (
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-white hover:underline">
              Request access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
