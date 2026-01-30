import { LoginForm } from "./login-form";

export default async function AdminLoginPage(props: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const searchParams = await props.searchParams;
  const next = searchParams?.next ?? "/admin";

  return (
    <main className="flex min-h-[calc(100vh-1px)] items-center justify-center px-4">
      <LoginForm next={next} />
    </main>
  );
}

