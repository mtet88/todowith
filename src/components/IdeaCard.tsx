import Link from "next/link";
import type { Idea } from "@/lib/ideas/types";
import { CategoryBadge, StatusBadge } from "./Badges";

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <CategoryBadge category={idea.category} />
        <StatusBadge status={idea.status} />
      </div>
      <h2 className="mt-4 text-lg font-black tracking-tight">{idea.title}</h2>
      {idea.link ? <p className="mt-2 truncate text-sm text-stone-500">{idea.link}</p> : null}
      <div className="mt-5 flex items-center gap-3">
        <Link className="rounded-full bg-stone-950 px-4 py-2 text-sm font-bold text-white" href={`/ideas/${idea.id}`}>
          Ver
        </Link>
        <Link className="rounded-full bg-stone-100 px-4 py-2 text-sm font-bold text-stone-700" href={`/save?from=${idea.id}`}>
          Duplicar
        </Link>
      </div>
    </article>
  );
}
