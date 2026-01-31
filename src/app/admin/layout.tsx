import Link from "next/link";

import { AdminUserButton } from "@/app/admin/components/admin-user-button";

export default async function AdminLayout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm font-semibold">
              Admin
            </Link>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/admin/restaurants" className="hover:text-foreground">
                Restaurantes
              </Link>
            </nav>
          </div>

          <AdminUserButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{props.children}</main>
    </div>
  );
}

