"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CategoryBadge, StatusBadge } from "@/components/Badges";
import { useLocalIdeas } from "@/hooks/useLocalIdeas";
import { deleteLocalIdea, updateLocalIdea } from "@/lib/ideas/storage";
import {
  categoryLabels,
  conditionLabels,
  statusLabels,
  type DateType,
  type Idea,
  type IdeaCategory,
  type IdeaStatus,
  type IdealCondition,
} from "@/lib/ideas/types";

const allowedReturnPaths = new Set(["/", "/ideas", "/account"]);
const categoryOptions = Object.keys(categoryLabels) as IdeaCategory[];
const statusOptions = Object.keys(statusLabels) as IdeaStatus[];
const conditionOptions = Object.keys(conditionLabels) as IdealCondition[];
const dateTypeLabels: Record<DateType, string> = {
  none: "Sin fecha",
  single: "Fecha especifica",
  range: "Rango",
  flexible: "Flexible",
};
const dateTypeOptions = Object.keys(dateTypeLabels) as DateType[];

type IdeaDraft = {
  title: string;
  category: IdeaCategory;
  status: IdeaStatus;
  link: string;
  dateType: DateType;
  dateStart: string;
  dateEnd: string;
  flexibleNote: string;
  locationName: string;
  idealConditions: IdealCondition[];
  notes: string;
};

function getSafeReturnPath(value: string | null) {
  return value && allowedReturnPaths.has(value) ? value : "/ideas";
}

function toDraft(idea: Idea): IdeaDraft {
  return {
    title: idea.title,
    category: idea.category,
    status: idea.status,
    link: idea.link ?? "",
    dateType: idea.dateType,
    dateStart: idea.dateStart ?? "",
    dateEnd: idea.dateEnd ?? "",
    flexibleNote: idea.flexibleNote ?? "",
    locationName: idea.locationName ?? "",
    idealConditions: idea.idealConditions,
    notes: idea.notes ?? "",
  };
}

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeOptionalLink(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getStatusPatch(status: IdeaStatus): Partial<Idea> {
  const timestamp = new Date().toISOString();
  const patch: Partial<Idea> = { status };

  if (status === "done" || status === "repeatable") {
    patch.completedAt = timestamp;
    patch.lastRepeatedAt = status === "repeatable" ? timestamp : undefined;
  }

  if (status === "discarded") {
    patch.discardedReason = "manual";
  }

  return patch;
}

function formatDate(value?: string) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(new Date(value));
}

function getDateSummary(idea: Idea) {
  if (idea.dateType === "single") {
    return formatDate(idea.dateStart) ?? "Fecha especifica sin definir";
  }

  if (idea.dateType === "range") {
    const start = formatDate(idea.dateStart);
    const end = formatDate(idea.dateEnd);

    if (start && end) {
      return `${start} - ${end}`;
    }

    return start ?? end ?? "Rango sin definir";
  }

  if (idea.dateType === "flexible") {
    return idea.flexibleNote || "Flexible";
  }

  return "Sin fecha";
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-black">{label}</h2>
      <div className="mt-2 leading-6 text-stone-600">{children}</div>
    </section>
  );
}

function getStatusActionClass(status: Exclude<IdeaStatus, "pending">, currentStatus: IdeaStatus) {
  const strong = {
    done: "bg-emerald-600 text-white shadow-xl shadow-emerald-900/20",
    repeatable: "bg-amber-500 text-white shadow-xl shadow-amber-900/20",
    discarded: "bg-stone-700 text-white shadow-xl shadow-stone-900/20",
  }[status];

  const subtle = {
    done: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    repeatable: "bg-amber-50 text-amber-800 hover:bg-amber-100",
    discarded: "bg-stone-100 text-stone-600 hover:bg-stone-200",
  }[status];

  return currentStatus === status ? strong : subtle;
}

function getStatusLabel(status: IdeaStatus) {
  return {
    pending: "PENDIENTE",
    done: "HECHO",
    repeatable: "REPETIBLE",
    discarded: "DESCARTADA",
  }[status];
}

function getStatusLabelClass(status: IdeaStatus) {
  return {
    pending: "text-stone-500",
    done: "text-emerald-700",
    repeatable: "text-amber-700",
    discarded: "text-stone-600",
  }[status];
}

export function IdeaDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = getSafeReturnPath(searchParams.get("from"));
  const isEditing = searchParams.get("edit") === "1";
  const detailHref = `/ideas/${id}?from=${encodeURIComponent(returnPath)}`;
  const editHref = `${detailHref}&edit=1`;
  const { ideas, loaded } = useLocalIdeas();
  const idea = ideas.find((item) => item.id === id);
  const [draftOverride, setDraftOverride] = useState<{ id: string; draft: IdeaDraft } | null>(null);
  const [error, setError] = useState("");
  const draft = draftOverride?.id === id ? draftOverride.draft : idea ? toDraft(idea) : null;

  function setDraft(updater: (current: IdeaDraft | null) => IdeaDraft | null) {
    setDraftOverride((current) => {
      const currentDraft = current?.id === id ? current.draft : idea ? toDraft(idea) : null;
      const nextDraft = updater(currentDraft);

      return nextDraft ? { id, draft: nextDraft } : null;
    });
  }

  function setStatus(status: IdeaStatus) {
    updateLocalIdea(id, getStatusPatch(status));
    setDraft((current) => (current ? { ...current, status } : current));
  }

  function deleteIdea() {
    if (window.confirm("Borrar esta idea?")) {
      deleteLocalIdea(id);
      router.push(returnPath);
    }
  }

  function toggleCondition(condition: IdealCondition) {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      const active = current.idealConditions.includes(condition);
      return {
        ...current,
        idealConditions: active
          ? current.idealConditions.filter((item) => item !== condition)
          : [...current.idealConditions, condition],
      };
    });
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft || !idea) {
      return;
    }

    const title = draft.title.trim();

    if (!title) {
      setError("El titulo no puede quedar vacio.");
      return;
    }

    setError("");
    updateLocalIdea(id, {
      ...(draft.status === idea.status ? { status: draft.status } : getStatusPatch(draft.status)),
      title,
      category: draft.category,
      link: normalizeOptionalLink(draft.link),
      dateType: draft.dateType,
      dateStart: draft.dateType === "single" || draft.dateType === "range" ? optionalText(draft.dateStart) : undefined,
      dateEnd: draft.dateType === "range" ? optionalText(draft.dateEnd) : undefined,
      flexibleNote: draft.dateType === "flexible" ? optionalText(draft.flexibleNote) : undefined,
      locationName: optionalText(draft.locationName),
      idealConditions: draft.idealConditions,
      notes: optionalText(draft.notes),
    });
    setDraftOverride(null);
    router.push(detailHref);
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
        <button className="text-sm font-bold text-stone-500" onClick={() => router.push(isEditing ? detailHref : returnPath)} type="button">
          <span aria-hidden="true">&lt;</span> Volver
        </button>

        {isEditing ? (
          <form className="mt-5 rounded-[2rem] bg-white p-6 shadow-sm md:p-8" onSubmit={handleSave}>
            <div className="flex flex-wrap gap-2">
              <CategoryBadge category={draft?.category ?? idea.category} />
              <StatusBadge status={draft?.status ?? idea.status} />
            </div>
            <div className="mt-6 grid gap-5 text-sm">
              <label className="grid gap-2">
                <span className="font-black">Titulo</span>
                <input
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-base font-bold outline-none ring-amber-300 transition focus:ring-4"
                  onChange={(event) => setDraft((current) => (current ? { ...current, title: event.target.value } : current))}
                  value={draft?.title ?? ""}
                />
              </label>
              <DetailRow label="Texto original">{idea.rawText}</DetailRow>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="font-black">Categoria</span>
                  <span className="text-xs font-semibold text-stone-500">Sugerida automaticamente. Puedes cambiarla.</span>
                  <select
                    className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none ring-amber-300 transition focus:ring-4"
                    onChange={(event) => setDraft((current) => (current ? { ...current, category: event.target.value as IdeaCategory } : current))}
                    value={draft?.category ?? "other"}
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {categoryLabels[category]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="font-black">Estado</span>
                  <select
                    className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none ring-amber-300 transition focus:ring-4"
                    onChange={(event) => setDraft((current) => (current ? { ...current, status: event.target.value as IdeaStatus } : current))}
                    value={draft?.status ?? "pending"}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="grid gap-2">
                <span className="font-black">Link</span>
                <input
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none ring-amber-300 transition focus:ring-4"
                  inputMode="url"
                  onChange={(event) => setDraft((current) => (current ? { ...current, link: event.target.value } : current))}
                  placeholder="https://..."
                  type="text"
                  value={draft?.link ?? ""}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="font-black">Fecha</span>
                  <select
                    className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none ring-amber-300 transition focus:ring-4"
                    onChange={(event) => setDraft((current) => (current ? { ...current, dateType: event.target.value as DateType } : current))}
                    value={draft?.dateType ?? "none"}
                  >
                    {dateTypeOptions.map((dateType) => (
                      <option key={dateType} value={dateType}>
                        {dateTypeLabels[dateType]}
                      </option>
                    ))}
                  </select>
                </label>
                {draft?.dateType === "single" || draft?.dateType === "range" ? (
                  <label className="grid gap-2">
                    <span className="font-black">Empieza</span>
                    <input
                      className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none ring-amber-300 transition focus:ring-4"
                      onChange={(event) => setDraft((current) => (current ? { ...current, dateStart: event.target.value } : current))}
                      type="date"
                      value={draft.dateStart}
                    />
                  </label>
                ) : null}
                {draft?.dateType === "range" ? (
                  <label className="grid gap-2">
                    <span className="font-black">Termina</span>
                    <input
                      className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none ring-amber-300 transition focus:ring-4"
                      onChange={(event) => setDraft((current) => (current ? { ...current, dateEnd: event.target.value } : current))}
                      type="date"
                      value={draft.dateEnd}
                    />
                  </label>
                ) : null}
              </div>
              {draft?.dateType === "flexible" ? (
                <label className="grid gap-2">
                  <span className="font-black">Nota flexible</span>
                  <input
                    className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none ring-amber-300 transition focus:ring-4"
                    onChange={(event) => setDraft((current) => (current ? { ...current, flexibleNote: event.target.value } : current))}
                    placeholder="Cuando haga buen clima, cualquier domingo..."
                    value={draft.flexibleNote}
                  />
                </label>
              ) : null}
              <label className="grid gap-2">
                <span className="font-black">Ubicacion</span>
                <input
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none ring-amber-300 transition focus:ring-4"
                  onChange={(event) => setDraft((current) => (current ? { ...current, locationName: event.target.value } : current))}
                  placeholder="Nombre del sitio o zona"
                  value={draft?.locationName ?? ""}
                />
              </label>
              <section>
                <h2 className="font-black">Condiciones ideales</h2>
                <p className="mt-1 text-xs font-semibold text-stone-500">Sugeridas automaticamente. Puedes activar o quitar las que quieras.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {conditionOptions.map((condition) => {
                    const active = draft?.idealConditions.includes(condition) ?? false;

                    return (
                      <button
                        className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                          active ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                        key={condition}
                        onClick={() => toggleCondition(condition)}
                        type="button"
                      >
                        {conditionLabels[condition]}
                      </button>
                    );
                  })}
                </div>
              </section>
              <label className="grid gap-2">
                <span className="font-black">Notas</span>
                <textarea
                  className="min-h-28 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none ring-amber-300 transition focus:ring-4"
                  onChange={(event) => setDraft((current) => (current ? { ...current, notes: event.target.value } : current))}
                  placeholder="Detalles, horarios, con quien ir..."
                  value={draft?.notes ?? ""}
                />
              </label>
            </div>
            {error ? <p className="mt-5 text-sm font-bold text-red-600">{error}</p> : null}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button className="rounded-full bg-stone-950 px-5 py-3 text-center font-black text-white" type="submit">
                Guardar cambios
              </button>
              <button className="rounded-full bg-stone-100 px-5 py-3 text-center font-black text-stone-700" onClick={() => router.push(detailHref)} type="button">
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <article className="mt-5 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
            <div className="fixed right-7 top-[calc(70svh-7.125rem)] z-50 grid gap-3">
              <a
                aria-label={`Compartir ${idea.title}`}
                className="grid size-[4.25rem] place-items-center rounded-full bg-slate-950 text-white shadow-2xl shadow-slate-900/25 transition hover:bg-slate-800"
                href={`https://wa.me/?text=${encodeURIComponent(`Hacemos esto?\n${idea.title}`)}`}
                rel="noreferrer"
                target="_blank"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v11M8 7l4-4 4 4M6 12v7h12v-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </a>
              <button
                aria-label={`Editar ${idea.title}`}
                className="grid size-[4.25rem] place-items-center rounded-full bg-slate-950 text-white shadow-2xl shadow-slate-900/25 transition hover:bg-slate-800"
                onClick={() => router.push(editHref)}
                type="button"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m4 16.5-.5 4 4-.5L19 8.5 15.5 5 4 16.5ZM14 6.5 17.5 10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
              <button
                aria-label={`Borrar ${idea.title}`}
                className="grid size-[4.25rem] place-items-center rounded-full bg-slate-950 text-white shadow-2xl shadow-slate-900/25 transition hover:bg-slate-800"
                onClick={deleteIdea}
                type="button"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <CategoryBadge category={idea.category} />
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight">{idea.title}</h1>
            <div className="mt-6 grid gap-5 text-sm">
              <DetailRow label="Texto original">{idea.rawText}</DetailRow>
              {idea.link ? (
                <DetailRow label="Link">
                  <a className="block break-all text-blue-700" href={idea.link} rel="noreferrer" target="_blank">
                    {idea.link}
                  </a>
                </DetailRow>
              ) : null}
              <DetailRow label="Fecha">{getDateSummary(idea)}</DetailRow>
              <DetailRow label="Ubicacion">{idea.locationName || "Sin ubicacion todavia"}</DetailRow>
              <DetailRow label="Condiciones ideales">
                {idea.idealConditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {idea.idealConditions.map((condition) => (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700" key={condition}>
                        {conditionLabels[condition]}
                      </span>
                    ))}
                  </div>
                ) : (
                  "Sin condiciones todavia"
                )}
              </DetailRow>
              <DetailRow label="Notas">{idea.notes || "Sin notas todavia"}</DetailRow>
              <div className="grid gap-4 rounded-3xl bg-stone-50 p-4 sm:grid-cols-2">
                <DetailRow label="Creada">{formatDate(idea.createdAt) ?? "Sin fecha"}</DetailRow>
                <DetailRow label="Ultima actualizacion">{formatDate(idea.updatedAt) ?? "Sin fecha"}</DetailRow>
                <DetailRow label="Ultima vez sugerida">{formatDate(idea.lastSuggestedAt) ?? "Todavia no"}</DetailRow>
                <DetailRow label="Hecha">{formatDate(idea.completedAt) ?? "Todavia no"}</DetailRow>
              </div>
            </div>
            <div className="mt-8 grid justify-items-center gap-3">
              <div className="flex items-center justify-center gap-3">
                <button
                  aria-label="Marcar como hecha"
                  className={`grid size-14 place-items-center rounded-full transition ${getStatusActionClass("done", idea.status)}`}
                  onClick={() => setStatus("done")}
                  type="button"
                >
                  <svg className="size-7" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m5 12 4 4L19 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                </button>
                <button
                  aria-label="Marcar como repetible"
                  className={`grid size-14 place-items-center rounded-full transition ${getStatusActionClass("repeatable", idea.status)}`}
                  onClick={() => setStatus("repeatable")}
                  type="button"
                >
                  <svg className="size-7" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 12a8 8 0 0 1-13.66 5.66M4 12A8 8 0 0 1 17.66 6.34M17 3v4h-4M7 21v-4h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                </button>
                <button
                  aria-label="Marcar como descartada"
                  className={`grid size-14 place-items-center rounded-full transition ${getStatusActionClass("discarded", idea.status)}`}
                  onClick={() => setStatus("discarded")}
                  type="button"
                >
                  <svg className="size-7" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                </button>
              </div>
              <p className={`text-sm font-black tracking-[0.2em] ${getStatusLabelClass(idea.status)}`}>{getStatusLabel(idea.status)}</p>
            </div>
          </article>
        )}
      </section>
    </AppShell>
  );
}
