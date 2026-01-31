"use client";

import { SignIn } from "@clerk/nextjs";

export function AdminSignIn(props: { next: string }) {
  return (
    <SignIn
      routing="path"
      path="/admin/login"
      afterSignInUrl={props.next}
      afterSignUpUrl="/admin"
    />
  );
}

