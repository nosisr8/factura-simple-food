import { db } from "@/lib/prisma";

import { CustomerDocumentType, isValidDocument, normalizeDocument } from "../menu/helpers/document";
import CpfForm from "./components/cpf-form";
import OrderList from "./components/order-list";

interface OrdersPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ document?: string; documentType?: CustomerDocumentType }>;
}

const OrdersPage = async ({ params, searchParams }: OrdersPageProps) => {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({ where: { slug } });
  if (restaurant?.catalogOnly) {
    // Si solo es catálogo, no hay pedidos que gestionar.
    return <CpfForm />;
  }
  const { document, documentType } = await searchParams;
  if (!document || !documentType) {
    return <CpfForm />;
  }
  if (!isValidDocument(documentType, document)) {
    return <CpfForm />;
  }
  const normalizedDocument = normalizeDocument(document);
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      customerDocument: normalizedDocument,
      documentType,
    },
    include: {
      restaurant: {
        select: {
          name: true,
          avatarImageUrl: true,
        },
      },
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  });
  return <OrderList orders={orders} />;
};

export default OrdersPage;