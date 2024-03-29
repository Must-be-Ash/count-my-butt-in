import {
  Prisma,
  PrismaClient,
  Network,
  NetworkStatus,
  Nft,
} from "@prisma/client";
import { z } from "zod";
import { ethers } from "ethers";
import { filter } from "lodash";

/**
 * Zod schema
 */
export const OrderCreateInput = z.object({
  campaignId: z.string(),
  collectionNetwork: z.nativeEnum(Network),
  collectionAddress: z.string().refine(ethers.isAddress),
  selectedTokenId: z.string(),
  personalNote: z.string().optional(),
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
      create({ args, query }: { args: any; query: any }) {
        args.data = OrderCreateInput.parse(args.data);
        return query(args);
      },
      update({ args, query }: { args: any; query: any }) {
        args.data = OrderCreateInput.partial().parse(args.data);
        return query(args);
      },
    },
  },
});

export function getOrders(campaignId: string, status?: NetworkStatus) {
  return prisma.order.findMany({
    where: {
      campaignId,
      status,
    },
  });
}

export function getOrdersByPrivyUser(
  privyUserId: string,
  status?: NetworkStatus
) {
  return prisma.order.findMany({
    where: {
      privyUserId,
      status,
    },
  });
}

export function getOrdersByUser(userId: string, status?: NetworkStatus) {
  return prisma.order.findMany({
    where: {
      userId,
      status,
    },
  });
}

export function getOrderByToken(tokenId: string, contractAddress: string) {
  return prisma.order.findMany({
    where: {
      mintedTokenId: tokenId,
      mintedContractAddress: contractAddress.toLowerCase(),
      status: NetworkStatus.CONFIRMED,
    },
  });
}

export function getOrderBySubmittedToken(
  tokenId: string,
  collectionAddress: string
) {
  return prisma.order.findFirst({
    where: {
      AND: [
        {
          selectedTokenId: tokenId,
          collectionAddress: collectionAddress.toLowerCase(),
        },
      ],
      NOT: {
        toUpload: null,
      },
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
  return prisma.order.updateMany({
    where: { orderId },
    data,
  });
}

export function deleteOrder(orderId: string) {
  return prisma.order.delete({
    where: { orderId },
  });
}

export function createCampaign(data: Prisma.CampaignCreateInput) {
  return prisma.campaign.create({
    data,
  });
}

export function getCampaign(campaignId: string) {
  return prisma.campaign.findUnique({
    where: {
      campaignId,
    },
  });
}

/**
 *
 * @param userId
 * @returns array of all campaigns, including the
 * associated orders
 */
export async function getCampaignsForUser(userId: string) {
  const campaigns = await prisma.campaign.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const orders = await prisma.order.findMany({
    where: {
      campaignId: {
        in: campaigns.map((c: any) => c.campaignId),
      },
    },
  });
  const parsed = campaigns.map((c: any) => {
    return {
      ...c,
      orders: filter(orders, (o: any) => o.campaignId === c.campaignId),
    };
  });
  return [...parsed];
}

export function updateCampaign(
  campaignId: string,
  data: Prisma.CampaignUpdateInput
) {
  return prisma.campaign.update({
    where: { campaignId },
    data,
  });
}

export function getNft(
  network: Network,
  contractAddress: string,
  tokenId: string
): Promise<Nft | null> {
  return prisma.nft.findFirst({
    where: {
      networkId: network,
      contractAddress: contractAddress.toLowerCase(),
      tokenId,
    },
  });
}

export function createNft(data: Prisma.NftCreateInput) {
  return prisma.nft.upsert({
    where: {
      networkId_contractAddress_tokenId: {
        networkId: data.networkId!,
        contractAddress: data.contractAddress.toLowerCase(),
        tokenId: data.tokenId,
      },
    },
    update: {
      tokenUri: data.tokenUri,
    },
    create: data,
  });
}

export function getCampaignWhiteList(campaignId: string) {
  return prisma.campaignWhiteList.findMany({
    where: {
      campaignId,
    },
  });
}

export function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({
    data,
  });
}

export function createOrUpdateUser(data: Prisma.UserCreateInput) {
  return prisma.user.upsert({
    where: {
      privyId: data.privyId,
    },
    update: data,
    create: data,
  });
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (user && user.id) {
    const campaign = await getLastCampaign(user.id);
    return { ...user, campaign };
  }
  return user;
}

export async function getLastCampaign(userId: string) {
  const campaign = await prisma.campaign.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  if (campaign.length > 0) return campaign[0];
  return {};
}

export async function getUserByPrivyId(privyId: string) {
  const user = await prisma.user.findUnique({
    where: {
      privyId,
    },
  });
  if (user && user.id) {
    const campaign = await getLastCampaign(user.id);
    return { ...user, campaign };
  }
  return user;
}

export function getUserByDomain(domain: string) {
  return prisma.user.findUnique({
    where: {
      domain,
    },
  });
}

export function updateUser(id: string, data: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: { id },
    data,
  });
}
