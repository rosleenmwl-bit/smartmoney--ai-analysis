import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export type FamilyProfile = {
  id: string;
  name: string;
  email: string;
  isOwner: boolean;
};

const OWNER_EMAIL = "rosleenmwl@yahoo.com";

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

export async function getFamilyProfiles(): Promise<FamilyProfile[]> {
  const currentUser = await getAppUser();
  const owner = {
    id: currentUser?.id ?? "owner",
    name: currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || "Rosleen",
    email: currentUser?.email ?? OWNER_EMAIL,
    isOwner: true,
  };

  // Only the owner may receive the family directory. The service-role key is
  // server-only and is never passed to the browser.
  if (!currentUser || currentUser.email?.toLowerCase() !== OWNER_EMAIL.toLowerCase()) return [owner];
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return [owner];

  const admin = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 50 });
  if (error) return [owner];

  const family = data.users
    .filter((user) => user.id !== currentUser.id)
    .slice(0, 10)
    .map((user) => ({
      id: user.id,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Family member",
      email: user.email ?? "",
      isOwner: false,
    }));
  return [owner, ...family];
}
