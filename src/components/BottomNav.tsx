"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/",
    label: "Que hacemos",
    icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z",
  },
  {
    href: "/ideas",
    label: "Ideas",
    icon: "M9 18h6M10 22h4M8.5 15.5c0-2.5-2.5-3.5-2.5-6A6 6 0 0 1 18 9.5c0 2.5-2.5 3.5-2.5 6h-7Z",
  },
  {
    href: "/account",
    label: "Cuenta",
    icon: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
  },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/save" || pathname.startsWith("/ideas/")) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 px-4 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-full bg-white/95 px-4 py-3 shadow-2xl shadow-sky-900/10 ring-1 ring-slate-200/70 backdrop-blur">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
                active ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15" : "text-slate-500 hover:text-slate-950"
              }`}
              href={item.href}
              key={item.href}
            >
              <svg
                className={`size-5 ${active ? "text-emerald-400" : "text-slate-500"}`}
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d={item.icon} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
