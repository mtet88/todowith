import type { Idea } from "./types";

function parseDate(value?: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = startOfDay(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getExpirationDate(idea: Idea) {
  if (idea.dateType === "single") {
    const date = parseDate(idea.dateStart);
    return date ? addDays(date, 1) : null;
  }

  if (idea.dateType === "range") {
    const date = parseDate(idea.dateEnd) ?? parseDate(idea.dateStart);
    return date ? addDays(date, 1) : null;
  }

  return null;
}

export function expirePastIdeas(ideas: Idea[], now = new Date()) {
  let changed = false;
  const today = startOfDay(now);
  const expiredAt = now.toISOString();
  const nextIdeas = ideas.map((idea) => {
    if (idea.status === "done" || idea.status === "repeatable" || idea.status === "discarded") {
      return idea;
    }

    const expirationDate = getExpirationDate(idea);

    if (!expirationDate || today.getTime() <= expirationDate.getTime()) {
      return idea;
    }

    changed = true;
    return {
      ...idea,
      status: "discarded" as const,
      discardedReason: "expired" as const,
      updatedAt: expiredAt,
    };
  });

  return { ideas: nextIdeas, changed };
}
