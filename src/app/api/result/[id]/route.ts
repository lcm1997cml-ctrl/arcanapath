// src/app/api/result/[id]/route.ts
// Legacy JSON endpoint (no current client caller). Kept for backward
// compatibility; uses the same server-verified entitlement as /result/[id].
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getReading } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { stripPaidContent } from "@/lib/reading/normalize";
import { resolveReadingAccess } from "@/lib/payments/access";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getReading(id);

    if (!result) {
      return NextResponse.json({ ok: false, error: "找不到此占卜結果" }, { status: 404 });
    }

    const user = await getCurrentUser();
    const access = await resolveReadingAccess({
      reading: result,
      isAdmin: user?.role === "admin",
      visitorId: req.cookies.get("arcana_visitor_id")?.value,
      restoredEmail: req.cookies.get("arcana_lead_email")?.value,
      stripeSessionId: req.nextUrl.searchParams.get("session_id") ?? undefined,
    });

    const data = access.unlocked ? { ...result, isPaid: true } : stripPaidContent(result as any);
    const { userId: _omit, ...publicData } = data as any;
    return NextResponse.json({ ok: true, data: publicData, unlocked: access.unlocked });
  } catch (err) {
    console.error("[/api/result]", err);
    return NextResponse.json({ ok: false, error: "暫時未能載入結果，請稍後再試" }, { status: 500 });
  }
}
