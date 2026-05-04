"use client";

import { KeyboardEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { deleteLocalIdea } from "@/lib/ideas/storage";
import type { Idea } from "@/lib/ideas/types";
import { CategoryBadge, StatusBadge } from "./Badges";

export function IdeaCard({ idea }: { idea: Idea }) {
  const router = useRouter();
  const detailHref = `/ideas/${idea.id}?from=${encodeURIComponent("/ideas")}`;

  function openDetail() {
    router.push(detailHref);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetail();
    }
  }

  function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (window.confirm("Borrar esta idea?")) {
      deleteLocalIdea(idea.id);
    }
  }

  return (
    <article
      className="cursor-pointer rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-200"
      onClick={openDetail}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className="flex flex-wrap gap-2">
        <CategoryBadge category={idea.category} />
        <StatusBadge status={idea.status} />
      </div>
      <h2 className="mt-4 text-lg font-black tracking-tight">{idea.title}</h2>
      {idea.link ? <p className="mt-2 truncate text-sm text-stone-500">{idea.link}</p> : null}
      <button className="mt-5 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700" onClick={handleDelete} type="button">
        Borrar
      </button>
    </article>
  );
}
