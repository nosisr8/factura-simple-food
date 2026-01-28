"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCheckoutFormStore } from "@/stores/checkout-form";

import {
  CustomerDocumentType,
  isValidDocument,
  normalizeDocument,
} from "../../menu/helpers/document";

const formSchema = z.object({
  documentType: z.enum(["CI", "RUC"]),
  document: z
    .string()
    .trim()
    .min(1, {
      message: "El documento es obligatorio.",
    })
    .refine((value) => normalizeDocument(value).length > 0, {
      message: "El documento es obligatorio.",
    }),
});

const validatedFormSchema = formSchema.superRefine((data, ctx) => {
  if (!isValidDocument(data.documentType, data.document)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["document"],
      message: data.documentType === "CI" ? "CI inválida." : "RUC inválido.",
    });
  }
});

type FormSchema = z.infer<typeof formSchema>;

const CpfForm = () => {
  const {
    documentType: persistedDocumentType,
    document: persistedDocument,
    setDocumentType,
    setDocument,
  } = useCheckoutFormStore();

  const form = useForm<FormSchema>({
    resolver: zodResolver(validatedFormSchema),
    defaultValues: {
      documentType: (persistedDocumentType ?? "CI") as "CI" | "RUC",
      document: persistedDocument ?? "",
    },
  });
  const router = useRouter();
  const pathname = usePathname();
  const onSubmit = (data: FormSchema) => {
    const documentType = data.documentType as CustomerDocumentType;
    const document = normalizeDocument(data.document);
    router.replace(`${pathname}?documentType=${documentType}&document=${document}`);
  };
  const handleCancel = () => {
    router.back();
  };
  return (
    <Drawer open>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Ver pedidos</DrawerTitle>
          <DrawerDescription>
            Elegí CI o RUC e ingresá tu documento para ver tus pedidos.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem className="px-4">
                  <FormLabel>Tipo de documento</FormLabel>
                  <FormControl>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setDocumentType(e.target.value as "CI" | "RUC");
                      }}
                    >
                      <option value="CI">CI</option>
                      <option value="RUC">RUC</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem className="px-4">
                  <FormLabel>
                    {form.watch("documentType") === "CI" ? "Tu CI" : "Tu RUC"}
                  </FormLabel>
                  <FormControl>
                    <PatternFormat
                      placeholder={
                        form.watch("documentType") === "CI"
                          ? "Escribí tu CI..."
                          : "Escribí tu RUC..."
                      }
                      format={
                        form.watch("documentType") === "CI"
                          ? "##########"
                          : "##########-#"
                      }
                      customInput={Input}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setDocument((e.target as HTMLInputElement).value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrawerFooter>
              <Button variant="destructive" className="w-full rounded-full">
                Confirmar
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default CpfForm;