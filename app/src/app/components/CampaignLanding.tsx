import { Campaign, User } from "@prisma/client";
import Image from "next/image";
import BinderButton from "./BinderButton";
import Link from "next/link";

export default async function CampaignLanding({
    artist,
    campaign
  }:{
    campaign: Campaign
    artist: {nickname: string, twitterUsername: string, imageUrl?: string}
  }
){
  return (
    <div className="grid sm:grid-cols-2 h-screen w-screen font-sans overflow-hidden">
      <div className="w-full p-6 shadow-2xl h-full">
        <div className="flex flex-col items-center justify-between h-full">
          <div className="flex flex-row justify-between items-center w-full">
            <a className="cursor-pointer" href="https://signed.gg" target="_blank">
              <Image
                src="/signedgg.png"
                alt="signed-logo"
                className="w-10 h-10"
                width="250"
                height="250"
              />
            </a>
            <a className="cursor-pointer" href={`https://x.com/${artist.twitterUsername}`} target="_blank">@{artist.twitterUsername}</a>
          </div>
          <div className="w-full flex flex-col gap-3 items-center justify-center h-full">
            <div className="font-sans font-black uppercase text-lg">
            {artist.nickname}
            </div>
            <div className="text-3xl font-title italic">
              Autograph Session
            </div>
            {artist.imageUrl && <Image
              src={artist.imageUrl}
              alt="profile picture"
              className="rounded-full w-40 h-40"
              width={98}
              height={98}
            />}
            <div className="pt-4">
              <a href={`/collector/${campaign.campaignId}`} target="_blank">
                <BinderButton className="cursor-pointer">
                  Request Signature
                </BinderButton>
              </a>
            </div>
          </div>
          <a href="https://binder.studio" target="_blank">
            <div className="flex flex-row gap-1 items-center font-thin cursor-pointer text-sm">
              Powered by
              <span className="font-title italic">
                Binder<span className="text-green-300">.</span>Studio
              </span>
            </div>
          </a>

        </div>
      </div>
      <div className="sm:block hidden">
        {
          campaign.landingImageUrl ?
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.landingImageUrl}
            alt="campaign promo image"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        :
          <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-stone-300 via-indigo-300 to-emerald-400 w-full h-full"></div>
        }
      </div>
    </div>
  )
}
