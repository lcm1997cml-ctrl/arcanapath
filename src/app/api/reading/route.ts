// src/app/api/reading/route.ts
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { generateReading } from "@/lib/reading/generate";
import {
  saveReading,
  incrementUsage,
  getOrCreateVisitorUsage,
  incrementVisitorUsagePersistent,
} from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { deserializeDrawnCards } from "@/lib/tarot/utils";
import type { Topic } from "@/types/reading";

const VISITOR_COOKIE = "arcana_visitor_id";

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
    const body = await req.json();
    const { question, topic, cards: serializedCards } = body;

    // ─── Validate input ──────────────────────────────────────
    if (!question || typeof question !== "string" || question.trim().length < 3) {
      return NextResponse.json({ ok: false, error: "請輸入有效問題" }, { status: 400 });
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

    if (!isAdmin) {
      const visitorUsage = await getOrCreateVisitorUsage(visitorId);
      visitorLimit = Number(visitorUsage.free_limit ?? 1);
      if ((visitorUsage.usage_count ?? 0) >= visitorLimit) {
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

    // ─── Deserialize cards ───────────────────────────────────
    let drawnCards;
    try {
      drawnCards = deserializeDrawnCards(serializedCards);
      const uniq = new Set((drawnCards ?? []).map((c: any) => c?.card?.id));
      if (uniq.size !== 3) {
        return NextResponse.json({ ok: false, error: "同一次抽牌不可重複牌，請重新抽牌" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ ok: false, error: "牌陣資料錯誤" }, { status: 400 });
    }

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

          // ── Parallel: save reading + increment usage ──────
          let remainingFree: number | null = null;
          if (isAdmin) {
            await saveReading(result as any);
            incrementUsage(user!.id); // fire-and-forget
          } else {
            const [, nextCount] = await Promise.all([
              saveReading(result as any),
              incrementVisitorUsagePersistent(visitorId),
            ]);
            remainingFree = Math.max(0, visitorLimit - nextCount);
          }

          console.log("[reading] save + usage done");
          send({ type: "done", id: result.id, remainingFree });
        } catch (err) {
          clearInterval(progressTimer);
          console.error("[/api/reading] stream error:", err);
          send({ type: "error", error: "伺服器錯誤，請稍後再試" });
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
    return NextResponse.json({ ok: false, error: "伺服器錯誤，請稍後再試" }, { status: 500 });
  }
}
