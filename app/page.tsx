import Link from "next/link";
import { getDashboard } from "@/lib/data";
import DashboardClient from "@/components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getDashboard();
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">S</span><div><strong>SmartMoney</strong><small>AI budget coach</small></div></div><nav><Link className="active" href="/">◈ <span>Dashboard</span></Link><Link href="/expenses">↗ <span>Expenses</span></Link><Link href="/budget">▣ <span>Budget</span></Link><Link href="/recommendations">✦ <span>Recommendations</span></Link></nav><div className="sidebar-note"><span>●</span> Demo mode<br /><small>Your data is saved to Supabase.</small></div></aside><main className="main-content"><DashboardClient initialData={data} /></main></div>;
}
