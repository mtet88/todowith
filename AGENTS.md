# Repository Notes

## Product Direction
- Product docs are source-of-truth context and live in `docs/product/`: `PRODUCT_PLAN.md`, `MVP_SPEC.md`, `TECHNICAL_PLAN.md`, and `WIREFRAMES.md`.
- Core product rule: "Guardar primero, enriquecer despues"; creating an idea should only require free text plus optional link.
- The home screen is `Que hacemos?`, not the ideas library.
- V1 is local-first and personal, but data/model language should stay ready for future groups via nullable `groupId`.

## Next.js
- This repo uses Next.js `16.2.4` and React `19.2.4`; do not rely on older Next.js assumptions.
- Before changing Next APIs, read the relevant local docs in `node_modules/next/dist/docs/`.
- App Router files live under `src/app`, not root `app`.

## Commands
- Use npm; `package-lock.json` is the lockfile.
- Dev server: `npm run dev`.
- Production verification: `npm run build`.
- Lint: `npm run lint`; focused lint works as `npm run lint -- src/path/file.tsx`.
- There is no test script or standalone typecheck script currently.

## App Structure
- Main routes are `src/app/page.tsx`, `src/app/save/page.tsx`, `src/app/ideas/page.tsx`, `src/app/ideas/[id]/page.tsx`, and `src/app/account/page.tsx`.
- Shared shell/navigation lives in `src/components/AppShell.tsx`; idea domain logic lives in `src/lib/ideas/*`.
- Use the `@/*` TypeScript path alias for imports from `src/*`.

## Data And Behavior
- Guest ideas are stored in `localStorage` under `ideas:v1`; use `src/hooks/useLocalIdeas.ts` and `src/lib/ideas/storage.ts`.
- Storage code assumes browser APIs; keep localStorage access in client code or guarded helpers.
- Ideas marked `done` or `discarded` must not be suggested; `repeatable` ideas can be suggested only after 15 days.
- Suggestions should be deterministic and explainable, returning up to 5 ideas with a clear reason.
- Do not make AI, auth, backend, GPS, or map features mandatory for the core local flow.

## Planned Integrations
- Open-Meteo is the planned weather API; ask for browser location only when weather/proximity is needed and keep the app usable if denied.
- Leaflet is the planned map/pin library; load maps client-only to avoid SSR issues.
- Supabase Auth/Postgres comes after the local core works; never delete local ideas before confirmed remote migration.
- Public share links are planned for `/share/[token]`; current local sharing may be WhatsApp/text only.

## Styling And Copy
- Tailwind CSS v4 is wired through `src/app/globals.css` with `@import "tailwindcss"` and `postcss.config.mjs`; there is no Tailwind config file.
- Build mobile-first: bottom tabs on mobile, sidebar/top navigation acceptable on desktop, global `+` save action should stay easy to access.
- Hide mobile bottom nav and global `+` on focused flows such as `Guardar idea` and idea detail.
- UI copy is Spanish and current source files use ASCII-only spellings such as `Que Hacemos`, `Manana`, and `Todavia`.
- Do not edit generated files such as `.next/**` or `next-env.d.ts`.
