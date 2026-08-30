import { createExpense } from "@/app/actions";

export default function ExpenseForm({ categories, compact = false, month }: { categories: any[]; compact?: boolean; month?: string }) {
  const fixed = categories.filter((c) => c.type === "fixed");
  const flexible = categories.filter((c) => c.type !== "fixed");
  const today = new Date().toISOString().slice(0, 10);
  const initialDate = month && !today.startsWith(month) ? `${month}-01` : today;
  return <form className={`expense-form ${compact ? "compact" : ""}`} action={createExpense}><div className="form-grid"><label>Amount (MYR)<input name="amount" type="number" min="0.01" step="0.01" placeholder="150.00" required /></label><label>Category<select name="category_id" required defaultValue=""><option value="" disabled>Select category</option><optgroup label="Fixed expenses">{fixed.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</optgroup><optgroup label="Flexible expenses">{flexible.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</optgroup></select></label><label>Date<input name="expense_date" type="date" defaultValue={initialDate} required /></label><label className="wide">Note (optional)<input name="note" placeholder="Lunch with family" /></label></div><button className="button primary" type="submit">Save expense</button></form>
}
