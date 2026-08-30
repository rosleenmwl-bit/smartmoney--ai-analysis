"use client";

import { useState } from "react";
import Link from "next/link";
import { generateRecommendation, updateTotalBudget } from "@/app/actions";

const COLORS = ["#6c4ee6", "#42b8e4", "#84c99a", "#ffcf4a", "#ff8b72", "#ed6f98", "#a46de1", "#f29d4b", "#2f9e8f", "#566b9e"];
const money = (value: number) => `MYR ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
const wholeMoney = (value: number) => `MYR ${Math.round(value).toLocaleString()}`;

export default function DashboardClient({ initialData }: { initialData: any }) {
  const [recError, setRecError] = useState("");
  const d = initialData;
  const pie = d.comparisons.filter((x: any) => x.actual > 0);
  const topFlexible = d.comparisons.filter((x: any) => x.type !== "fixed" && x.actual > 0).sort((a: any, b: any) => b.actual - a.actual).slice(0, 3);
  const total = pie.reduce((sum: number, x: any) => sum + x.actual, 0);
  let cursor = 0;
  const segments = pie.map((x: any, index: number) => {
    const start = cursor;
    cursor += (x.actual / Math.max(total, 1)) * 100;
    return `${COLORS[index % COLORS.length]} ${start}% ${cursor}%`;
  }).join(", ");
  const spentProgress = Math.min(100, d.allocated ? (d.spent / d.allocated) * 100 : 0);
  const flexibleTarget = 2000;
  const flexiblePercent = Math.round((d.flexibleSpent / flexibleTarget) * 100);
  const flexibleProgress = Math.min(100, flexiblePercent);
  const flexibleStatus = d.flexibleSpent <= flexibleTarget ? "Within range" : "Over target";

  const spentPercent = d.allocated ? Math.round((d.spent / d.allocated) * 100) : 0;
  return (
    <>
      <header className="topbar dashboard-header">
        <div><p className="eyebrow">{new Date(`${d.month}-01T00:00:00`).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}</p><h1>Good Day, my friend!</h1><p className="header-subtitle">Your spending picture is clear. There is still room to enjoy the month.</p></div>
        <div className="header-actions"><label className="month-picker"><span>Viewing month</span><input type="month" value={d.month} aria-label="Viewing month" onChange={(event) => { if (event.target.value) location.href = `/?month=${event.target.value}`; }} /></label><form className="header-budget-form" action={updateTotalBudget}><input type="hidden" name="month" value={d.month} /><label><span>Monthly Budget</span><span className="budget-control"><span>MYR</span><input name="allocated_amount" type="number" min="1" step="1" defaultValue={d.allocated} aria-label="Monthly Budget" required /></span></label><button className="button secondary small" type="submit">Save</button></form></div>
        <div className="wisdom-bar">Spend Wisely, not Impulsively!</div>
      </header>

      <section className="summary-panels">
        <div className="summary-hero"><div><span>Remaining this month</span><strong>{d.balance < 0 ? "−" : ""}{money(Math.abs(d.balance))}</strong><small>Monthly Budget − Total Expenses</small></div><span className="hero-mark">↗</span></div>
        <div className="summary-two">
          <div className="summary-panel"><div className="summary-label-row"><span className="summary-label">Spent so far</span><span className="info-tip" tabIndex={0}>?<span className="info-popover">Total expenses recorded for the selected month</span></span></div><strong>{money(d.spent)}</strong><div className="summary-detail"><span className="metric-badge">{d.expenses.length} entries</span><span>logged this month</span></div><div className="progress"><i style={{ width: `${spentProgress}%` }} /></div><div className="summary-scale"><span>0</span><span>{money(d.allocated)} budget</span></div></div>
          <div className="summary-panel"><div className="summary-label-row"><span className="summary-label">Flexible spend</span><span className="info-tip" tabIndex={0}>?<span className="info-popover">Spent so far − Fixed Expenses</span></span></div><strong>{money(d.flexibleSpent)}</strong><div className="summary-detail"><span className="metric-badge">{flexiblePercent}%</span><span>of targeted flexible spend</span></div><div className="progress flexible-progress"><i style={{ width: `${flexibleProgress}%` }} /></div><div className="summary-scale"><span>Target {money(flexibleTarget)}</span><span className={flexibleStatus === "Within range" ? "positive" : "negative"}>{flexibleStatus}</span></div></div>
        </div>
      </section>
      <div className="status-note"><span className="status-dot" /> <strong>{spentPercent < 90 ? "On track" : "Watch your pace"}</strong><span>You&apos;ve used {spentPercent}% of your {money(d.allocated)} monthly budget.</span></div>

      <section className="card chart-card chart-full"><div className="section-heading"><div><p className="eyebrow">Spending Mix</p><h2>Where your money goes</h2></div><span className="pill">This month</span></div>{pie.length === 0 ? <div className="empty-state">No expenses logged this month — add your first one.</div> : <div className="pie-layout"><div className="pie-chart" style={{ background: `conic-gradient(${segments})` }} aria-label="Spending mix pie chart"><span className="pie-center"><strong>{wholeMoney(total)}</strong><small>total spent</small></span></div><div className="pie-legend">{pie.map((x: any, index: number) => <div key={x.id}><span className="legend-dot" style={{ background: COLORS[index % COLORS.length] }} /><span>{x.icon} {x.name}</span><strong className="legend-values"><span>{wholeMoney(Number(x.actual))}</span><em>{Math.round((x.actual / total) * 100)}%</em></strong></div>)}</div></div>}</section>

      <section className="card top-flexible-card"><div className="section-heading"><div><p className="eyebrow">This month · top 3</p><h2>Top Flexible expenses</h2></div><Link className="text-link" href="/expenses">View all →</Link></div>{topFlexible.length ? <ul className="top-flexible">{topFlexible.map((x: any) => <li key={x.id}><span className="bullet">•</span><div><strong>{x.name}</strong><small>Category total · {d.month}</small></div><strong>{money(Number(x.actual))}</strong></li>)}</ul> : <div className="empty-state">No flexible expenses logged this month.</div>}</section>

      <section className="card recommendation-card"><div className="section-heading"><div><p className="eyebrow">Smart suggestion</p><h2>Recommendation</h2></div><span className="sparkle">✦</span></div>{d.recommendation ? <><p className="recommendation-text">{topFlexible[0] ? `${topFlexible[0].name} is your largest flexible category. Review this category first and keep the changes practical.` : d.recommendation.suggestion_text}</p><div className="idea"><small>PRIMARY IDEA</small><p>{topFlexible[0] ? `Review ${topFlexible[0].name} before your next weekly check-in.` : d.recommendation.primary_idea}</p></div><div className="idea muted"><small>NEXT ACTIONS</small>{(d.recommendation.next_actions ?? []).map((action: string) => <p key={action}>• {action}</p>)}</div></> : <div className="empty-state"><p>Need at least 5 expenses this month to generate recommendations.</p><button className="button secondary" onClick={async () => { setRecError(""); try { await generateRecommendation(); location.reload(); } catch (error) { setRecError(error instanceof Error ? error.message : "Could not generate."); } }}>Generate suggestion</button>{recError && <p className="form-error">{recError}</p>}</div>}</section>
    </>
  );
}
