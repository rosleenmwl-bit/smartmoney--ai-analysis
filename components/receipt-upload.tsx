"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createExtractedExpense } from "@/app/actions";

export default function ReceiptUpload({ categories }: { categories: any[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function choose(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
    setBusy(true);
    const body = new FormData();
    body.append("file", selected);
    try {
      const response = await fetch("/api/extract-receipt", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read this file.");
    } finally {
      setBusy(false);
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData(event.currentTarget);
      await createExtractedExpense(form);
      router.refresh();
      setResult(null);
      setFile(null);
      setPreview("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save receipt expense.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="receipt-upload"><div className="upload-box"><input id="receipt-file" type="file" accept="image/*" capture="environment" onChange={choose} /><label htmlFor="receipt-file"><span className="upload-icon">↥</span><strong>Upload receipt or card statement</strong><small>Used temporarily for extraction; the image is not saved</small></label></div>{busy && <p className="helper-text">Reading your snapshot…</p>}{preview && <div className="receipt-review"><img src={preview} alt="Receipt preview" /><form onSubmit={save}><div className="review-fields"><label>Vendor<input name="merchant" defaultValue={result?.merchant ?? ""} /></label><label>Amount (MYR)<input name="amount" type="number" min="0.01" step="0.01" defaultValue={result?.amount ?? ""} required /></label><label>Category<select name="category_id" required defaultValue={categories.find((category) => category.name.toLowerCase() === String(result?.category ?? "").toLowerCase())?.id ?? ""}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.icon} {category.name}</option>)}</select></label><label>Date<input name="expense_date" type="date" defaultValue={result?.date ?? new Date().toISOString().slice(0, 10)} required /></label></div>{result?.needsReview && <p className="review-warning">Please check the extracted fields before saving.</p>}{error && <p className="form-error">{error}</p>}<button className="button primary" disabled={busy}>{busy ? "Saving…" : "Save extracted expense"}</button></form></div>}</div>;
}
