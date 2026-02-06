"use client";

import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { ChevronDownIcon, ChevronUpIcon, Trash2Icon } from "lucide-react";

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

function move<T>(arr: T[], from: number, to: number) {
  if (from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function ImagesUpload(props: {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  folder?: string;
  max?: number;
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

  const canUploadMore = props.max ? props.value.length < props.max : true;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{props.label ?? "Imágenes"}</p>

        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            cloudName,
            multiple: true,
            folder: props.folder,
            sources: ["local", "url", "camera"],
            maxFiles: props.max,
          }}
          // onUpload está deprecado en v6, usar onSuccess.
          onSuccess={(results) => {
            const url = getSecureUrl(results as WidgetResults);
            if (!url) return;
            // Evita duplicados si Cloudinary dispara múltiples eventos.
            if (props.value.includes(url)) return;
            props.onChange([...props.value, url]);
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canUploadMore}
              onClick={() => open()}
            >
              Subir
            </Button>
          )}
        </CldUploadWidget>
      </div>

      {props.value.length ? (
        <div className="space-y-2">
          {props.value.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="flex items-center gap-3 rounded-md border bg-background p-2"
            >
              <div className="relative h-14 w-20 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={url}
                  alt={`${props.label ?? "Imagen"} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground">{url}</p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  disabled={idx === 0}
                  onClick={() => props.onChange(move(props.value, idx, idx - 1))}
                  aria-label="Mover arriba"
                >
                  <ChevronUpIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  disabled={idx === props.value.length - 1}
                  onClick={() => props.onChange(move(props.value, idx, idx + 1))}
                  aria-label="Mover abajo"
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive hover:text-destructive"
                  onClick={() => props.onChange(props.value.filter((_, i) => i !== idx))}
                  aria-label="Eliminar"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border bg-muted p-6 text-center text-sm text-muted-foreground">
          Sin imágenes
        </div>
      )}
    </div>
  );
}

