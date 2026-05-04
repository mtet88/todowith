"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CategoryBadge, StatusBadge } from "@/components/Badges";
import { useLocalIdeas } from "@/hooks/useLocalIdeas";
import { updateLocalIdea } from "@/lib/ideas/storage";
import type { Idea, IdeaStatus } from "@/lib/ideas/types";

const allowedReturnPaths = new Set(["/", "/ideas", "/account"]);

function getSafeReturnPath(value: string | null) {
  return value && allowedReturnPaths.has(value) ? value : "/ideas";
}

export function IdeaDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = getSafeReturnPath(searchParams.get("from"));
  const { ideas, loaded } = useLocalIdeas();
  const idea = ideas.find((item) => item.id === id);

  function setStatus(status: IdeaStatus) {
    const timestamp = new Date().toISOString();
    const patch: Partial<Idea> = { status };

    if (status === "done" || status === "repeatable") {
      patch.completedAt = timestamp;
      patch.lastRepeatedAt = status === "repeatable" ? timestamp : undefined;
    }

    if (status === "discarded") {
      patch.discardedReason = "manual";
    }

    updateLocalIdea(id, patch);
  }

  if (!loaded) {
    return (
      <AppShell>
        <p className="text-sm text-stone-500">Cargando idea...</p>
      </AppShell>
    );
  }

  if (!idea) {
    return (
      <AppShell>
        <section className="mx-auto max-w-2xl rounded-[2rem] bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-black tracking-tight">Idea no encontrada</h1>
          <p className="mt-3 text-sm text-stone-500">Puede que exista en otro navegador o haya sido eliminada localmente.</p>
          <Link className="mt-6 inline-flex rounded-full bg-stone-950 px-5 py-3 text-sm font-bold text-white" href="/ideas">
            Volver a ideas
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-2xl">
        <button className="text-sm font-bold text-stone-500" onClick={() => router.push(returnPath)} type="button">
          <span aria-hidden="true">&lt;</span> Volver
        </button>
        <article className="mt-5 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap gap-2">
            <CategoryBadge category={idea.category} />
            <StatusBadge status={idea.status} />
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight">{idea.title}</h1>
          <div className="mt-6 grid gap-5 text-sm">
            <section>
              <h2 className="font-black">Texto original</h2>
              <p className="mt-2 leading-6 text-stone-600">{idea.rawText}</p>
            </section>
            {idea.link ? (
              <section>
                <h2 className="font-black">Link</h2>
                <a className="mt-2 block break-all text-blue-700" href={idea.link} rel="noreferrer" target="_blank">
                  {idea.link}
                </a>
              </section>
            ) : null}
            <section>
              <h2 className="font-black">Condiciones ideales</h2>
              <p className="mt-2 text-stone-600">
                {idea.idealConditions.length > 0 ? idea.idealConditions.join(", ") : "Sin condiciones todavia"}
              </p>
            </section>
          </div>
          <div className="mt-8 grid gap-3">
            <a
              className="rounded-full bg-green-500 px-5 py-3 text-center font-bold text-white"
              href={`https://wa.me/?text=${encodeURIComponent(`Hacemos esto?\n${idea.title}`)}`}
              rel="noreferrer"
              target="_blank"
            >
              Compartir por WhatsApp
            </a>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button className="rounded-full bg-emerald-50 px-4 py-3 font-bold text-emerald-700" onClick={() => setStatus("done")} type="button">
                Hecha
              </button>
              <button className="rounded-full bg-amber-50 px-4 py-3 font-bold text-amber-800" onClick={() => setStatus("repeatable")} type="button">
                Repetible
              </button>
              <button className="rounded-full bg-stone-100 px-4 py-3 font-bold text-stone-600" onClick={() => setStatus("discarded")} type="button">
                Descartar
              </button>
            </div>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
