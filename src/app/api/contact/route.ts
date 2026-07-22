import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_REQUEST_BODY_BYTES = 16 * 1024;
const WEBHOOK_TIMEOUT_MS = 10_000;

const getString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const validatePayload = (payload: unknown) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "リクエスト形式が不正です。" };
  }

  const values = payload as Record<string, unknown>;
  const name = getString(values.name);
  const email = getString(values.email);
  const message = getString(values.message);
  const website = getString(values.website);

  if (website) {
    return { isSpam: true as const, name, email, message };
  }

  if (!name || name.length > 80) {
    return { error: "お名前を正しく入力してください。" };
  }

  if (!email || !EMAIL_PATTERN.test(email) || email.length > 120) {
    return { error: "メールアドレスを正しく入力してください。" };
  }

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return { error: "お問い合わせ内容は 1〜1000 文字で入力してください。" };
  }

  return { name, email, message, isSpam: false as const };
};

const readJsonBody = async (request: Request) => {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0];
  if (contentType?.trim().toLowerCase() !== "application/json") {
    return {
      error: "Content-Type は application/json を指定してください。",
      status: 415,
    } as const;
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > MAX_REQUEST_BODY_BYTES) {
    return {
      error: "リクエストサイズが上限を超えています。",
      status: 413,
    } as const;
  }

  if (!request.body) {
    return { error: "リクエスト形式が不正です。", status: 400 } as const;
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let receivedBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      receivedBytes += value.byteLength;
      if (receivedBytes > MAX_REQUEST_BODY_BYTES) {
        await reader.cancel();
        return {
          error: "リクエストサイズが上限を超えています。",
          status: 413,
        } as const;
      }

      body += decoder.decode(value, { stream: true });
    }

    body += decoder.decode();
    return { data: JSON.parse(body) as unknown } as const;
  } catch {
    return { error: "リクエスト形式が不正です。", status: 400 } as const;
  } finally {
    reader.releaseLock();
  }
};

export async function POST(request: Request) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { message: "現在、お問い合わせフォームを利用できません。" },
      { status: 503 },
    );
  }

  const body = await readJsonBody(request);
  if ("error" in body) {
    return NextResponse.json({ message: body.error }, { status: body.status });
  }

  const validated = validatePayload(body.data);
  if ("error" in validated) {
    return NextResponse.json({ message: validated.error }, { status: 400 });
  }

  if (validated.isSpam) {
    return NextResponse.json({ message: "送信を受け付けました。" });
  }

  let response: Response;
  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "burnworks-nextjs-starter/contact",
      },
      body: JSON.stringify({
        type: "contact",
        source: "burnworks-nextjs-starter",
        submittedAt: new Date().toISOString(),
        data: {
          name: validated.name,
          email: validated.email,
          message: validated.message,
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
  } catch (error) {
    const isTimeout =
      error instanceof DOMException && error.name === "TimeoutError";

    return NextResponse.json(
      {
        message: isTimeout
          ? "問い合わせ連携がタイムアウトしました。時間をおいて再度お試しください。"
          : "問い合わせ連携に失敗しました。設定を確認してください。",
      },
      { status: isTimeout ? 504 : 502 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { message: "問い合わせ連携に失敗しました。設定を確認してください。" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message: "送信が完了しました。ありがとうございます。",
  });
}
