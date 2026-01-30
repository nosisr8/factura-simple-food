import { cn } from "@/lib/utils";

export function PageTitle(props: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={cn("text-2xl font-semibold leading-tight", props.className)}>
      {props.children}
    </h1>
  );
}

