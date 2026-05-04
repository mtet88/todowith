"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { addLocalIdea } from "@/lib/ideas/storage";

export default function SaveIdeaPage() {
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = rawText.trim();

    if (!text) {
      setError("Escribe una idea para guardarla.");
      return;
    }

    const idea = addLocalIdea({ rawText: text, link });
    router.push(`/ideas/${idea.id}`);
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-2xl">
        <Link className="text-sm font-bold text-stone-500" href="/">
          <span aria-hidden="true">&lt;</span> Volver
        </Link>
        <div className="mt-5 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold text-amber-600">Guardar idea</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Tira cualquier plan aqui.</h1>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            Puede ser un restaurante, evento, sitio o algo como jugar Nintendo Switch en casa.
          </p>

          <form className="mt-7 grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm font-bold">Que idea quieres guardar?</span>
              <textarea
                className="min-h-36 rounded-3xl border border-stone-200 bg-stone-50 p-4 text-base outline-none ring-amber-300 transition focus:ring-4"
                onChange={(event) => setRawText(event.target.value)}
                placeholder="Picnic en el parque cuando haga buen clima"
                value={rawText}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold">Link opcional</span>
              <input
                className="rounded-full border border-stone-200 bg-stone-50 px-4 py-3 outline-none ring-amber-300 transition focus:ring-4"
                onChange={(event) => setLink(event.target.value)}
                placeholder="https://..."
                type="url"
                value={link}
              />
            </label>
            {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
            <button className="rounded-full bg-stone-950 px-5 py-4 font-black text-white" type="submit">
              Guardar idea
            </button>
          </form>
        </div>
      </section>
    </AppShell>
  );
}
