"use client";

import { useState } from "react";
import { deleteExpense, updateFixedExpense } from "@/app/actions";
import EditExpenseForm from "@/components/edit-expense-form";
import ExpenseForm from "@/components/expense-form";
import ReceiptUpload from "@/components/receipt-upload";

function money(value: number) {
  return new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" }).format(value);
}

export default function ExpensesClient({ data }: { data: any }) {
  const [entryMode, setEntryMode] = useState<"expense" | "snapshot" | null>(null);
  const fixedCategories = data.comparisons.filter((category: any) => category.type === "fixed");
  const flexibleExpenses = data.expenses
    .filter((expense: any) => expense.categories?.type !== "fixed")
    .sort((a: any, b: any) => `${b.expense_date}${b.created_at ?? ""}`.localeCompare(`${a.expense_date}${a.created_at ?? ""}`));

  return (
    <>
      <header className="expenses-hero">
        <div><p className="eyebrow">Expense tracker · {data.month}</p><h1>Everyday spending, in one place.</h1><p>Fixed costs recur automatically. Flexible spending stays easy to review.</p></div>
        <div className="expense-hero-actions"><button className="button snapshot-button" onClick={() => setEntryMode(entryMode === "snapshot" ? null : "snapshot")}>＋ Add snapshot</button><button className="button primary" onClick={() => setEntryMode(entryMode === "expense" ? null : "expense")}>＋ Add expense</button></div>
      </header>

      {entryMode && <section className="card expense-entry-drawer"><div className="section-heading"><div><p className="eyebrow">{entryMode === "expense" ? "Manual expense" : "Receipt snapshot"}</p><h2>{entryMode === "expense" ? "Add an expense" : "Upload and review"}</h2></div><button className="icon-button" onClick={() => setEntryMode(null)} aria-label="Close entry form">×</button></div>{entryMode === "expense" ? <ExpenseForm categories={data.categories} month={data.month} /> : <ReceiptUpload categories={data.categories} />}</section>}

      <section className="expense-metrics" aria-label="Monthly expense overview">
        <div><span>Total spent this month</span><strong>{money(data.spent)}</strong></div>
        <div><span>Fixed expenditure</span><strong>{money(data.fixedSpent)}</strong></div>
        <div><span>Flexible spend</span><strong>{money(data.flexibleSpent)}</strong></div>
        <div><span>Budget remaining</span><strong className={data.balance < 0 ? "negative" : "positive"}>{money(data.balance)}</strong></div>
      </section>

      <section className="card fixed-expenses-card">
        <div className="fixed-heading"><div><p className="eyebrow">Fixed every month</p><h2>Automatic fixed expenditure</h2><p>These amounts repeat monthly and can be adjusted whenever the month changes.</p></div><div className="fixed-total"><span>Total fixed expenditure</span><strong>{money(data.fixedSpent)}</strong></div></div>
        <div className="fixed-list">{fixedCategories.map((category: any, index: number) => <form action={updateFixedExpense} className="fixed-row" key={category.id}><input type="hidden" name="month" value={data.month} /><input type="hidden" name="category_id" value={category.id} /><span className={`fixed-check tone-${index % 4}`}>✓</span><div><strong>{category.icon} {category.name}</strong><small>Recurring on the first day of each month</small></div><label><span>MYR</span><input name="amount" type="number" min="0" step="0.01" defaultValue={Number(category.actual).toFixed(2)} aria-label={`${category.name} monthly amount`} /></label><button className="button secondary small" type="submit">Save</button></form>)}</div>
      </section>

      <section className="card flexible-ledger">
        <div className="ledger-heading"><div><p className="eyebrow">Flexible spending</p><h2>{flexibleExpenses.length} recorded flexible expenses</h2><p>Newest first · edit or remove each entry when needed.</p></div><strong>{money(data.flexibleSpent)}</strong></div>
        <div className="expense-list">{flexibleExpenses.map((expense: any) => <article className="expense-line" key={expense.id}><span className="expense-icon">{expense.categories?.icon ?? "•"}</span><div className="expense-copy"><strong>{expense.note || expense.categories?.name}</strong><small>{expense.categories?.name} · {new Date(`${expense.expense_date}T00:00:00`).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}</small></div><span className="method-pill">{expense.capture_method === "receipt" ? "Extracted" : "Manual"}</span><strong className="expense-amount">{money(Number(expense.amount))}</strong><div className="row-actions"><EditExpenseForm expense={expense} categories={data.categories} /><form action={deleteExpense.bind(null, expense.id)}><button className="delete-button" title="Delete expense">Delete</button></form></div></article>)}</div>
      </section>
    </>
  );
}
