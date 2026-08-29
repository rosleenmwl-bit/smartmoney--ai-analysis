# SmartMoney AI — Intelligence Layer

## Messy Inputs
- **Receipt image** — photo of receipt or credit-card statement screenshot. Varies in layout, language (EN/BM), handwriting, partial cropping.
- **Manual entry** — user picks category from dropdown, types amount in MYR. Low ambiguity.

## Auto-Structure Schema (Receipt Extraction)
```json
{
  "amount": 45.50,
  "merchant": "Tesco Express",
  "category": "Grocery Shopping",
  "date": "2025-01-15",
  "confidence": 0.92,
  "items_detected": ["bread", "milk", "eggs"]
}
```

## Events to Track
- expense.created (manual)
- receipt.uploaded
- receipt.extracted (AI result)
- receipt.confirmed (user accepts AI values)
- receipt.edited (user overrides AI values)
- recommendation.generated
- recommendation.accepted / dismissed
- budget.updated

## Scoring Rules (v1 — rule-based, no ML)
- **Budget health score** = (spent / allocated) × 100; < 80% green, 80–95% amber, > 95% red
- **Category risk** = category_spent / category_allocated; flag if > 1.0
- **Top reducible category** = highest absolute spend among variable categories where spent/allocated > 0.9
- **Confidence threshold**: receipt extraction confidence < 0.70 → force user review before saving

## What Gets Ranked
- Categories by monthly spend (for pie chart + top-3 table)
- Weekly spend within month (for weekly breakdown)
- Recommendations by potential MYR savings (primary vs backup)

## v1 vs Later
- **v1:** Receipt OCR extraction (single image), rule-based budget health scoring, GPT-generated recommendation text from current month data
- **Later:** Batch statement upload, multi-month trend analysis, predictive next-month budget suggestion, anomaly detection