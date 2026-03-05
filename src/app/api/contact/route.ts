import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 1000;

const getString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const validatePayload = (payload: ContactPayload) => {
  const name = getString(payload.name);
  const email = getString(payload.email);
  const message = getString(payload.message);
  const website = getString(payload.website);

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

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: "リクエスト形式が不正です。" },
      { status: 400 },
    );
  }

  const validated = validatePayload(payload);
  if ("error" in validated) {
    return NextResponse.json({ message: validated.error }, { status: 400 });
  }

  if (validated.isSpam) {
    return NextResponse.json({ message: "送信を受け付けました。" });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({
      message:
        "送信を受け付けました。`CONTACT_WEBHOOK_URL` を設定すると外部通知に連携できます。",
    });
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
    });
  } catch {
    return NextResponse.json(
      { message: "問い合わせ連携に失敗しました。設定を確認してください。" },
      { status: 502 },
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
