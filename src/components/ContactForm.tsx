"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { ui, type Lang } from "@/i18n";

// Formulaire de contact intégré : le visiteur écrit sans quitter le site.
// - Avec une clé Web3Forms (NEXT_PUBLIC_WEB3FORMS_KEY au moment du build) :
//   le message part directement (POST JSON vers api.web3forms.com, autorisé par la CSP).
// - Sans clé : le courriel est préparé (destinataire, objet, message) et
//   s'ouvre dans l'application de courriel du visiteur. Rien n'est stocké.
const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

type Status = "idle" | "sending" | "sent" | "mailto" | "error";

export function ContactForm({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // champ piège : un humain ne le voit pas, un robot le remplit
    if (data.get("botcheck")) return;
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "");
    const message = String(data.get("message") ?? "").trim();
    const subject = `${t.formSubject}${topic} — ${name}`;

    if (!KEY) {
      const body = `${message}\n\n${name}\n${email}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: KEY, subject, name, email, topic, message, from_name: "Portfolio" }),
      });
      const j = (await r.json()) as { success?: boolean };
      if (!r.ok || !j.success) throw new Error("send failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const field =
    "mt-1.5 w-full rounded-xl border border-glass-line bg-white/[0.04] px-4 py-3 text-[16px] text-ink placeholder:text-muted/70 focus:border-lime/60 focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="glass mt-4 rounded-2xl p-6 md:p-7" data-reveal>
      <h3 className="text-[22px] font-bold tracking-tight">{t.formTitle}</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="block text-[14px] text-muted">
          {t.formName}
          <input name="name" required maxLength={80} autoComplete="name" className={field} />
        </label>
        <label className="block text-[14px] text-muted">
          {t.formEmail}
          <input name="email" type="email" required maxLength={120} autoComplete="email" className={field} />
        </label>
        <label className="block text-[14px] text-muted">
          {t.formTopic}
          <select name="topic" className={field} defaultValue={t.formTopics[1]}>
            {t.formTopics.map((o) => (
              <option key={o} value={o} className="bg-bg">
                {o}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-4 block text-[14px] text-muted">
        {t.formMessage}
        <textarea name="message" required minLength={10} maxLength={3000} rows={5} className={`${field} resize-y`} />
      </label>
      {/* piège à robots, caché aux humains et aux lecteurs d'écran */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="btn btn-lime disabled:opacity-60">
          {status === "sending" ? t.formSending : `${t.formSend} →`}
        </button>
        <p role="status" aria-live="polite" className="text-[15px]">
          {status === "sent" && <span className="text-lime">{t.formSent}</span>}
          {status === "mailto" && <span className="text-muted">{t.formMailto}</span>}
          {status === "error" && (
            <span className="text-ink">
              {t.formError}{" "}
              <a href={`mailto:${site.email}`} className="text-lime underline underline-offset-4">
                {site.email}
              </a>
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
