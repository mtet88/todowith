import type { Idea } from "./types";

export type ScoredIdea = {
  idea: Idea;
  score: number;
  reasons: string[];
};

function daysBetween(fromIso: string, to = new Date()) {
  const from = new Date(fromIso).getTime();
  return Math.floor((to.getTime() - from) / 86_400_000);
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

export function getSuggestions(ideas: Idea[]): ScoredIdea[] {
  return ideas
    .filter(canSuggest)
    .map((idea) => {
      const reasons: string[] = [];
      let score = 10;
      const age = daysBetween(idea.createdAt);

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
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
