# SmartMoney AI — Data Model

## categories
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| name | text | e.g. "Home Loan", "Restaurant Meals" |
| type | text | 'fixed' or 'variable' |
| icon | text | emoji or icon name |
| sort_order | int | display order |
| user_id | uuid | nullable, for future owner-scoping |
| created_at | timestamptz | default now() |

## budgets
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| month | text | 'YYYY-MM' |
| category_id | uuid | FK -> categories |
| allocated_amount | numeric(12,2) | MYR |
| is_total | boolean | true for the MYR 6,000 total row |
| user_id | uuid | nullable |
| created_at | timestamptz | default now() |

## expenses
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| category_id | uuid | FK -> categories |
| amount | numeric(12,2) | MYR, always positive |
| expense_date | date | when spend occurred |
| capture_method | text | 'manual' or 'receipt' |
| note | text | optional user note |
| receipt_id | uuid | nullable, FK -> receipts |
| user_id | uuid | nullable |
| created_at | timestamptz | default now() |

## receipts
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| storage_path | text | Supabase Storage path |
| extracted_amount | numeric(12,2) | AI-extracted |
| extracted_merchant | text | AI-extracted |
| extracted_category_id | uuid | nullable, AI-suggested FK -> categories |
| source | text | 'openai-vision' |
| confidence | numeric(3,2) | 0.00–1.00 |
| review_status | text | default 'unreviewed' → 'confirmed'/'edited' |
| user_id | uuid | nullable |
| created_at | timestamptz | default now() |

## recommendations
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| month | text | 'YYYY-MM' |
| top_reducible_category_id | uuid | FK -> categories |
| suggestion_text | text | AI-generated bullet points |
| primary_idea | text | recommended savings action |
| backup_idea | text | alternative savings action |
| risks_text | text | pitfalls to avoid |
| next_actions | jsonb | array of 3 action strings |
| source | text | 'openai-gpt' |
| confidence | numeric(3,2) | 0.00–1.00 |
| review_status | text | default 'unreviewed' → 'accepted'/'dismissed' |
| user_id | uuid | nullable |
| created_at | timestamptz | default now() |

## Relationships
- budgets.category_id → categories.id (many budgets per category across months)
- expenses.category_id → categories.id
- expenses.receipt_id → receipts.id (optional)
- receipts.extracted_category_id → categories.id (AI-suggested, editable)
- recommendations.top_reducible_category_id → categories.id

## RLS Notes
- All tables: RLS enabled, v1 permissive read/write (demo-first, no login wall)
- Lock-down sprint: replace with `auth.uid() = user_id` owner-scoped policies
- `user_id` nullable on all tables so seeded demo rows exist without a logged-in user