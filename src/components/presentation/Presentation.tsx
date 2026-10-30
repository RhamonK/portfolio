"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Project } from "@/data/projects";
import type { Lang, Presentation as Pres } from "@/data/presentations";
import { ProjectArt } from "@/components/ProjectArt";
import { MOUTH_Y, type PresenterSignals } from "@/components/presentation/signals";

// La 3D n'est chargée qu'à l'ouverture d'une présentation.
const Presenter = dynamic(() => import("@/components/presentation/Presenter"), { ssr: false });

const SLIDE_S = 10; // durée d'une diapo, en secondes
const pad = (n: number) => String(n).padStart(2, "0");

const ui = {
  fr: { play: "Lecture", pause: "Pause", skip: "Passer la présentation →", quit: "Quitter", soundOn: "Son activé", soundOff: "Son coupé", noVoice: "Voix à venir", prev: "Diapo précédente", next: "Diapo suivante", see: "Voir le projet ↗", nextProject: "Projet suivant →", tech: "technologies" },
  en: { play: "Play", pause: "Pause", skip: "Skip the presentation →", quit: "Close", soundOn: "Sound on", soundOff: "Sound off", noVoice: "Voice coming soon", prev: "Previous slide", next: "Next slide", see: "See the project ↗", nextProject: "Next project →", tech: "tech" },
};

// Scène C — présentation d'un projet, avec le présentateur.
export function Presentation({
  project,
  presentation,
  onClose,
  onNextProject,
}: {
  project: Project;
  presentation: Pres;
  onClose: () => void;
  onNextProject: () => void;
}) {
  const slides = presentation.slides;
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const presenterBox = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const speakingSim = useRef(false);
  const signals = useRef<PresenterSignals>({ speaking: 0, pointing: false, mouse: { x: 0, y: 0 }, still: false });

  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [lang, setLang] = useState<Lang>("fr");
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [muted, setMuted] = useState(true);
  const [hasVoice, setHasVoice] = useState(false);
  const [progress, setProgress] = useState(0);
  const playingRef = useRef(playing);
  playingRef.current = playing;
  signals.current.still = reduced;

  const slide = slides[idx];
  const t = ui[lang];
  const last = idx === slides.length - 1;

  // Entrée : la caméra sort du tunnel ; focus sur « Quitter ».
  useEffect(() => {
    closeBtn.current?.focus();
    if (!reduced) gsap.fromTo(root.current, { opacity: 0, scale: 1.08, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out", clearProps: "filter,scale" });
  }, [reduced]);

  // Voix : /public/voix/<projet>-<langue>.mp3, si le fichier existe.
  useEffect(() => {
    const src = `/voix/${project.slug}-${lang}.mp3`;
    let cancelled = false;
    setHasVoice(false);
    fetch(src, { method: "HEAD" })
      .then((r) => {
        if (cancelled || !r.ok || !(r.headers.get("content-type") ?? "").includes("audio")) return;
        const el = new Audio(src);
        el.preload = "auto";
        audio.current = el;
        setHasVoice(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      audio.current?.pause();
      audio.current = null;
      analyser.current = null;
    };
  }, [project.slug, lang]);

  // Son : coupé par défaut. À l'activation, la bouche suit l'amplitude audio.
  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    el.muted = muted;
    if (!muted && !analyser.current) {
      const ctx = new AudioContext();
      const node = ctx.createAnalyser();
      node.fftSize = 256;
      ctx.createMediaElementSource(el).connect(node);
      node.connect(ctx.destination);
      analyser.current = node;
    }
    if (!muted && playingRef.current) {
      el.currentTime = idx * SLIDE_S + (tl.current?.time() ?? 0);
      el.play().catch(() => {});
    } else el.pause();
  }, [muted, hasVoice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bouche : amplitude audio si la voix joue, sinon rythme de lecture simulé.
  useEffect(() => {
    const buf = new Uint8Array(128);
    const tick = (time: number) => {
      let level = 0;
      const el = audio.current;
      if (analyser.current && el && !el.paused && !el.muted) {
        analyser.current.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += Math.abs(v - 128);
        level = Math.min(1, (sum / buf.length) / 18);
      } else if (speakingSim.current && playingRef.current) {
        level = 0.25 + 0.6 * Math.abs(Math.sin(time * 13)) * Math.abs(Math.sin(time * 3.1));
      }
      signals.current.speaking = level;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  // Souris → la tête du présentateur suit un peu.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      signals.current.mouse = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Une diapo = une timeline : mots-clés qui tombent vers la bouche,
  // bâton levé vers la diapo, puis la phrase complète en sous-titre.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".slide-card", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: reduced ? 0 : 0.5, ease: "power2.out" });

      const box = presenterBox.current!.getBoundingClientRect();
      const mouthX = box.left + box.width / 2;
      const mouthY = box.top + box.height * MOUTH_Y;
      const words = gsap.utils.toArray<HTMLElement>(".sub-word");
      const pills = gsap.utils.toArray<HTMLElement>(".kw-pill");

      const timeline = gsap.timeline({
        paused: !playingRef.current,
        onUpdate: () => setProgress(timeline.progress()),
        onComplete: () => {
          if (idx < slides.length - 1) setIdx(idx + 1);
          else setPlaying(false);
        },
      });

      if (reduced) {
        timeline.set(words, { opacity: 1 }, 0);
      } else {
        timeline.set(words, { opacity: 0.12 }, 0);
        pills.forEach((pill, i) => {
          const startX = box.left + box.width * (0.15 + Math.random() * 0.7) - pill.offsetWidth / 2;
          timeline
            .fromTo(pill, { x: startX, y: box.top - 30, opacity: 0, scale: 1 }, { y: box.top + box.height * 0.12, opacity: 1, duration: 0.45, ease: "power2.out" }, 0.3 + i * 0.6)
            .to(pill, { x: mouthX - pill.offsetWidth / 2, y: mouthY - pill.offsetHeight / 2, scale: 0.15, opacity: 0, duration: 0.9, ease: "power2.in" }, ">");
        });
        timeline.call(() => { signals.current.pointing = true; }, [], 1.1);
        timeline.call(() => { signals.current.pointing = false; }, [], 4.2);
        timeline.to(words, { opacity: 1, duration: 0.12, stagger: 5.2 / Math.max(words.length, 1) }, 2.9);
      }
      timeline.call(() => { speakingSim.current = true; }, [], 2.9);
      timeline.call(() => { speakingSim.current = false; }, [], 8.4);
      timeline.set({}, {}, SLIDE_S);
      tl.current = timeline;

      const el = audio.current;
      if (el && !muted && playingRef.current) {
        el.currentTime = idx * SLIDE_S;
        el.play().catch(() => {});
      }
    }, stage);

    return () => {
      speakingSim.current = false;
      signals.current.pointing = false;
      ctx.revert();
    };
  }, [idx, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pause / lecture.
  useEffect(() => {
    if (playing) {
      tl.current?.play();
      if (audio.current && !muted) audio.current.play().catch(() => {});
    } else {
      tl.current?.pause();
      audio.current?.pause();
    }
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = useCallback((i: number) => setIdx(Math.max(0, Math.min(slides.length - 1, i))), [slides.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowRight") go(idx + 1);
    else if (e.key === "ArrowLeft") go(idx - 1);
    else if (e.key === " " && (e.target as HTMLElement).tagName !== "BUTTON") {
      e.preventDefault();
      setPlaying((p) => !p);
    } else if (e.key === "Tab") {
      // garde le focus dans la présentation
      const f = root.current!.querySelectorAll<HTMLElement>("button, a[href]");
      const first = f[0];
      const lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} — présentation`}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-bg"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_100%,rgba(212,255,58,0.14),transparent_60%)]" />

      {/* barre du haut */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 py-4 md:px-8">
        <p className="min-w-0 truncate font-mono text-[13px] text-muted">
          <span className="text-lime">{project.name}</span> · {pad(idx + 1)} / {pad(slides.length)}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-full border border-glass-line text-[13px]" role="group" aria-label="Langue">
            {(["fr", "en"] as Lang[]).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={`min-h-10 px-3 font-mono uppercase ${lang === l ? "bg-lime text-on-lime" : "text-muted hover:text-ink"}`}>
                {l}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            disabled={!hasVoice}
            aria-pressed={!muted}
            title={hasVoice ? undefined : t.noVoice}
            className="btn btn-glass !min-h-10 !px-4 text-[13px] disabled:opacity-40"
          >
            <span aria-hidden>{hasVoice && !muted ? "🔊" : "🔇"}</span>
            <span className="sr-only md:not-sr-only">{hasVoice ? (muted ? t.soundOff : t.soundOn) : t.noVoice}</span>
          </button>
          <button ref={closeBtn} type="button" onClick={onClose} className="btn btn-glass !min-h-10 !px-4 text-[13px]">
            <span className="sr-only md:not-sr-only">{t.quit}</span> ✕
          </button>
        </div>
      </div>

      {/* diapo (≈ 65 %) + présentateur (≈ 35 %) */}
      <div ref={stage} className="relative z-10 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-2 md:gap-4 px-5 md:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] md:grid-rows-1 md:px-8">
        <div className="flex min-w-0 flex-col md:min-h-0">
          <article className="slide-card glass flex flex-col rounded-3xl p-5 md:min-h-0 md:flex-1 md:p-9" aria-live="polite">
            <p className="eyebrow">
              {pad(idx + 1)} · {slide.kind[lang]}
            </p>
            <h2 className="display mt-3 text-[clamp(30px,4vw,58px)]">{slide.title[lang]}</h2>
            <div className="mt-5 grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
              <ul className="space-y-3 text-[clamp(16px,1.5vw,20px)] text-ink/85">
                {slide.lines[lang].map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="relative hidden min-h-[160px] overflow-hidden rounded-2xl border border-glass-line bg-black/30 p-3 md:block">
                <ProjectArt slug={project.slug} />
              </div>
            </div>
            {last && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {project.href && (
                  <a href={project.href} target="_blank" rel="noreferrer" className="btn btn-lime">
                    {t.see}
                  </a>
                )}
                <button type="button" onClick={onNextProject} className="btn btn-glass">
                  {t.nextProject}
                </button>
                {presentation.tech && (
                  <span className="rounded-full border border-glass-line px-3 py-1.5 font-mono text-[12px] text-muted">
                    {t.tech} · {presentation.tech}
                  </span>
                )}
              </div>
            )}
          </article>
          {/* sous-titres */}
          <p className="mx-auto mt-4 min-h-[3.2em] max-w-[820px] text-center text-[clamp(16px,1.6vw,21px)] leading-snug">
            {slide.speech[lang].split(" ").map((w, i) => (
              <span key={`${idx}-${lang}-${i}`} className="sub-word">
                {w}{" "}
              </span>
            ))}
          </p>
        </div>

        <div ref={presenterBox} className="relative min-h-[26svh] md:h-auto" aria-hidden>
          <Presenter signals={signals} />
        </div>

        {/* mots-clés qui tombent vers la bouche du présentateur */}
        <div aria-hidden className="pointer-events-none fixed inset-0 z-20">
          {slide.keywords[lang].map((k, i) => (
            <span
              key={`${idx}-${lang}-${k}`}
              className={`kw-pill glass absolute left-0 top-0 whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[13px] text-lime ${reduced ? "hidden" : ""}`}
              style={{ opacity: 0 }}
              data-i={i}
            >
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* progression (6 segments) + commandes */}
      <div className="relative z-10 px-5 pb-5 pt-3 md:px-8">
        <div className="flex gap-1.5" aria-hidden>
          {slides.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-lime" style={{ width: i < idx ? "100%" : i === idx ? `${progress * 100}%` : "0%" }} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label={t.prev} className="btn btn-glass !min-h-10 !w-10 justify-center !px-0 disabled:opacity-40">
            ←
          </button>
          <button type="button" onClick={() => setPlaying((p) => !p)} className="btn btn-lime !min-h-10 min-w-[120px] justify-center">
            {playing ? `❚❚ ${t.pause}` : `▶ ${t.play}`}
          </button>
          <button type="button" onClick={() => go(idx + 1)} disabled={last} aria-label={t.next} className="btn btn-glass !min-h-10 !w-10 justify-center !px-0 disabled:opacity-40">
            →
          </button>
          <button type="button" onClick={() => go(slides.length - 1)} className="btn !min-h-10 text-[14px] text-muted hover:text-ink">
            {t.skip}
          </button>
        </div>
      </div>
    </div>
  );
}
