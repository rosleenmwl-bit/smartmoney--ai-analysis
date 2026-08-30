import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth";

export async function POST(request: Request) {
  if (process.env.SMARTMONEY_AUTH_REQUIRED === "true" && !(await getAppUser())) {
    return NextResponse.json({ error: "Sign in is required." }, { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Select a receipt image first." }, { status: 400 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ amount: "", merchant: file.name.replace(/\.[^.]+$/, ""), category: "", date: new Date().toISOString().slice(0, 10), confidence: 0.1, needsReview: true, message: "AI extraction is not configured. Please review and enter the fields manually." });
  const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");
  const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-4o-mini", response_format: { type: "json_object" }, messages: [{ role: "system", content: "Extract a receipt into JSON with amount, merchant, category, date, confidence. Amount must be positive MYR. If uncertain, lower confidence." }, { role: "user", content: [{ type: "text", text: "Read this receipt or card statement snapshot." }, { type: "image_url", image_url: { url: `data:${file.type};base64,${bytes}` } }] }] }) });
  if (!response.ok) return NextResponse.json({ error: "Receipt extraction failed. You can still enter the values manually." }, { status: 502 });
  const result = await response.json(); const content = result.choices?.[0]?.message?.content ?? "{}"; let parsed: any = {}; try { parsed = JSON.parse(content); } catch { parsed = {}; }
  return NextResponse.json({ amount: parsed.amount ?? "", merchant: parsed.merchant ?? "", category: parsed.category ?? "", date: parsed.date ?? new Date().toISOString().slice(0, 10), confidence: Number(parsed.confidence ?? 0), needsReview: Number(parsed.confidence ?? 0) < 0.7 });
}
