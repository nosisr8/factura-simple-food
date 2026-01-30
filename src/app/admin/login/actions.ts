"use server";

import { redirect } from "next/navigation";

import { validateAdminCredentials } from "@/modules/admin/auth";
import { setAdminSession } from "@/modules/admin/session";

export type LoginAdminState = { error?: string } | null;

export async function loginAdmin(
  _prevState: LoginAdminState,
  formData: FormData
): Promise<LoginAdminState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const ok = validateAdminCredentials({ username, password });
  if (!ok) return { error: "Usuario o contraseña inválidos." };

  await setAdminSession();

  // Solo permitir redirecciones internas a /admin
  if (next.startsWith("/admin")) redirect(next);
  redirect("/admin");
}

