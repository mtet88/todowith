import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { FloatingSaveButton } from "./FloatingSaveButton";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#eef8ff] text-slate-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-slate-200/70 bg-white/75 p-6 shadow-xl shadow-sky-900/5 backdrop-blur md:flex">
          <Link className="text-xl font-black tracking-tight" href="/">
            Que Hacemos
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-500">Ideas guardadas para cuando toque decidir.</p>
          <nav className="mt-10 grid gap-2">
            <Link className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-white hover:text-slate-950" href="/">
              Que hacemos?
            </Link>
            <Link className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-white hover:text-slate-950" href="/ideas">
              Ideas
            </Link>
            <Link className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-white hover:text-slate-950" href="/account">
              Cuenta
            </Link>
          </nav>
          <Link className="mt-auto rounded-full bg-emerald-600 px-5 py-3 text-center font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-500" href="/save">
            + Guardar idea
          </Link>
        </aside>
        <main className="w-full px-6 pb-32 pt-10 md:px-10 md:pb-12 md:pt-10">{children}</main>
      </div>
      <FloatingSaveButton />
      <BottomNav />
    </div>
  );
}
