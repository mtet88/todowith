import { classifyIdea } from "./classify";
import type { Idea, IdeaInput } from "./types";

const STORAGE_KEY = "ideas:v1";

function now() {
  return new Date().toISOString();
}

function createId() {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // Some mobile browsers restrict crypto APIs on non-secure local-network origins.
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getLocalIdeas(): Idea[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Idea[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalIdeas(ideas: Idea[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));

  try {
    window.dispatchEvent(new Event("ideas:changed"));
  } catch {
    window.dispatchEvent(new CustomEvent("ideas:changed"));
  }
}

export function createLocalIdea(input: IdeaInput): Idea {
  const createdAt = now();
  const classification = classifyIdea(input.rawText);

  return {
    id: createId(),
    rawText: input.rawText.trim(),
    title: classification.title,
    link: input.link?.trim() || undefined,
    category: classification.category,
    status: "pending",
    discardedReason: null,
    dateType: "none",
    idealConditions: classification.idealConditions,
    createdAt,
    updatedAt: createdAt,
    groupId: null,
  };
}

export function addLocalIdea(input: IdeaInput) {
  const idea = createLocalIdea(input);
  saveLocalIdeas([idea, ...getLocalIdeas()]);
  return idea;
}

export function updateLocalIdea(id: string, patch: Partial<Idea>) {
  const ideas = getLocalIdeas();
  const updated = ideas.map((idea) =>
    idea.id === id
      ? {
          ...idea,
          ...patch,
          updatedAt: now(),
        }
      : idea,
  );
  saveLocalIdeas(updated);
}

export function deleteLocalIdea(id: string) {
  saveLocalIdeas(getLocalIdeas().filter((idea) => idea.id !== id));
}

export function findLocalIdea(id: string) {
  return getLocalIdeas().find((idea) => idea.id === id);
}
