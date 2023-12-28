import { Prisma, PrismaClient, Network } from "@prisma/client";
import { z } from "zod";
import { ethers } from "ethers";

/**
 * Zod schema
 */
export const OrderCreateInput = z.object({
  campaignId: z.string(),
  collectionNetwork: z.nativeEnum(Network),
  collectionAddress: z.string().refine(ethers.isAddress),
  selectedTokenId: z.string(),
  personalNote: z.string().optional(),
  description: z.string(),
  mintedTokenId: z.string().optional(),
  mintedNetworkId: z.nativeEnum(Network).optional(),
  autographData: z.string().optional(),
  autographDataURL: z.string().optional(),
  metadataUrl: z.string().optional(),
}) satisfies z.Schema<Prisma.OrderUncheckedCreateInput>;

/**
 * Prisma Client Extension
 */
const prisma = new PrismaClient().$extends({
  query: {
    order: {
      create({ args, query }) {
        args.data = OrderCreateInput.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = OrderCreateInput.partial().parse(args.data);
        return query(args);
      },
    },
  },
});

export function getOrders(campaignId: string) {
  return prisma.order.findMany({
    where: {
      campaignId,
    },
  });
}

export function getOrder(orderId: string) {
  return prisma.order.findUnique({
    where: {
      orderId,
    },
  });
}

export function createOrder(data: Prisma.OrderCreateInput) {
  return prisma.order.create({
    data,
  });
}

export function updateOrder(orderId: string, data: Prisma.OrderUpdateInput) {
  return prisma.order.update({
    where: { orderId },
    data,
  });
}

export function deleteOrder(orderId: string) {
  return prisma.order.delete({
    where: { orderId },
  });
}