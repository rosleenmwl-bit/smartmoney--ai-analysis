# SmartMoney AI — Tasks

## Sprint 1 — Database + Budget + Expense CRUD
**Goal:** Core data layer and manual expense entry working end-to-end.
- [ ] Run migration SQL (categories, budgets, expenses, receipts, recommendations, audit_logs)
- [ ] Seed categories (10), default budget (MYR 6,000 split), 6 demo expenses
- [ ] `lib/data/` — queries + mutations for budgets, expenses
- [ ] Budget page: view + edit monthly category allocations
- [ ] Expense list page: view all expenses, add manual expense (amount, category, date, note)
- [ ] Delete expense (manual only)
- [ ] App shell: sidebar nav (Dashboard, Expenses, Budget, Recommendations)
- **DoD:** User can set a monthly budget per category, add a manual expense, and see it in the expense list. All persisted to Postgres.

## Sprint 2 — Dashboard + Charts (v1 Functional Milestone)
**Goal:** Visual dashboard showing spent vs budget with charts.
- [ ] Dashboard page: total spent vs allocated, balance remaining (positive green / negative red)
- [ ] Pie chart: spend by category (week/month toggle)
- [ ] Comparison table: actual spent vs budget per category, residual/deficit
- [ ] Top-3 non-fixed expenses table (current week)
- [ ] Empty state: "No expenses logged this month — add your first one"
- [ ] Loading + error states for data fetches
- **DoD:** Visitor opens app → sees seeded dashboard with pie chart, balance, top-3 table. Adds a manual expense → dashboard updates. **This is the v1 functional milestone.**

## Sprint 3 — Receipt Upload + AI Extraction
**Goal:** Snap a receipt, AI fills the fields, user confirms.
- [ ] Supabase Storage private bucket for receipt images
- [ ] Receipt upload component (drag/drop + camera on mobile)
- [ ] `lib/ai/receipt-extract.ts` — call OpenAI Vision, return structured JSON
- [ ] Review screen: show AI-extracted amount/merchant/category with confidence → user edits if needed → save as expense
- [ ] Confidence < 0.70 → highlight for manual review
- [ ] Audit log entry for each extraction
- **DoD:** User uploads a receipt image → sees AI-extracted fields → edits if needed → saves as expense → appears on dashboard.

## Sprint 4 — Recommendations
**Goal:** AI-generated savings suggestions based on current month spend.
- [ ] `lib/ai/recommend.ts` — summarize month's spend, identify top reducible category, generate 3-5 ideas
- [ ] Recommendation card on dashboard: primary idea, backup idea, risks, 3 next actions
- [ ] Mark recommendation as accepted/dismissed
- [ ] Empty state: "Need at least 5 expenses this month to generate recommendations"
- **DoD:** With 5+ expenses logged, user sees a recommendation card with actionable savings tips, can accept or dismiss it.

## Sprint 5 — Lock It Down (Auth + RLS)
**Goal:** Per-user data isolation before real use.
- [ ] Supabase Auth: signup/login (email + password)
- [ ] Replace permissive RLS policies with `auth.uid() = user_id` on all tables
- [ ] Redirect unauthenticated users to login (dashboard no longer public)
- [ ] Seed data tied to a demo user account
- [ ] Logout flow
- **DoD:** User signs up, sees only their own data, cannot access another user's expenses/budgets.

## Text Gantt
```
Sprint 1: DB + Budget + Expense CRUD     ████
Sprint 2: Dashboard + Charts (v1 milestone) ████
Sprint 3: Receipt Upload + AI             ████
Sprint 4: Recommendations                 ████
Sprint 5: Auth + RLS Lock-down            ████
```