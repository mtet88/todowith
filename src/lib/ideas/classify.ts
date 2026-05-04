import type { IdeaCategory, IdealCondition } from "./types";

type ClassificationResult = {
  title: string;
  category: IdeaCategory;
  idealConditions: IdealCondition[];
};

const categoryKeywords: Array<{ category: IdeaCategory; words: string[] }> = [
  {
    category: "food",
    words: [
      "restaurante",
      "cena",
      "brunch",
      "cafe",
      "cafeteria",
      "postre",
      "helado",
      "comida",
      "almuerzo",
    ],
  },
  {
    category: "places",
    words: ["museo", "bar", "discoteca", "rooftop", "parque", "mirador", "mercado", "tienda", "playa"],
  },
  {
    category: "events",
    words: ["evento", "concierto", "exhibicion", "exposicion", "festival", "teatro", "obra", "feria", "pop-up"],
  },
  {
    category: "plans",
    words: ["picnic", "jugar", "nintendo", "switch", "cocinar", "caminata", "caminar", "roadtrip", "noche de juegos", "pelicula", "cine en casa"],
  },
];

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function classifyIdea(rawText: string): ClassificationResult {
  const normalized = rawText.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const match = categoryKeywords.find((entry) => includesAny(normalized, entry.words));
  const idealConditions = new Set<IdealCondition>();

  if (includesAny(normalized, ["buen clima", "sol", "soleado", "haga bueno"])) {
    idealConditions.add("good_weather");
  }

  if (includesAny(normalized, ["lluvia", "llueva", "adentro", "indoor", "casa"])) {
    idealConditions.add("indoor");
  }

  if (includesAny(normalized, ["afuera", "aire libre", "parque", "picnic", "playa", "outdoor"])) {
    idealConditions.add("outdoor");
  }

  if (includesAny(normalized, ["noche", "discoteca", "bar"])) {
    idealConditions.add("night");
  }

  if (includesAny(normalized, ["dia", "tarde", "brunch", "cafe"])) {
    idealConditions.add("day");
  }

  if (includesAny(normalized, ["fin de semana", "sabado", "domingo" ])) {
    idealConditions.add("weekend");
  }

  if (includesAny(normalized, ["barato", "gratis", "economico"])) {
    idealConditions.add("cheap");
  }

  if (includesAny(normalized, ["reserva", "reservar"])) {
    idealConditions.add("reservation_needed");
  }

  return {
    title: rawText.trim().slice(0, 80),
    category: match?.category ?? "other",
    idealConditions: Array.from(idealConditions),
  };
}
