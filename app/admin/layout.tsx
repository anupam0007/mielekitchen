"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "⊞" },
  { label: "Site Text", href: "/admin/site-text", icon: "✎" },
  { label: "Menu", href: "/admin/menu", icon: "☰" },
  { label: "Customizable Cakes", href: "/admin/customizable", icon: "◈" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-[#e8d5c0] bg-white">
        <div className="flex items-center gap-3 border-b border-[#e8d5c0] px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#faf8f5] p-0.5">
            <Image src="/logo.png" alt="Miele" width={32} height={32} className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="font-serif text-sm font-semibold text-[#2d1b0e]">Miele Kitchen</p>
            <p className="text-xs text-[#9a7c5c]">Admin panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-[#fdf3e8] font-medium text-[#c8873a]"
                    : "text-[#5c4030] hover:bg-[#faf8f5] hover:text-[#2d1b0e]"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#e8d5c0] px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#9a7c5c] transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="text-base leading-none">⏻</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
