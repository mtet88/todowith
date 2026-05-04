"use client";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { IdeaCard } from "@/components/IdeaCard";
import { useLocalIdeas } from "@/hooks/useLocalIdeas";

export default function IdeasPage() {
  const { ideas, loaded } = useLocalIdeas();

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-amber-700">Biblioteca</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Ideas</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">Tu backlog de cosas para hacer con amigos.</p>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {['Todas', 'Pendientes', 'Repetibles', 'Hechas', 'Descartadas'].map((filter) => (
            <button className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-stone-700" key={filter} type="button">
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {!loaded ? <p className="text-sm text-stone-500">Cargando ideas...</p> : null}
          {loaded && ideas.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState title="Aun no hay ideas" body="Guarda algo que algun dia quieras hacer con amigos." />
            </div>
          ) : null}
          {ideas.map((idea) => (
            <IdeaCard idea={idea} key={idea.id} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
