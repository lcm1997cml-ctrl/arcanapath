// src/app/journal/page.tsx — server component wrapper
// Checks admin session server-side, passes isAdmin to client component
export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import JournalClientPage from "./JournalClientPage";

export default async function JournalPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";

  return <JournalClientPage isAdmin={isAdmin} />;
}
