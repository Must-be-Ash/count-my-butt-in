"use client";
import { AuthenticatedPage } from "@/app/components/page/AuthenticatedPage";
import Main from "@/app/layouts/Main";
import { useAuthentication } from "@/hooks/useAuthentication";
import APIHelpers from "@/lib/apiHelper";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CopyButton } from "@/components/CopyButton";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";
import { BINDER_DROP_TOKEN, DEFAULT_NETWORK, dayNames, monthNames } from "@/utils/common";
import { PlusSquare } from "lucide-react";
import BinderButton from "@/app/components/BinderButton";
import Loader from "@/app/components/Loader";
import { networkToName } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { filter } from "lodash";

const CreateNewCampaignButton = () => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const { authenticatedUser } = useAuthentication();
  const [campaignId, setCampaignId] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    if(campaignId) {
      router.push(`/dashboard/${campaignId}/orders`);
    }
    setIsLoading(false);
  }, [campaignId])

  const createCampaign = async () => {
    setIsLoading(true);
    const result = await APIHelpers.post("/api/campaigns", {
      body: {
        binderContract: BINDER_DROP_TOKEN,
        networkId: networkToName(DEFAULT_NETWORK).toUpperCase(),
        userId: authenticatedUser?.id
      },
    });
    const campaignId = result.campaign.campaignId;
    setCampaignId(campaignId);
    setIsLoading(false);
  }
  return (
    <BinderButton className="flex flex-row gap-2" onClick={() => createCampaign()}>
      {
      loading ?
        <Loader color="#000" />
        :
        <>
          <PlusSquare className="w-5 h-5" />
          <span>
            Create New Campaign
          </span>
        </>
      }
    </BinderButton>
  )
}

/**
 *
 * display all campaigns of a user
 *
 */
export default function Campaigns() {
  const { authenticated, authenticatedUser } = useAuthentication();
  const [campaigns, setCampaigns] = useState<Array<any>>([]);
  const [hostname, setHostname] = useState<string>("https://app.signed.gg");
  useEffect(() => {
    try {
      if (window) {
        setHostname(window.location.origin);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    const getCampaigns = async () => {
      if (authenticated && authenticatedUser && authenticatedUser.id) {
        const res = await APIHelpers.get(`/api/campaigns/user/${authenticatedUser.id}`);
        setCampaigns(res.campaigns)
      }
    }
    getCampaigns();
  }, [authenticated, authenticatedUser]);

  console.log(campaigns);
  return (
    <AuthenticatedPage homeRoute={`/`}>
      <Main>
        <div className="flex w-full h-full flex-col gap-2 overflow-auto">
          <div className="flex flex-row w-full justify-between items-center">
            <div className="uppercase font-semibold">
              All Campaigns
            </div>
            <div>
              <CreateNewCampaignButton />
            </div>
          </div>

          <Table>
            <TableCaption>List of all your Campaigns</TableCaption>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="w-[100px]">ID</TableHead> */}
                <TableHead className="w-[200px]">Created on</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Collector URL</TableHead>
                <TableHead>Signed (of total requests)</TableHead>
                <TableHead className="text-right">Sign Page</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {
                campaigns &&
                campaigns.map((c, k) => {
                  const collectorLink = `${hostname}/collector/${c.campaignId}/home`;
                  const signingPage = `${hostname}/dashboard/${c.campaignId}/orders`
                  const createdAt = new Date(c.createdAt);
                  const formattedDate = `${dayNames[createdAt.getDay()]}, ${createdAt.getDate()} ${monthNames[createdAt.getMonth()]} ${createdAt.getFullYear()}`
                  const pending = filter(c.orders, {status: "PENDING"}).length
                  const confirmed = filter(c.orders, {status: "CONFIRMED"}).length
                  return (
                    <TableRow key={k}>
                      {/* <TableCell className="font-medium">{formatLongString(c.campaignId)}</TableCell> */}
                      <TableCell className="font-medium">{formattedDate}</TableCell>
                      <TableCell>{c.networkId}</TableCell>
                      <TableCell><span className="flex flex-row gap-2"><CopyButton text={collectorLink} /><ExternalLinkButton href={collectorLink}/></span></TableCell>
                      <TableCell>{`${confirmed}/${pending + confirmed}`}</TableCell>
                      <TableCell className="text-right"><span className="flex flex-row gap-2 justify-end"><CopyButton text={signingPage} /><ExternalLinkButton href={signingPage}/></span></TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>

        </div>
      </Main>
    </AuthenticatedPage>
  )
}
