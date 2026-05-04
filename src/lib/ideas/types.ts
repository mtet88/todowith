export type IdeaCategory = "food" | "places" | "events" | "plans" | "other";

export type IdeaStatus = "pending" | "done" | "repeatable" | "discarded";

export type DateType = "none" | "single" | "range" | "flexible";

export type DiscardedReason = "manual" | "expired" | null;

export type IdealCondition =
  | "good_weather"
  | "indoor"
  | "outdoor"
  | "day"
  | "night"
  | "weekend"
  | "cheap"
  | "reservation_needed";

export type Idea = {
  id: string;
  rawText: string;
  title: string;
  link?: string;
  category: IdeaCategory;
  status: IdeaStatus;
  discardedReason?: DiscardedReason;
  dateType: DateType;
  dateStart?: string;
  dateEnd?: string;
  flexibleNote?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  idealConditions: IdealCondition[];
  notes?: string;
  createdByUserId?: string;
  ownerUserId?: string;
  groupId?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  lastSuggestedAt?: string;
  lastRepeatedAt?: string;
};

export type IdeaInput = {
  rawText: string;
  link?: string;
};

export const categoryLabels: Record<IdeaCategory, string> = {
  food: "Comida",
  places: "Sitios",
  events: "Eventos",
  plans: "Planes",
  other: "Otro",
};

export const statusLabels: Record<IdeaStatus, string> = {
  pending: "Pendiente",
  done: "Hecha",
  repeatable: "Repetible",
  discarded: "Descartada",
};

export const conditionLabels: Record<IdealCondition, string> = {
  good_weather: "Buen clima",
  indoor: "Indoor",
  outdoor: "Outdoor",
  day: "Dia",
  night: "Noche",
  weekend: "Fin de semana",
  cheap: "Barato",
  reservation_needed: "Reserva necesaria",
};
