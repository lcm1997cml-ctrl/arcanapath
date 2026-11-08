// src/app/api/reading/route.ts
export const dynamic = "force-dynamic";
// AI generation plus a database write can exceed the short default function
// window after an idle period. Vercel applies the plan's own upper limit.
export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { generateReading } from "@/lib/reading/generate";
import {
  saveReading,
  incrementUsage,
  getOrCreateVisitorUsage,
  hasPremiumAccess,
  reserveVisitorUsage,
  refundVisitorUsage,
} from "@/lib/store";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { getCurrentUser } from "@/lib/auth";
import { deserializeDrawnCards } from "@/lib/tarot/utils";
import { isSupabaseConnectivityError } from "@/lib/db";
import type { Topic } from "@/types/reading";

const VISITOR_COOKIE = "arcana_visitor_id";
const FRIENDLY_AI_ERROR = "星象訊號暫時不穩定，今次未有扣除次數，請稍後再試。";

// Progress messages sent to client during AI generation
const PROGRESS_MESSAGES = [
  "正在感應牌陣…",
  "正在解讀能量…",
  "連結神諭中…",
  "牌義正在浮現…",
];

export async function POST(req: NextRequest) {
  try {
    console.log("[reading] request received");
    const body = await req.json().catch(() => ({}));
    const { question, topic, cards: serializedCards } = body ?? {};

    // ─── Validate input ──────────────────────────────────────
    if (!question || typeof question !== "string" || question.trim().length < 3) {
      return NextResponse.json({ ok: false, error: "請輸入有效問題" }, { status: 400 });
    }
    // Bound prompt size / AI cost (UI already limits input to 300 chars).
    if (question.trim().length > 500) {
      return NextResponse.json({ ok: false, error: "問題太長，請精簡至 300 字以內" }, { status: 400 });
    }

    const validTopics: Topic[] = ["love", "career", "wealth", "life"];
    if (!validTopics.includes(topic)) {
      return NextResponse.json({ ok: false, error: "無效主題" }, { status: 400 });
    }

    if (!Array.isArray(serializedCards) || serializedCards.length !== 3) {
      return NextResponse.json({ ok: false, error: "需要3張牌" }, { status: 400 });
    }
    console.log("[reading] input valid", { topic, questionLength: question?.trim()?.length });

    // ─── Auth & usage check ──────────────────────────────────
    const user = await getCurrentUser();
    const isAdmin = user?.role === "admin";
    let visitorLimit = 1;
    let visitorId = req.cookies.get(VISITOR_COOKIE)?.value ?? "";
    if (!visitorId) visitorId = nanoid(18);

    // ─── Deserialize cards ───────────────────────────────────
    let drawnCards: ReturnType<typeof deserializeDrawnCards>;
    try {
      drawnCards = deserializeDrawnCards(serializedCards);
      const uniq = new Set((drawnCards ?? []).map((c: any) => c?.card?.id));
      if (uniq.size !== 3) {
        return NextResponse.json({ ok: false, error: "同一次抽牌不可重複牌，請重新抽牌" }, { status: 400 });
      }
      // Never trust client-supplied position labels / orientation types.
      const POSITIONS = ["過去", "現在", "未來"];
      drawnCards = drawnCards.map((dc, i) => ({ ...dc, position: POSITIONS[i], reversed: dc.reversed === true }));
    } catch {
      return NextResponse.json({ ok: false, error: "牌陣資料錯誤" }, { status: 400 });
    }

    // ─── Burst protection (per instance, best effort) ────────
    if (!isAdmin) {
      const ip = getClientIp(req);
      if (!rateLimit(`reading:ip:${ip}`, 12, 10 * 60 * 1000) || !rateLimit(`reading:v:${visitorId}`, 4, 60 * 1000)) {
        return NextResponse.json(
          { ok: false, error: "占卜請求太頻密，請稍等一分鐘再試。", code: "RATE_LIMITED" },
          { status: 429 }
        );
      }
    }

    // Usage is reserved BEFORE the AI call and refunded on failure, so
    // parallel requests / retries can't exceed the quota or double-charge.
    let usageRow: { id: string; usage_count: number } | null = null;
    let reservedCount: number | null = null;

    if (!isAdmin) {
      const visitorUsage = await getOrCreateVisitorUsage(visitorId);
      visitorLimit = Number(visitorUsage.free_limit ?? 1);
      const used = Number(visitorUsage.usage_count ?? 0);

      if (used < visitorLimit) {
        usageRow = { id: visitorUsage.id, usage_count: used };
        reservedCount = await reserveVisitorUsage(usageRow);
        if (reservedCount === null) {
          return NextResponse.json(
            { ok: false, error: "你有另一個占卜正在進行中，請稍候。", code: "IN_PROGRESS" },
            { status: 409 }
          );
        }
      } else {
        // Free quota used up → paid plan holders (HK$39 credits / HK$88
        // 30-day unlimited) may still draw; the unlock is applied on view.
        const lead = req.cookies.get("arcana_lead_email")?.value?.trim() || undefined;
        let premium = false;
        try {
          premium = (await hasPremiumAccess(visitorId, lead)).hasAccess;
        } catch (err) {
          console.error("[reading] premium check failed", err);
        }
        if (!premium) {
          const res = NextResponse.json(
            { ok: false, error: "你已用完免費次數", unlockRequired: true, remainingFree: 0 },
            { status: 403 }
          );
          res.cookies.set(VISITOR_COOKIE, visitorId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365,
            path: "/",
          });
          return res;
        }
      }
    }

    const refund = async () => {
      if (usageRow && reservedCount !== null) {
        await refundVisitorUsage(usageRow, reservedCount);
        reservedCount = null;
      }
    };

    // ─── Build cookie header (set before streaming starts) ───
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const cookieHeader = `${VISITOR_COOKIE}=${visitorId}; Path=/; HttpOnly; SameSite=lax; Max-Age=${60 * 60 * 24 * 365}${secure}`;

    // ─── Capture args for closure ─────────────────────────────
    const readingId = nanoid(12);
    const readingArgs = {
      id: readingId,
      question: question.trim(),
      topic: topic as Topic,
      cards: drawnCards,
      userId: isAdmin ? (user?.id ?? null) : null,
    };

    // ─── SSE streaming response ───────────────────────────────
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let closed = false;

        const send = (data: object) => {
          if (closed) return;
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          } catch {
            closed = true;
          }
        };

        // Timer: fire progress messages every 3 s while AI is running
        let msgIdx = 0;
        const progressTimer = setInterval(() => {
          if (msgIdx < PROGRESS_MESSAGES.length) {
            send({ type: "progress", message: PROGRESS_MESSAGES[msgIdx++] });
          }
        }, 3000);

        try {
          send({ type: "progress", message: "牌陣已就緒…" });
          console.log("[reading] generateReading start");

          const result = await generateReading(readingArgs);

          clearInterval(progressTimer);
          console.log("[reading] generateReading success", { id: result?.id });
          send({ type: "progress", message: "整理洞見中…" });

          await saveReading(result as any);

          let remainingFree: number | null = null;
          if (isAdmin) {
            incrementUsage(user!.id); // in-memory stat only
          } else if (reservedCount !== null) {
            remainingFree = Math.max(0, visitorLimit - reservedCount);
          } else {
            remainingFree = 0; // premium path
          }

          console.log("[reading] save + usage done");
          send({ type: "done", id: result.id, remainingFree });
        } catch (err) {
          clearInterval(progressTimer);
          console.error("[/api/reading] stream error:", err);
          await refund();
          send({ type: "error", error: FRIENDLY_AI_ERROR });
        } finally {
          closed = true;
          try { controller.close(); } catch { /* already closed */ }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Set-Cookie": cookieHeader,
      },
    });
  } catch (err) {
    console.error("[/api/reading] outer error:", err);
    if (isSupabaseConnectivityError(err)) {
      return NextResponse.json(
        {
          ok: false,
          error: "占卜服務暫時未能連接資料庫，請稍後再試。",
          code: "DATABASE_UNAVAILABLE",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: "星象訊號暫時不穩定，請稍後再試。" }, { status: 500 });
  }
}
