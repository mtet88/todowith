"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { IdeaCard } from "@/components/IdeaCard";
import { useLocalIdeas } from "@/hooks/useLocalIdeas";
import { categoryLabels, statusLabels, type Idea, type IdeaCategory, type IdeaStatus } from "@/lib/ideas/types";

type FilterValue = "all" | IdeaStatus | IdeaCategory;

const filters: Array<{ label: string; value: FilterValue }> = [
  { label: "Todas", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Repetibles", value: "repeatable" },
  { label: "Hechas", value: "done" },
  { label: "Descartadas", value: "discarded" },
  { label: "Comida", value: "food" },
  { label: "Sitios", value: "places" },
  { label: "Eventos", value: "events" },
  { label: "Planes", value: "plans" },
  { label: "Otro", value: "other" },
];

const statusValues = Object.keys(statusLabels) as IdeaStatus[];
const categoryValues = Object.keys(categoryLabels) as IdeaCategory[];

function matchesFilter(idea: Idea, filter: FilterValue) {
  if (filter === "all") {
    return true;
  }

  if (statusValues.includes(filter as IdeaStatus)) {
    return idea.status === filter;
  }

  if (categoryValues.includes(filter as IdeaCategory)) {
    return idea.category === filter;
  }

  return true;
}

function sortIdeas(left: Idea, right: Idea) {
  if (left.status === "pending" && right.status !== "pending") {
    return -1;
  }

  if (left.status !== "pending" && right.status === "pending") {
    return 1;
  }

  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
}

export default function IdeasPage() {
  const { ideas, loaded } = useLocalIdeas();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const visibleIdeas = ideas.filter((idea) => matchesFilter(idea, activeFilter)).sort(sortIdeas);

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight">Ideas</h1>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                activeFilter === filter.value ? "bg-stone-950 text-white" : "bg-white text-stone-700 hover:bg-stone-50"
              }`}
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              type="button"
            >
              {filter.label}
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
          {loaded && ideas.length > 0 && visibleIdeas.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState title="No hay ideas con este filtro" body="Prueba otro filtro o guarda una idea nueva." />
            </div>
          ) : null}
          {visibleIdeas.map((idea) => (
            <IdeaCard idea={idea} key={idea.id} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
