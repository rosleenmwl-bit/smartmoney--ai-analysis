"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const supabase = createClient();
    const { error: sendError } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
    if (sendError) setError(sendError.message);
    else { setSent(true); setMessage("A verification code was sent. It expires shortly."); }
    setBusy(false);
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" });
    if (verifyError) { setError(verifyError.message); setBusy(false); return; }
    window.location.assign(nextPath || "/");
  }

  return sent ? <form action="#" onSubmit={verifyCode} className="login-form"><p className="login-success">{message}</p><label>Verification code<input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" pattern="[0-9]{6,10}" autoComplete="one-time-code" placeholder="Enter your code" required /></label>{error && <p className="form-error">{error}</p>}<button className="button primary" type="submit" disabled={busy || code.length < 6}>{busy ? "Verifying…" : "Verify code"}</button><button className="login-secondary" type="button" onClick={() => { setSent(false); setCode(""); setMessage(""); setError(""); }}>Use a different email</button></form> : <form action="#" onSubmit={sendCode} className="login-form"><label>Email address<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required placeholder="you@example.com" /></label>{error && <p className="form-error">{error}</p>}<button className="button primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Email me a verification code"}</button></form>;
}
