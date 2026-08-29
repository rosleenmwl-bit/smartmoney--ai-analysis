import { createClient } from "@/lib/supabase/server";

const DEFAULT_BUDGETS: Record<string, number> = { "Home Loan Repayment": 1500, "Unifi Home Broadband": 149, "Mobile Phone Lines": 120, "2nd Home Utilities & Maintenance": 350, "Restaurant Meals": 600, "Online Shopping": 500, "Medical Expenses": 300, "Grocery Shopping": 800, "Car Expenses": 500, "Ad-Hoc Expenses": 1181 };
function monthKey(date = new Date()) { return date.toISOString().slice(0, 7); }
function startOfWeek(date = new Date()) { const d = new Date(date); const day = d.getDay(); d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)); return d.toISOString().slice(0, 10); }

export async function ensureMonth(month = monthKey()) {
  const supabase = await createClient();
  const { data: cats } = await supabase.from("categories").select("id,name,type,icon,sort_order").order("sort_order");
  if (!cats?.length) return { month, categories: [] };
  const { data: existing } = await supabase.from("budgets").select("id").eq("month", month).limit(1);
  if (!existing?.length) { await supabase.from("budgets").insert(cats.map((c) => ({ month, category_id: c.id, allocated_amount: DEFAULT_BUDGETS[c.name] ?? 0, is_total: false }))); await supabase.from("budgets").insert({ month, allocated_amount: 6000, is_total: true }); }
  const { data: expenses } = await supabase.from("expenses").select("id").gte("expense_date", `${month}-01`).lt("expense_date", `${month}-32`).limit(1);
  const byName = Object.fromEntries(cats.map((c) => [c.name, c.id]));
  if (!expenses?.length) { await supabase.from("expenses").insert([["Home Loan Repayment", 1500, "Monthly home loan installment"], ["Unifi Home Broadband", 149, "Unifi 500Mbps"], ["Restaurant Meals", 85, "Family dinner"], ["Restaurant Meals", 42, "Lunch with friend"], ["Grocery Shopping", 230, "Weekly groceries"], ["Car Expenses", 60, "Petrol refill"]].map(([name, amount, note], i) => ({ category_id: byName[name as string], amount, expense_date: `${month}-${String(Math.min(27, 3 + i * 3)).padStart(2, "0")}`, capture_method: "manual", note })) ); }
  const { data: recs } = await supabase.from("recommendations").select("id").eq("month", month).limit(1);
  if (!recs?.length && byName["Restaurant Meals"]) await supabase.from("recommendations").insert({ month, top_reducible_category_id: byName["Restaurant Meals"], suggestion_text: "Restaurant Meals is a flexible category to watch. Try one planned home-cooked meal each week and keep the social meals you enjoy.", primary_idea: "Reduce one restaurant meal per week — a small change with a visible monthly effect.", backup_idea: "Set a weekly dining-out envelope and stop when it is used.", risks_text: "Keep room for social enjoyment and essential groceries; adjust gently.", next_actions: ["Plan two simple meals at home", "Review dining spend on Sunday", "Move the saved amount to your buffer"], source: "rule-based", confidence: 0.8, review_status: "unreviewed" });
  return { month, categories: cats };
}

export async function getDashboard(month = monthKey()) {
  const supabase = await createClient(); const { categories } = await ensureMonth(month);
  const [budgetRes, expenseRes, recRes] = await Promise.all([supabase.from("budgets").select("id,month,category_id,allocated_amount,is_total").eq("month", month), supabase.from("expenses").select("id,category_id,amount,expense_date,capture_method,note,created_at,categories(name,type,icon)").gte("expense_date", `${month}-01`).lt("expense_date", `${month}-32`).order("expense_date", { ascending: false }), supabase.from("recommendations").select("*,categories(name,icon)").eq("month", month).order("created_at", { ascending: false }).limit(1)]);
  const budgets = budgetRes.data ?? []; const expenses = expenseRes.data ?? []; const recommendation = recRes.data?.[0] ?? null;
  const allocated = Number(budgets.find((b) => b.is_total)?.allocated_amount ?? budgets.filter((b) => !b.is_total).reduce((s, b) => s + Number(b.allocated_amount), 0)); const spent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const comparisons = categories.map((c) => { const budget = Number(budgets.find((b) => b.category_id === c.id && !b.is_total)?.allocated_amount ?? 0); const actual = expenses.filter((e) => e.category_id === c.id).reduce((s, e) => s + Number(e.amount), 0); return { ...c, budget, actual, residual: budget - actual }; });
  const weekly = expenses.filter((e) => e.expense_date >= startOfWeek()).filter((e) => (e.categories as any)?.type !== "fixed").sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 3);
  return { month, categories, budgets, expenses, recommendation, allocated, spent, balance: allocated - spent, comparisons, weekly, weekStart: startOfWeek() };
}
export async function getCategories() { const supabase = await createClient(); const { data } = await supabase.from("categories").select("id,name,type,icon").order("sort_order"); return data ?? []; }
