"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { LogOut, Activity, Heart, Flame, Clock } from "lucide-react";
import { env } from "@/lib/configAuth";

interface DashboardMetrics {
  heartRate?: string | number;
  caloriesBurned?: string | number;
  activityMinutes?: string | number;
  insights?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthAndFetchData = useCallback(async () => {
    try {
      await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

      if (!token) throw new Error("No access token.");

      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/dashboard/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err: unknown) {
      const error = err as Error & { name?: string };
      if (error.name === "UserUnAuthenticatedException" || error.message === "No access token.") {
        router.push("/login"); // Redirect to login
      } else {
        setError(error.message || "Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndFetchData();
  }, [checkAuthAndFetchData]);

  const handleLogout = async () => {
    try {
      const { signOut } = await import("aws-amplify/auth");
      await signOut();
      router.push("/login");
    } catch {
      // Error signing out - silently fail
      setError("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950">
        <Activity className="h-8 w-8 animate-pulse text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 p-6 font-sans text-white selection:bg-blue-500/30 md:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Health Dashboard
            </h1>
            <p className="mt-1 text-zinc-500">Your vital metrics and recent summaries.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </header>

        {error ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            <Activity className="mb-4 h-8 w-8 opacity-50" />
            <p className="mb-2 text-lg font-medium">Failed to load data</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:bg-zinc-900">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-red-500/10 blur-2xl transition-colors group-hover:bg-red-500/20" />
              <div className="mb-4 flex items-center justify-between">
                <Heart className="h-6 w-6 text-red-400" />
                <span className="rounded-full bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400">
                  Heart Rate
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold">{metrics?.heartRate || "N/A"}</h3>
                <p className="mt-1 text-sm text-zinc-500">bpm average today</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:bg-zinc-900">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl transition-colors group-hover:bg-orange-500/20" />
              <div className="mb-4 flex items-center justify-between">
                <Flame className="h-6 w-6 text-orange-400" />
                <span className="rounded-full bg-orange-400/10 px-2 py-1 text-xs font-medium text-orange-400">
                  Calories
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold">{metrics?.caloriesBurned || "N/A"}</h3>
                <p className="mt-1 text-sm text-zinc-500">kcal active</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:bg-zinc-900">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-colors group-hover:bg-blue-500/20" />
              <div className="mb-4 flex items-center justify-between">
                <Clock className="h-6 w-6 text-blue-400" />
                <span className="rounded-full bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400">
                  Activity Time
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold">{metrics?.activityMinutes || "N/A"}</h3>
                <p className="mt-1 text-sm text-zinc-500">minutes active</p>
              </div>
            </div>

            {/* A fake or actual chart representation based on data */}
            <div className="mt-4 flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8 md:col-span-3">
              <h3 className="mb-6 text-lg font-medium">Recent Insights</h3>
              <div className="flex min-h-[250px] flex-1 items-center justify-center rounded-2xl border border-zinc-800/50 bg-zinc-950 p-6 shadow-inner">
                {metrics?.insights ? (
                  <p className="text-zinc-400">{metrics.insights}</p>
                ) : (
                  <p className="text-zinc-600 italic">No significant insights derived yet.</p>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <pre className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-black/50 p-4 text-xs text-zinc-500">
                  {JSON.stringify(metrics, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
