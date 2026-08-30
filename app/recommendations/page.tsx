import Link from "next/link";
import AppHeader from "@/components/app-header";
import { getDashboard } from "@/lib/data";
import { generateRecommendation, updateRecommendation } from "@/app/actions";

export const dynamic = "force-dynamic";

function actionDefinition(action: string) {
  const value = action.toLowerCase();
  if (value.includes("plan") || value.includes("meal")) return "Choose one or two simple meals before the week begins.";
  if (value.includes("review") || value.includes("check")) return "Take five minutes to compare this week’s spending with your plan.";
  if (value.includes("limit") || value.includes("cap")) return "Set a clear amount for this category and stop when it is reached.";
  if (value.includes("save") || value.includes("buffer")) return "Keep the amount you avoid spending available for future needs.";
  return "Complete this small step, then check your progress at the next review.";
}

export default async function RecommendationsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  const d = await getDashboard(params.month);
  const r = d.recommendation;
  const topFlexible = d.comparisons.filter((x: any) => x.type !== "fixed" && x.actual > 0).sort((a: any, b: any) => b.actual - a.actual)[0];
  return <div className="app-shell"><AppHeader active="recommendations" month={d.month} /><main className="main-content"><header className="topbar"><div><p className="eyebrow">Savings coach</p><h1>Small changes, more breathing room.</h1></div><Link className="button secondary" href={`/?month=${d.month}`}>← Dashboard</Link></header><section className="card recommendation-large"><div className="section-heading"><div><p className="eyebrow">{d.month} recommendation</p><h2>Practical next steps</h2></div><span className="sparkle">✦</span></div>{r ? <><p className="recommendation-text">{topFlexible ? `${topFlexible.name} is your largest flexible category at MYR ${Number(topFlexible.actual).toFixed(2)}. Review this category first and keep the changes practical.` : r.suggestion_text}</p><div className="next-actions prominent-actions"><h3>Next three actions to improve</h3><p className="actions-intro">Small, specific steps that make this recommendation easier to follow.</p>{(r.next_actions ?? []).slice(0, 3).map((a: string, i: number) => <div className="action-item" key={a}><span>{i + 1}</span><div><strong>{a}</strong><small>{actionDefinition(a)}</small></div></div>)}</div><div className="action-row"><form action={updateRecommendation.bind(null, r.id, "accepted")}><button className="button primary">Accept recommendation</button></form><form action={updateRecommendation.bind(null, r.id, "dismissed")}><button className="button secondary">Dismiss</button></form></div></> : <div className="empty-state"><h3>Need at least 5 expenses this month to generate recommendations.</h3><p>Add a few more expenses, then come back for a tailored savings plan.</p><form action={generateRecommendation}><button className="button primary">Generate recommendation</button></form></div>}</section></main></div>;
}
