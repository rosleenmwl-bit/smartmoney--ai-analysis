import { getDashboard } from "@/lib/data";
import DashboardClient from "@/components/dashboard-client";
import AppHeader from "@/components/app-header";
import { requireAppUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  const nextPath = params.month ? `/?month=${encodeURIComponent(params.month)}` : "/";
  await requireAppUser(nextPath);
  const data = await getDashboard(params.month);
  return <div className="app-shell"><AppHeader active="dashboard" month={data.month} /><main className="main-content"><DashboardClient initialData={data} /></main></div>;
}
