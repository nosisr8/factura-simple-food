import { db } from "@/lib/prisma";

import { CustomerDocumentType, isValidDocument, normalizeDocument } from "../menu/helpers/document";
import CpfForm from "./components/cpf-form";
import OrderList from "./components/order-list";

interface OrdersPageProps {
  searchParams: Promise<{ document?: string; documentType?: CustomerDocumentType }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
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