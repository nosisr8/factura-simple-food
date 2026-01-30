import { cn } from "@/lib/utils";

export function PageDescription(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-1 text-sm text-muted-foreground", props.className)}>
      {props.children}
    </p>
  );
}

