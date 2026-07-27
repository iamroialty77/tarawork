"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LandingPage from "@/components/LandingPage";

const TaraWorkApp = dynamic(() => import("@/components/TaraWorkApp"), {
  ssr: false,
  loading: () => <HomeLoading label="Opening dashboard..." />,
});

function HomeLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
      </div>
    </div>
  );
}

type LandingJob = { id: string; title: string; category: string; rate: string; duration: string; href: string };
type LandingFreelancer = { id: string; name: string; category: string; bio: string; skills: string[]; services: string[]; avatarUrl: string; hourlyRate: string; href: string };

export default function HomeEntry({
  landingJobs = [],
  landingFreelancers = [],
}: {
  landingJobs?: LandingJob[];
  landingFreelancers?: LandingFreelancer[];
}) {
  const [authState, setAuthState] = useState<"guest" | "authenticated">("guest");

  useEffect(() => {
    let mounted = true;

    let subscription: { unsubscribe: () => void } | null = null;

    import("@/lib/supabase").then(({ supabase }) => {
      if (!mounted) return;

      supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return;
        setAuthState(data.session ? "authenticated" : "guest");
      });

      const authState = supabase.auth.onAuthStateChange((_event, session) => {
        setAuthState(session ? "authenticated" : "guest");
      });

      subscription = authState.data.subscription;
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return authState === "authenticated"
    ? <TaraWorkApp />
    : <LandingPage jobs={landingJobs} freelancers={landingFreelancers} />;
}
