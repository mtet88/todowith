"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingSaveButton() {
  const pathname = usePathname();

  if (pathname === "/save") {
    return null;
  }

  return (
    <Link
      aria-label="Guardar idea"
      className="fixed bottom-32 right-7 z-50 flex size-[4.25rem] items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-900/35 transition hover:bg-emerald-500 md:hidden"
      href="/save"
    >
      <span className="-translate-y-0.5 text-5xl font-light leading-none">+</span>
    </Link>
  );
}
