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

  function handleLink(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  return (
    <article
      className="relative min-w-0 cursor-pointer overflow-hidden rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-200"
      onClick={openDetail}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      {idea.link ? (
        <a
          aria-label={`Abrir link de ${idea.title}`}
          className="absolute right-5 top-5 grid size-8 place-items-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
          href={idea.link}
          onClick={handleLink}
          rel="noreferrer"
          target="_blank"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19.07" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </a>
      ) : null}
      <div className={`flex flex-wrap gap-2 ${idea.link ? "pr-11" : ""}`}>
        <CategoryBadge category={idea.category} />
        <StatusBadge status={idea.status} />
      </div>
      <h2 className="mt-4 text-lg font-black tracking-tight">{idea.title}</h2>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button className="ml-auto rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700" onClick={handleDelete} type="button">
          Borrar
        </button>
      </div>
    </article>
  );
}
