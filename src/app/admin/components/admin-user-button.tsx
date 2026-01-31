"use client";

import { UserButton } from "@clerk/nextjs";

export function AdminUserButton() {
  return (
    <UserButton
      afterSignOutUrl="/admin/login"
      appearance={{
        elements: {
          avatarBox: "h-8 w-8",
        },
      }}
    />
  );
}

