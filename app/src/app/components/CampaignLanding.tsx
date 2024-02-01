import { Campaign, User } from "@prisma/client";
import Image from "next/image";
import BinderButton from "./BinderButton";
import Link from "next/link";

export default async function CampaignLanding({
    artist,
    campaign
  }:{
    campaign: Campaign
    artist: {nickname: string, twitterUsername: string}
  }
){
  return (
    <div className="grid grid-cols-2 h-screen w-screen">
      <div className="w-full p-6">
        <div className="flex flex-row justify-between">
          <div>signed.gg</div>
          <div>{artist.nickname}</div>
        </div>
        <div className="w-full flex flex-col gap-3 items-center justify-center h-full">
          <div>
            Autograph Session with {artist.nickname}
          </div>
          <div>
            <a href={`/collector/${campaign.campaignId}`} target="_blank">
              <BinderButton className="cursor-pointer">
                Request Signature
              </BinderButton>
            </a>
          </div>
        </div>
      </div>
      <div className="">
        {
          campaign.landingImageUrl ?
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.landingImageUrl}
            alt="campaign promo image"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        :
          <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-indigo-300 to-pink-500 w-full h-full"></div>
        }
      </div>
    </div>
  )
}
