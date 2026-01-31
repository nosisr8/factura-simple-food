import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminSignIn } from "../sign-in";

export const metadata: Metadata = {
  title: "Admin - Ingresar",
};

function safeAdminNext(next: string) {
  return next.startsWith("/admin") ? next : "/admin";
}

export default async function AdminLoginPage(props: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const { userId } = await auth();
  if (userId) redirect("/admin");

  const searchParams = await props.searchParams;
  const next = safeAdminNext(searchParams?.next ?? "/admin");

  return (
    <main className="flex min-h-[calc(100vh-1px)] items-center justify-center px-4">
      <AdminSignIn next={next} />
    </main>
  );
}

