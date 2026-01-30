"use server";

import { redirect } from "next/navigation";

import { clearAdminSession } from "@/modules/admin/session";

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

