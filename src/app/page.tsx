"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CategoryBadge } from "@/components/Badges";
import { getSuggestions } from "@/lib/ideas/scoring";
import type { IdeaCategory } from "@/lib/ideas/types";
import { useLocalIdeas } from "@/hooks/useLocalIdeas";

const visualStyles: Record<IdeaCategory, { background: string; accent: string; icon: string; label: string }> = {
  food: {
    background: "from-orange-200 via-rose-100 to-white",
    accent: "bg-slate-950 text-white",
    icon: "M22 17c0 2.76-2.24 5-5 5H7c-2.76 0-5-2.24-5-5h20ZM4 14h16l-1.38-5.53A6 6 0 0 0 12.8 4H11.2a6 6 0 0 0-5.82 4.47L4 14Z",
    label: "Comer rico",
  },
  places: {
    background: "from-emerald-200 via-sky-100 to-white",
    accent: "bg-slate-950 text-white",
    icon: "M12 22s7-5.64 7-12A7 7 0 0 0 5 10c0 6.36 7 12 7 12Zm0-8.5A3.5 3.5 0 1 0 12 6a3.5 3.5 0 0 0 0 7.5Z",
    label: "Salir",
  },
  events: {
    background: "from-violet-200 via-sky-100 to-white",
    accent: "bg-slate-950 text-white",
    icon: "M5 4h14v4a2 2 0 1 0 0 4v8H5v-8a2 2 0 1 0 0-4V4Zm5 4v8l6-4-6-4Z",
    label: "Evento",
  },
  plans: {
    background: "from-emerald-200 via-lime-100 to-white",
    accent: "bg-slate-950 text-white",
    icon: "M4 17c4-4 12-4 16 0M7 17l2-8h6l2 8M9 9l3-5 3 5M8 13h8",
    label: "Planazo",
  },
  other: {
    background: "from-slate-200 via-sky-100 to-white",
    accent: "bg-slate-950 text-white",
    icon: "M12 3l2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3Z",
    label: "Idea",
  },
};

const whenOptions = ["Hoy", "Manana", "Fin de semana", "Fecha"];

export default function Home() {
  const [selectedWhen, setSelectedWhen] = useState(whenOptions[0]);
  const [whenOpen, setWhenOpen] = useState(false);
  const { ideas, loaded } = useLocalIdeas();
  const suggestions = getSuggestions(ideas);

  return (
    <AppShell>
      <section className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-3xl flex-col">
        <div className="pb-8 md:pb-10">
          <div className="relative flex items-center gap-4">
            <span className="text-xl font-black text-slate-950 md:text-2xl">Cuando:</span>
            <button
              aria-expanded={whenOpen}
              className="inline-flex items-center gap-5 rounded-full bg-slate-950 px-8 py-4 text-base font-medium text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 md:text-lg"
              onClick={() => setWhenOpen((open) => !open)}
              type="button"
            >
              {selectedWhen}
              <svg className="size-5 text-emerald-400" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>
            {whenOpen ? (
              <div className="absolute left-24 top-full z-20 mt-3 w-56 overflow-hidden rounded-3xl bg-white p-2 text-slate-950 shadow-2xl shadow-sky-900/10 ring-1 ring-slate-200 md:left-28">
                {whenOptions.map((option) => (
                  <button
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                      option === selectedWhen ? "bg-emerald-100 text-emerald-800" : "hover:bg-slate-100"
                    }`}
                    key={option}
                    onClick={() => {
                      setSelectedWhen(option);
                      setWhenOpen(false);
                    }}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center pb-12">
          {!loaded ? (
            <div className="grid place-items-center gap-4 text-center">
              <div className="size-20 animate-spin rounded-full border-[6px] border-emerald-100 border-r-emerald-600 border-t-emerald-600" aria-hidden="true" />
              <div>
                <p className="text-xl font-black text-slate-950">Buscando planes para ti</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Estamos encontrando las mejores ideas para tu dia.</p>
              </div>
            </div>
          ) : null}

          {loaded && ideas.length === 0 ? (
            <div className="flex min-h-[30rem] flex-col items-center justify-center text-center">
              <div className="grid size-24 place-items-center rounded-full bg-white/80 shadow-xl shadow-sky-900/10 ring-1 ring-slate-200/70">
                <svg className="size-11 text-emerald-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v18M3 12h18" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                </svg>
              </div>
              <h1 className="mt-7 text-2xl font-black tracking-tight text-slate-950">Aqui apareceran tus planes</h1>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">Guarda tu primera idea y te ayudamos a decidir cuando hacerla.</p>
            </div>
          ) : null}

          {loaded && ideas.length > 0 && suggestions.length === 0 ? (
            <div className="mx-auto max-w-sm text-center">
              <p className="text-2xl font-black leading-tight text-slate-950">No hay planes listos para este momento</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">Prueba otro momento o guarda una nueva idea.</p>
            </div>
          ) : null}

          {loaded && suggestions.length > 0 ? (
            <div>
              <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:px-0">
                {suggestions.map(({ idea, reasons }) => {
                  const visual = visualStyles[idea.category];

                  return (
                    <article className="min-w-[82%] snap-center overflow-hidden rounded-[2rem] bg-white/95 shadow-xl shadow-sky-900/10 ring-1 ring-slate-200/70 backdrop-blur sm:min-w-[21rem]" key={idea.id}>
                      <div className={`relative min-h-56 bg-gradient-to-br ${visual.background} p-5`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.75),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.4),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.2),transparent)]" />
                        <div className="relative flex items-start justify-between gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${visual.accent}`}>{visual.label}</span>
                          <CategoryBadge category={idea.category} />
                        </div>
                        <div className="relative mt-10 grid place-items-center">
                          <div className="grid size-28 place-items-center rounded-[2rem] bg-white/55 shadow-inner ring-1 ring-white/70 backdrop-blur">
                            <svg className="size-16 text-slate-950/70" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d={visual.icon} />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-black tracking-tight text-slate-950">{idea.title}</h3>
                        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{reasons[0]}</p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <a
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/15"
                            href={`https://wa.me/?text=${encodeURIComponent(`Hacemos esto?\n${idea.title}\n${reasons[0]}`)}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Compartir
                          </a>
                          <Link className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700" href={`/ideas/${idea.id}`}>
                            Ver detalle
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              {suggestions.length > 1 ? (
                <p className="mt-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Desliza para ver mas</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
