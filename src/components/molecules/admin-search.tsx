import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AdminSearch(props: {
  action: string;
  q: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", props.className)}>
      <form action={props.action} method="get" className="flex items-center gap-2">
        <Input
          name="q"
          placeholder={props.placeholder ?? "Buscar..."}
          defaultValue={props.q}
          className="h-9 w-[220px]"
        />
        <Button type="submit" variant="outline" size="sm">
          Buscar
        </Button>
      </form>

      {props.q ? (
        <Button asChild variant="ghost" size="sm">
          <Link href={props.action}>Limpiar</Link>
        </Button>
      ) : null}
    </div>
  );
}

