"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Project } from "@/data/projects";
import type { Lang, Presentation as Pres } from "@/data/presentations";
import { ScreenContent } from "@/components/ProjectScreen";
import { MOUTH_Y, type PresenterSignals } from "@/components/presentation/signals";

// Desktop : une seule pièce en 3D (salle Blender + diapo sur l'écran + présentateur).
// Mobile : la diapo seule (capture, titre, texte), sans 3D.
const Stage3D = dynamic(() => import("@/components/presentation/Stage3D"), { ssr: false });

const SLIDE_S = 10; // durée d'une diapo, en secondes
/** Pistes présentes dans public/voix (ex. "kelthen-fr"). Vide tant que la voix n'est pas générée. */
const VOICES: string[] = [];
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
  initialLang = "fr",
  projectIndex = 0,
}: {
  project: Project;
  /** Rang du projet dans la salle (écran de face). */
  projectIndex?: number;
  presentation: Pres;
  onClose: () => void;
  /** Langue de la page qui ouvre la présentation. */
  initialLang?: Lang;
  /** Absent sur le dernier projet. */
  onNextProject?: () => void;
}) {
  const slides = presentation.slides;
  // Scène unique en 3D : grand écran, WebGL et mouvement normal.
  const [scene3d] = useState(() => {
    if (typeof window === "undefined") return false;
    if (!window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) return false;
    try {
      return !!document.createElement("canvas").getContext("webgl2");
    } catch {
      return false;
    }
  });
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
  const [lang, setLang] = useState<Lang>(initialLang);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [muted, setMuted] = useState(true);
  const [hasVoice, setHasVoice] = useState(false);
  const [progress, setProgress] = useState(0);
  // En 3D, la lecture attend que la salle et le présentateur soient prêts.
  const [ready, setReady] = useState(!scene3d);
  const onReady = useCallback(() => setReady(true), []);
  const playingRef = useRef(playing);
  playingRef.current = playing && ready;
  signals.current.still = reduced;

  const slide = slides[idx];
  const t = ui[lang];
  const last = idx === slides.length - 1;

  // Entrée : la caméra sort du tunnel ; focus sur « Quitter ».
  useEffect(() => {
    closeBtn.current?.focus();
    if (!reduced) gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
  }, [reduced]);

  // Voix : /public/voix/<projet>-<langue>.mp3, quand elle est listée dans VOICES.
  useEffect(() => {
    const name = `${project.slug}-${lang}`;
    setHasVoice(false);
    if (VOICES.includes(name)) {
      const el = new Audio(`/voix/${name}.mp3`);
      el.preload = "auto";
      audio.current = el;
      setHasVoice(true);
    }
    return () => {
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

      const box = (presenterBox.current ?? stage.current!).getBoundingClientRect();
      const mouthX = box.left + box.width * (signals.current.mouthX ?? 0.5);
      const mouthY = box.top + box.height * (signals.current.mouthY ?? MOUTH_Y);
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

      if (reduced || !scene3d) {
        timeline.set(words, { opacity: 1 }, 0);
      } else {
        timeline.set(words, { opacity: 0.12 }, 0);
        pills.forEach((pill, i) => {
          // en 3D, ils tombent au-dessus du présentateur, jamais sur la diapo
          const startX = mouthX + 50 + Math.random() * 110;
          timeline
            .fromTo(pill, { x: startX, y: box.top + 12, opacity: 0, scale: 1 }, { y: box.top + box.height * 0.12, opacity: 1, duration: 0.45, ease: "power2.out" }, 0.3 + i * 0.6)
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

  // Pause / lecture (et départ dès que la scène 3D est prête).
  useEffect(() => {
    if (playing && ready) {
      tl.current?.play();
      if (audio.current && !muted) audio.current.play().catch(() => {});
    } else {
      tl.current?.pause();
      audio.current?.pause();
    }
  }, [playing, ready]); // eslint-disable-line react-hooks/exhaustive-deps

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
      aria-label={`${project.name} — ${lang === "fr" ? "présentation" : "presentation"}`}
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
      <div
        ref={stage}
        className={
          scene3d
            ? "relative z-10 flex min-h-0 flex-1 flex-col"
            : "relative z-10 flex min-h-0 flex-1 flex-col px-5 md:px-8"
        }
      >
        {scene3d && (
          <div ref={presenterBox} className="relative min-h-0 flex-1" aria-hidden>
            {!ready && (
              <div className="absolute inset-0 grid place-items-center">
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-lime/20 border-t-lime" />
              </div>
            )}
            <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
              <Stage3D
                signals={signals}
                projectIndex={projectIndex}
                onReady={onReady}
                view={{ slide, lang, index: idx, images: slide.shots ?? [project.image ?? `/projets/${project.slug}/dessin.svg`] }}
              />
            </div>
          </div>
        )}
        <div className={scene3d ? "relative z-10 flex flex-col items-center px-8" : "flex min-w-0 flex-col md:min-h-0"}>
          {/* en 3D, la diapo est dessinée sur l'écran : ce texte reste lu par les lecteurs d'écran */}
          <article className={scene3d ? "sr-only" : "slide-card glass flex flex-col rounded-3xl p-5 md:min-h-0 md:flex-1 md:p-9"} aria-live="polite">
            <p className="eyebrow">
              {pad(idx + 1)} · {slide.kind[lang]}
            </p>
            <h2 className="display mt-3 text-[clamp(30px,4vw,58px)]">{slide.title[lang]}</h2>
            <div className="mt-5 flex min-h-0 flex-1">
              {/* le détail est dit en sous-titres : à l'écran, la capture seule */}
              <ul className="sr-only">
                {slide.lines[lang].map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="relative min-h-[180px] flex-1 overflow-hidden rounded-2xl border border-glass-line bg-black/30">
                {slide.shots ? (
                  <div className="flex h-full gap-3 p-2">
                    {slide.shots.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt="" className="min-w-0 flex-1 rounded-xl object-contain" />
                    ))}
                  </div>
                ) : (
                  <ScreenContent project={project} />
                )}
              </div>
            </div>
            {last && !scene3d && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {project.href && (
                  <a href={project.href} target="_blank" rel="noreferrer" className="btn btn-lime">
                    {t.see}
                  </a>
                )}
                {onNextProject && (
                  <button type="button" onClick={onNextProject} className="btn btn-glass">
                    {t.nextProject}
                  </button>
                )}
                {presentation.tech && (
                  <span className="rounded-full border border-glass-line px-3 py-1.5 font-mono text-[12px] text-muted">
                    {t.tech} · {presentation.tech}
                  </span>
                )}
              </div>
            )}
          </article>
          {/* sous-titres */}
          <p
            className="mx-auto mt-4 min-h-[3.2em] max-w-[820px] text-center text-[clamp(16px,1.6vw,21px)] leading-snug"
          >
            {slide.speech[lang].split(" ").map((w, i) => (
              <span key={`${idx}-${lang}-${i}`} className="sub-word">
                {w}{" "}
              </span>
            ))}
          </p>
        </div>

        {/* mots-clés qui tombent vers la bouche du présentateur */}
        {scene3d && !reduced && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-20">
          {slide.keywords[lang].map((k, i) => (
            <span
              key={`${idx}-${lang}-${k}`}
              className="kw-pill absolute left-0 top-0 whitespace-nowrap rounded-full border border-lime/30 bg-[#11140d] px-3 py-1.5 font-mono text-[13px] text-lime will-change-transform"
              style={{ opacity: 0 }}
              data-i={i}
            >
              {k}
            </span>
          ))}
        </div>
        )}
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
          {scene3d && last && (
            <div className="flex flex-wrap items-center justify-center gap-2 border-l border-glass-line pl-3">
              {project.href && (
                <a href={project.href} target="_blank" rel="noreferrer" className="btn btn-lime">
                  {t.see}
                </a>
              )}
              {onNextProject && (
                <button type="button" onClick={onNextProject} className="btn btn-glass">
                  {t.nextProject}
                </button>
              )}
              {presentation.tech && (
                <span className="rounded-full border border-glass-line bg-bg/70 px-3 py-1.5 font-mono text-[12px] text-muted">
                  {t.tech} · {presentation.tech}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
