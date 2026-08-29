# SmartMoney AI — Test Plan

## v1 Success Scenario (Manual)
1. Open app in browser (no login) → dashboard loads with seeded data
2. Verify: pie chart shows spend by category, balance shows remaining MYR
3. Verify: comparison table shows actual vs budget per category with residual/deficit
4. Verify: top-3 non-fixed expenses table shows current week's top items in MYR
5. Click "Add Expense" → fill amount 150, category "Restaurant Meals", date today, note "Lunch with family"
6. Save → return to dashboard → verify total spent increased by 150, balance decreased by 150
7. Verify pie chart updated to include new expense

## Receipt Upload Test
1. Go to Expenses → click "Upload Receipt"
2. Select a receipt image file
3. Wait for AI extraction → verify amount/merchant/category fields populated
4. If confidence < 0.70 → verify review warning shown
5. Edit category to "Grocery Shopping" → click Save
6. Verify new expense appears in list with capture_method = 'receipt'

## Empty State Test
1. Navigate to a month with no expenses → verify "No expenses logged this month — add your first one"
2. Dashboard balance shows full budget as remaining
3. Pie chart shows empty state message

## Error State Test
1. Disconnect network → attempt to add expense → verify error message shown, no silent failure
2. Reconnect → retry → verify success

## Recommendation Test
1. Ensure 5+ expenses exist for current month
2. Open dashboard → verify recommendation card with primary idea, backup idea, risks, 3 next actions
3. Click "Accept" → verify status changes to accepted
4. With < 5 expenses → verify empty state: "Need at least 5 expenses this month"

## Budget Edit Test
1. Go to Budget page → change "Restaurant Meals" allocation from 500 to 400 → save
2. Return to dashboard → verify comparison table shows new allocation, residual recalculated
3. If spent > new allocation → verify deficit shown in red/negative