import { categoryLabels, statusLabels, type IdeaCategory, type IdeaStatus } from "@/lib/ideas/types";

export function CategoryBadge({ category }: { category: IdeaCategory }) {
  return <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{categoryLabels[category]}</span>;
}

export function StatusBadge({ status }: { status: IdeaStatus }) {
  const tone = {
    pending: "bg-blue-50 text-blue-700",
    done: "bg-emerald-50 text-emerald-700",
    repeatable: "bg-amber-50 text-amber-800",
    discarded: "bg-stone-100 text-stone-500",
  }[status];

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{statusLabels[status]}</span>;
}
