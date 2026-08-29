-- SmartMoney AI — Demo-first schema
-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'variable',
  icon text,
  sort_order int not null default 0,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table categories enable row level security;
drop policy if exists "categories_v1_read" on categories;
create policy "categories_v1_read" on categories for select using (true);
drop policy if exists "categories_v1_write" on categories;
create policy "categories_v1_write" on categories for all using (true) with check (true);

-- Budgets
create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  category_id uuid references categories(id) on delete cascade,
  allocated_amount numeric(12,2) not null default 0,
  is_total boolean not null default false,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table budgets enable row level security;
drop policy if exists "budgets_v1_read" on budgets;
create policy "budgets_v1_read" on budgets for select using (true);
drop policy if exists "budgets_v1_write" on budgets;
create policy "budgets_v1_write" on budgets for all using (true) with check (true);

-- Expenses
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  expense_date date not null default current_date,
  capture_method text not null default 'manual',
  note text,
  receipt_id uuid,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table expenses enable row level security;
drop policy if exists "expenses_v1_read" on expenses;
create policy "expenses_v1_read" on expenses for select using (true);
drop policy if exists "expenses_v1_write" on expenses;
create policy "expenses_v1_write" on expenses for all using (true) with check (true);

-- Receipts
create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  extracted_amount numeric(12,2),
  extracted_merchant text,
  extracted_category_id uuid references categories(id) on delete set null,
  source text default 'openai-vision',
  confidence numeric(3,2) default 0,
  review_status text not null default 'unreviewed',
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table receipts enable row level security;
drop policy if exists "receipts_v1_read" on receipts;
create policy "receipts_v1_read" on receipts for select using (true);
drop policy if exists "receipts_v1_write" on receipts;
create policy "receipts_v1_write" on receipts for all using (true) with check (true);

-- Recommendations
create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  top_reducible_category_id uuid references categories(id) on delete set null,
  suggestion_text text,
  primary_idea text,
  backup_idea text,
  risks_text text,
  next_actions jsonb default '[]'::jsonb,
  source text default 'openai-gpt',
  confidence numeric(3,2) default 0,
  review_status text not null default 'unreviewed',
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table recommendations enable row level security;
drop policy if exists "recommendations_v1_read" on recommendations;
create policy "recommendations_v1_read" on recommendations for select using (true);
drop policy if exists "recommendations_v1_write" on recommendations;
create policy "recommendations_v1_write" on recommendations for all using (true) with check (true);

-- Audit logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  actor text,
  target_type text,
  target_id uuid,
  metadata jsonb default '{}'::jsonb,
  risk_level text not null default 'low',
  created_at timestamptz not null default now()
);
alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

-- Seed categories
insert into categories (name, type, icon, sort_order) values
  ('Home Loan Repayment', 'fixed', '🏠', 1),
  ('Unifi Home Broadband', 'fixed', '🌐', 2),
  ('Mobile Phone Lines', 'fixed', '📱', 3),
  ('2nd Home Utilities & Maintenance', 'fixed', '🔑', 4),
  ('Restaurant Meals', 'variable', '🍽️', 5),
  ('Online Shopping', 'variable', '🛒', 6),
  ('Medical Expenses', 'variable', '🏥', 7),
  ('Grocery Shopping', 'variable', '🥦', 8),
  ('Car Expenses', 'variable', '🚗', 9),
  ('Ad-Hoc Expenses', 'variable', '📦', 10)
on conflict do nothing;

-- Seed default budget for current month (2025-01)
insert into budgets (month, category_id, allocated_amount, is_total)
select '2025-01', c.id, v.amt, false
from categories c
join (values
  ('Home Loan Repayment', 1500.00),
  ('Unifi Home Broadband', 149.00),
  ('Mobile Phone Lines', 120.00),
  ('2nd Home Utilities & Maintenance', 350.00),
  ('Restaurant Meals', 600.00),
  ('Online Shopping', 500.00),
  ('Medical Expenses', 300.00),
  ('Grocery Shopping', 800.00),
  ('Car Expenses', 500.00),
  ('Ad-Hoc Expenses', 1181.00)
) as v(name, amt) on v.name = c.name
where not exists (select 1 from budgets where month = '2025-01' and category_id = c.id);

insert into budgets (month, allocated_amount, is_total)
select '2025-01', 6000.00, true
where not exists (select 1 from budgets where month = '2025-01' and is_total = true);

-- Seed demo expenses for 2025-01
insert into expenses (category_id, amount, expense_date, capture_method, note)
select c.id, v.amt, v.dt::date, 'manual', v.note
from categories c
join (values
  ('Home Loan Repayment', 1500.00, '2025-01-05', 'Monthly home loan installment'),
  ('Unifi Home Broadband', 149.00, '2025-01-03', 'Unifi 500Mbps'),
  ('Mobile Phone Lines', 120.00, '2025-01-03', '2 mobile lines'),
  ('2nd Home Utilities & Maintenance', 350.00, '2025-01-10', 'Maintenance fee + utilities'),
  ('Restaurant Meals', 85.00, '2025-01-06', 'Family dinner'),
  ('Restaurant Meals', 42.00, '2025-01-08', 'Lunch with friend'),
  ('Grocery Shopping', 230.00, '2025-01-07', 'Weekly groceries'),
  ('Online Shopping', 180.00, '2025-01-09', 'Shopee purchase'),
  ('Car Expenses', 60.00, '2025-01-04', 'Petrol refill'),
  ('Medical Expenses', 95.00, '2025-01-11', 'Pharmacy supplies')
) as v(name, amt, dt, note) on v.name = c.name
where not exists (select 1 from expenses where category_id = c.id and amount = v.amt and expense_date = v.dt::date);

-- Seed one demo recommendation
insert into recommendations (month, top_reducible_category_id, suggestion_text, primary_idea, backup_idea, risks_text, next_actions, source, confidence, review_status)
select '2025-01', c.id,
  'Restaurant Meals is your highest variable spend (MYR 127 this month). Consider cooking 2 more meals per week at home to save ~MYR 200/month.',
  'Reduce restaurant meals from 4x to 2x per week — estimated savings MYR 200/month.',
  'Switch 1 grocery run to a wholesale market — estimated savings MYR 80/month.',
  'Cutting too aggressively may reduce social enjoyment. Start with 1 less restaurant visit per week.',
  '["Skip one restaurant meal this week", "Plan grocery list before shopping", "Review online shopping cart before checkout"]'::jsonb,
  'openai-gpt', 0.88, 'unreviewed'
from categories c
where c.name = 'Restaurant Meals'
and not exists (select 1 from recommendations where month = '2025-01');