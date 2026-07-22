import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const endpoint = "http://localhost/api/contact";
const validPayload = {
  name: "テストユーザー",
  email: "test@example.com",
  message: "お問い合わせ内容",
  website: "",
};

const createRequest = (body: BodyInit, contentType = "application/json") =>
  new Request(endpoint, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body,
  });

const readResponse = async (response: Response) => ({
  status: response.status,
  body: (await response.json()) as { message: string },
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/contact", () => {
  it("returns 503 when the webhook is not configured", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "");

    const result = await readResponse(
      await POST(createRequest(JSON.stringify(validPayload))),
    );

    expect(result.status).toBe(503);
    expect(result.body.message).toContain("利用できません");
  });

  it("rejects content types other than JSON", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://example.com/webhook");

    const result = await readResponse(
      await POST(createRequest("{}", "text/plain")),
    );

    expect(result.status).toBe(415);
  });

  it("rejects malformed JSON payloads", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://example.com/webhook");

    const result = await readResponse(await POST(createRequest("null")));

    expect(result.status).toBe(400);
  });

  it("rejects request bodies larger than 16 KiB", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://example.com/webhook");
    const oversizedPayload = JSON.stringify({ message: "a".repeat(17_000) });

    const result = await readResponse(
      await POST(createRequest(oversizedPayload)),
    );

    expect(result.status).toBe(413);
  });

  it("accepts honeypot submissions without calling the webhook", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://example.com/webhook");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await readResponse(
      await POST(
        createRequest(
          JSON.stringify({ ...validPayload, website: "https://spam.example" }),
        ),
      ),
    );

    expect(result.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards valid submissions to the configured webhook", async () => {
    const webhookUrl = "https://example.com/webhook";
    vi.stubEnv("CONTACT_WEBHOOK_URL", webhookUrl);
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await readResponse(
      await POST(createRequest(JSON.stringify(validPayload))),
    );

    expect(result.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      webhookUrl,
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
        signal: expect.any(AbortSignal),
      }),
    );

    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const forwardedPayload = JSON.parse(String(requestOptions.body)) as {
      data: typeof validPayload;
      source: string;
      submittedAt: string;
      type: string;
    };

    expect(forwardedPayload).toMatchObject({
      type: "contact",
      source: "burnworks-nextjs-starter",
      data: {
        name: validPayload.name,
        email: validPayload.email,
        message: validPayload.message,
      },
    });
    expect(Date.parse(forwardedPayload.submittedAt)).not.toBeNaN();
  });

  it("returns 504 when the webhook request times out", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://example.com/webhook");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("Timed out", "TimeoutError")),
    );

    const result = await readResponse(
      await POST(createRequest(JSON.stringify(validPayload))),
    );

    expect(result.status).toBe(504);
  });
});
