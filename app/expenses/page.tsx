import AppHeader from "@/components/app-header";
import ExpensesClient from "@/components/expenses-client";
import { getDashboard } from "@/lib/data";
import { getFamilyProfiles, requireAppUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  await requireAppUser(`/expenses?month=${encodeURIComponent(params.month ?? "")}`);
  const data = await getDashboard(params.month);
  const familyProfiles = await getFamilyProfiles();
  return <div className="app-shell"><AppHeader active="expenses" month={data.month} familyProfiles={familyProfiles} /><main className="main-content expenses-content"><ExpensesClient data={data} /></main></div>;
}
