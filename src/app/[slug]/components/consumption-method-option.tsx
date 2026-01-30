import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ConsumptionMethodOptionProps {
  slug: string;
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  option: ConsumptionMethod;
}

type ConsumptionMethod = "DINE_IN" | "TAKEAWAY";

const ConsumptionMethodOption = ({
  slug,
  imageAlt,
  imageUrl,
  buttonText,
  option,
}: ConsumptionMethodOptionProps) => {
  return (
    <Card className="group overflow-hidden border bg-background/80 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex flex-col items-center gap-6 p-6">
        <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-muted">
          <Image src={imageUrl} fill alt={imageAlt} className="object-contain p-3" />
        </div>

        <Button className="w-full rounded-full" asChild>
          <Link href={`/${slug}/menu?consumptionMethod=${option}`}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConsumptionMethodOption;