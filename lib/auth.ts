import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAppUser() {
  if (process.env.SMARTMONEY_AUTH_REQUIRED !== "true") return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function requireAppUser(nextPath = "/") {
  const user = await getAppUser();
  if (process.env.SMARTMONEY_AUTH_REQUIRED === "true" && !user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}
