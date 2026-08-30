import { type NextRequest } from "next/server";
// Keep the edge middleware dependency relative so Vercel can bundle it without
// treating the server-only path alias as an unsupported edge module.
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
