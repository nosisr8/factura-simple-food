"use client";

import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";

type WidgetResults = {
  event?: string;
  info?: unknown;
};

function getSecureUrl(results: WidgetResults): string | null {
  const info = results?.info;
  if (!info || typeof info !== "object") return null;
  const maybe = info as { secure_url?: unknown };
  return typeof maybe.secure_url === "string" ? maybe.secure_url : null;
}

export function ImageUpload(props: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

  if (!cloudName || !uploadPreset) {
    return (
      <div className="rounded-md border p-3 text-sm text-destructive">
        Falta configurar Cloudinary: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` y/o
        `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{props.label ?? "Imagen"}</p>

        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            cloudName,
            multiple: false,
            folder: props.folder,
            sources: ["local", "url", "camera"],
          }}
          // onUpload está deprecado en v6, usar onSuccess.
          onSuccess={(results) => {
            const url = getSecureUrl(results as WidgetResults);
            if (url) props.onChange(url);
          }}
        >
          {({ open }) => (
            <Button type="button" variant="outline" size="sm" onClick={() => open()}>
              Subir
            </Button>
          )}
        </CldUploadWidget>
      </div>

      {props.value ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border bg-muted">
          <Image
            src={props.value}
            alt={props.label ?? "Imagen"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      ) : (
        <div className="rounded-md border bg-muted p-6 text-center text-sm text-muted-foreground">
          Sin imagen
        </div>
      )}
    </div>
  );
}

