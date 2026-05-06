import type { Idea } from "./types";

export type SuggestionMoment = "today" | "tomorrow" | "weekend" | "date";

export type SuggestionContext = {
  moment?: SuggestionMoment;
  targetDate?: Date;
};

export type ScoredIdea = {
  idea: Idea;
  score: number;
  reasons: string[];
};

function daysBetween(fromIso: string, to = new Date()) {
  const from = new Date(fromIso).getTime();
  return Math.floor((to.getTime() - from) / 86_400_000);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = startOfDay(date);
  next.setDate(next.getDate() + days);
  return next;
}

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

function getWeekendRange(today: Date) {
  const day = today.getDay();
  const daysUntilSaturday = day === 0 ? -1 : 6 - day;
  const start = day === 0 ? addDays(today, -1) : addDays(today, daysUntilSaturday);
  const end = addDays(start, 1);

  return { start, end };
}

function getTargetRange(context: Required<SuggestionContext>) {
  const today = startOfDay(new Date());

  if (context.moment === "tomorrow") {
    const target = addDays(today, 1);
    return { start: target, end: target };
  }

  if (context.moment === "weekend") {
    return getWeekendRange(today);
  }

  if (context.moment === "date") {
    const target = startOfDay(context.targetDate);
    return { start: target, end: target };
  }

  return { start: today, end: today };
}

function isSameOrBefore(left: Date, right: Date) {
  return startOfDay(left).getTime() <= startOfDay(right).getTime();
}

function isSameOrAfter(left: Date, right: Date) {
  return startOfDay(left).getTime() >= startOfDay(right).getTime();
}

function overlapsRange(start: Date, end: Date, targetStart: Date, targetEnd: Date) {
  return isSameOrBefore(start, targetEnd) && isSameOrAfter(end, targetStart);
}

function formatDate(value?: string) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(date) : null;
}

function getDateFit(idea: Idea, context: Required<SuggestionContext>) {
  const target = getTargetRange(context);
  const allowsNearFuture = context.moment === "weekend";
  const allowsFallback = idea.dateType === "none" || idea.dateType === "flexible";

  if (idea.dateType === "single") {
    const date = parseDate(idea.dateStart);

    if (!date) {
      return { applies: true, score: 0, reason: "Tiene una fecha especifica por completar." };
    }

    if (overlapsRange(date, date, target.start, target.end)) {
      return { applies: true, score: 35, reason: `Cae en este momento: ${formatDate(idea.dateStart)}.` };
    }

    if (!allowsNearFuture) {
      return { applies: false, score: 0, reason: "" };
    }

    const daysAway = Math.ceil((date.getTime() - target.end.getTime()) / 86_400_000);

    if (daysAway >= 0 && daysAway <= 7) {
      return { applies: true, score: 12, reason: `Se acerca: ${formatDate(idea.dateStart)}.` };
    }

    return { applies: false, score: 0, reason: "" };
  }

  if (idea.dateType === "range") {
    const start = parseDate(idea.dateStart);
    const end = parseDate(idea.dateEnd) ?? start;

    if (!start || !end) {
      return { applies: true, score: 0, reason: "Tiene un rango de fechas por completar." };
    }

    if (overlapsRange(start, end, target.start, target.end)) {
      return { applies: true, score: 32, reason: "Esta dentro del rango de fechas." };
    }

    if (!allowsNearFuture) {
      return { applies: false, score: 0, reason: "" };
    }

    const daysAway = Math.ceil((start.getTime() - target.end.getTime()) / 86_400_000);

    if (daysAway >= 0 && daysAway <= 7) {
      return { applies: true, score: 10, reason: `Empieza pronto: ${formatDate(idea.dateStart)}.` };
    }

    return { applies: false, score: 0, reason: "" };
  }

  if (idea.dateType === "flexible") {
    return { applies: true, score: 4, reason: idea.flexibleNote ? `Flexible: ${idea.flexibleNote}.` : "Es flexible para este momento." };
  }

  return { applies: allowsFallback, score: 0, reason: "" };
}

function canSuggest(idea: Idea) {
  if (idea.status === "done" || idea.status === "discarded") {
    return false;
  }

  if (idea.status === "repeatable") {
    const anchor = idea.lastRepeatedAt ?? idea.completedAt;
    return anchor ? daysBetween(anchor) >= 15 : true;
  }

  return true;
}

export function getSuggestions(ideas: Idea[], context: SuggestionContext = {}): ScoredIdea[] {
  const resolvedContext: Required<SuggestionContext> = {
    moment: context.moment ?? "today",
    targetDate: context.targetDate ?? new Date(),
  };

  return ideas
    .filter(canSuggest)
    .map((idea) => {
      const reasons: string[] = [];
      let score = 10;
      const age = daysBetween(idea.createdAt);
      const dateFit = getDateFit(idea, resolvedContext);

      if (!dateFit.applies) {
        return null;
      }

      score += dateFit.score;

      if (dateFit.reason) {
        reasons.push(dateFit.reason);
      }

      if (idea.status === "pending") {
        score += 10;
      }

      if (age > 30) {
        score += 15;
        reasons.push("Lleva mas de 30 dias pendiente.");
      }

      if (idea.status === "repeatable") {
        score += 10;
        reasons.push("Es repetible y ya puede volver a sugerirse.");
      }

      if (resolvedContext.moment === "weekend" && idea.idealConditions.includes("weekend")) {
        score += 14;
        reasons.push("Encaja con planes de fin de semana.");
      }

      if (idea.idealConditions.includes("good_weather") || idea.idealConditions.includes("outdoor")) {
        score += 8;
        reasons.push("Puede ser buen plan cuando el clima acompane.");
      }

      if (idea.category === "events") {
        score += 8;
        reasons.push("Es un evento, conviene tenerlo presente.");
      }

      if (reasons.length === 0) {
        reasons.push("Esta en tu lista de ideas pendientes.");
      }

      return { idea, score, reasons };
    })
    .filter((item): item is ScoredIdea => item !== null)
    .sort((a, b) => b.score - a.score || new Date(b.idea.createdAt).getTime() - new Date(a.idea.createdAt).getTime())
    .slice(0, 5);
}
