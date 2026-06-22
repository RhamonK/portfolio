"use client";

import { useState } from "react";
import { site } from "@/data/site";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Formulaire de contact.
 * - Si une clé Web3Forms est configurée dans site.contactFormKey,
 *   le message est envoyé en async (aucun backend requis).
 * - Sinon, repli automatique sur un mailto pré-rempli.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  // Champs sombres lisibles sur le fond lime.
  const fieldCls =
    "w-full rounded-inner border border-on-lime/25 bg-on-lime/[0.07] px-4 py-3 font-mono text-[14px] text-on-lime placeholder:text-on-lime/50 outline-none transition-colors focus:border-on-lime";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    // Repli mailto tant que la clé n'est pas configurée.
    const formKey = site.contactFormKey as string;
    if (!formKey || formKey === "TODO") {
      const subject = encodeURIComponent(`Contact portfolio — ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: site.contactFormKey,
          name,
          email,
          message,
          subject: `Contact portfolio — ${name}`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-inner border border-on-lime/30 bg-on-lime/[0.07] px-5 py-6 text-center font-mono text-[14px] text-on-lime">
        ✓ Message envoyé — je te réponds en moins de 24h.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          name="name"
          type="text"
          required
          placeholder="Ton nom"
          className={fieldCls}
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Ton email"
          className={fieldCls}
        />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Ton message / ton projet…"
        className={`${fieldCls} resize-none`}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-bg px-7 py-[14px] font-mono text-[14px] font-medium text-lime transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] disabled:opacity-60"
      >
        {status === "sending" ? "Envoi…" : "Envoyer le message →"}
      </button>
      {status === "error" && (
        <p className="font-mono text-[13px] text-on-lime">
          Une erreur est survenue. Écris-moi directement à {site.email}.
        </p>
      )}
    </form>
  );
}
