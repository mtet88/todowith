import { AppShell } from "@/components/AppShell";

export default function AccountPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-amber-700">Cuenta</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Modo invitado</h1>
        <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm leading-6 text-stone-600">
            Por ahora tus ideas se guardan en este navegador con localStorage. El login con Google/email y la migracion a Supabase vendran despues de validar el flujo local.
          </p>
          <div className="mt-6 grid gap-3">
            <button className="rounded-full bg-stone-950 px-5 py-3 font-bold text-white" type="button" disabled>
              Continuar con Google proximamente
            </button>
            <button className="rounded-full bg-stone-100 px-5 py-3 font-bold text-stone-500" type="button" disabled>
              Entrar con email proximamente
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
