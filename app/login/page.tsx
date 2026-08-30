import LoginForm from "@/components/login-form";
import "./login.css";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string; next?: string }> }) {
  const params = await searchParams;
  return <main className="login-page"><section className="login-card"><p className="eyebrow">SMARTMONEY AI</p><h1>Welcome back.</h1><p className="login-copy">Enter your email and we’ll send a secure verification code. No password or link to remember.</p><LoginForm nextPath={params.next ?? "/"} /><p className="login-note">Your expenses remain private to your signed-in profile.</p></section></main>;
}
