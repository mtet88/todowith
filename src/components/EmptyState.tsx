import Link from "next/link";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/60 p-8 text-center">
      <h2 className="text-xl font-black tracking-tight">{title}</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-500">{body}</p>
      <Link className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-stone-950" href="/save">
        Guardar primera idea
      </Link>
    </div>
  );
}
