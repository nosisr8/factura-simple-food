import { PageDescription } from "@/components/atoms/page-description";
import { PageTitle } from "@/components/atoms/page-title";
import { cn } from "@/lib/utils";

export function PageHeader(props: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", props.className)}>
      <div>
        <PageTitle>{props.title}</PageTitle>
        {props.description ? <PageDescription>{props.description}</PageDescription> : null}
      </div>
      {props.actions ? <div className="shrink-0">{props.actions}</div> : null}
    </div>
  );
}

