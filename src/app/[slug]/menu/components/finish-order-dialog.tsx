"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumptionMethod } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
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
  DrawerTrigger,
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

import { createOrder } from "../actions/create-order";
import { createWhatsappMessage } from "../actions/create-whatsapp-message";
import { CartContext } from "../contexts/cart";
import {
  CustomerDocumentType,
  isValidDocument,
  normalizeDocument,
} from "../helpers/document";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "El nombre es obligatorio.",
  }),
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
  tableNumber: z.string().trim().optional(),
});

const validatedFormSchema = formSchema.superRefine((data, ctx) => {
  if (!isValidDocument(data.documentType, data.document)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["document"],
      message:
        data.documentType === "CI"
          ? "CI inválida."
          : "RUC inválido.",
    });
  }
});

type FormSchema = z.infer<typeof formSchema>;

interface FinishOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderDialogProps) => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useContext(CartContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    name: persistedName,
    documentType: persistedDocumentType,
    document: persistedDocument,
    setName,
    setDocumentType,
    setDocument,
  } = useCheckoutFormStore();

  const form = useForm<FormSchema>({
    resolver: zodResolver(validatedFormSchema),
    defaultValues: {
      name: persistedName ?? "",
      documentType: (persistedDocumentType ?? "CI") as "CI" | "RUC",
      document: persistedDocument ?? "",
      tableNumber: "",
    },
    shouldUnregister: true,
  });
  const onSubmit = async (data: FormSchema) => {
    try {
      setIsLoading(true);
      const consumptionMethod = searchParams.get(
        "consumptionMethod",
      ) as ConsumptionMethod;

      // Si es para comer acá, pedimos número de mesa
      const isDineIn = consumptionMethod === "DINE_IN";
      const parsedTableNumber = data.tableNumber
        ? Number.parseInt(data.tableNumber, 10)
        : NaN;
      if (isDineIn && (!Number.isFinite(parsedTableNumber) || parsedTableNumber <= 0)) {
        form.setError("tableNumber", {
          type: "manual",
          message: "El número de mesa es obligatorio.",
        });
        return;
      }

      const order: { id: number } = await createOrder({
        consumptionMethod,
        customerDocument: data.document,
        documentType: data.documentType as CustomerDocumentType,
        tableNumber: isDineIn ? parsedTableNumber : null,
        customerName: data.name,
        products,
        slug,
      });
      const { whatsappUrl } = await createWhatsappMessage({
        orderId: order.id,
        slug,
        consumptionMethod,
        documentType: data.documentType as CustomerDocumentType,
        document: data.document,
      });

      // Abre WhatsApp con el texto listo para enviar
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      // Lleva al usuario a su historial de pedidos
      const normalizedDoc = normalizeDocument(data.document);
      router.push(
        `/${slug}/orders?documentType=${data.documentType}&document=${normalizedDoc}`,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finalizar pedido</DrawerTitle>
          <DrawerDescription>
            Ingresá tus datos abajo para finalizar tu pedido.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tu nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escribí tu nombre..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setName(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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

              {searchParams.get("consumptionMethod") === "DINE_IN" && (
                <FormField
                  control={form.control}
                  name="tableNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de mesa</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="Ej: 12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DrawerFooter>
                <Button
                  type="submit"
                  variant="destructive"
                  className="rounded-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2Icon className="animate-spin" />}
                  Finalizar
                </Button>
                <DrawerClose asChild>
                  <Button className="w-full rounded-full" variant="outline">
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FinishOrderDialog;
