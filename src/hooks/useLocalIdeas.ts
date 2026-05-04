"use client";

import { useEffect, useState } from "react";
import { getLocalIdeas } from "@/lib/ideas/storage";
import type { Idea } from "@/lib/ideas/types";

export function useLocalIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function refresh() {
      setIdeas(getLocalIdeas());
      setLoaded(true);
    }

    refresh();
    window.addEventListener("ideas:changed", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("ideas:changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { ideas, loaded };
}
