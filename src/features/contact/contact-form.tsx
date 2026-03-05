"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
  website: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
  website: "",
};

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResultMessage(null);
    setIsError(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "送信に失敗しました。");
      }

      setFormState(initialState);
      setResultMessage(data.message ?? "送信が完了しました。");
    } catch (error) {
      setIsError(true);
      setResultMessage(
        error instanceof Error
          ? error.message
          : "送信に失敗しました。時間をおいて再度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-stone-200 bg-white/80 p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-stone-800">お名前</span>
          <input
            required
            maxLength={80}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2"
            value={formState.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-stone-800">メールアドレス</span>
          <input
            required
            type="email"
            maxLength={120}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2"
            value={formState.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
      </div>
      <label className="hidden">
        <span>Website</span>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={formState.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-stone-800">お問い合わせ内容</span>
        <textarea
          required
          rows={6}
          maxLength={1000}
          className="rounded-lg border border-stone-300 bg-white px-3 py-2"
          value={formState.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </label>
      <button
        disabled={isSubmitting}
        className="rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-500"
        type="submit"
      >
        {isSubmitting ? "送信中..." : "送信する"}
      </button>
      {resultMessage ? (
        <p
          className={`text-sm ${isError ? "text-red-700" : "text-green-700"}`}
          role="status"
        >
          {resultMessage}
        </p>
      ) : null}
    </form>
  );
}
