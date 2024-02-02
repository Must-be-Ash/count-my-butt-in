"use client";
import { Campaign, User } from "@prisma/client";
import Image from "next/image";
import BinderButton from "./BinderButton";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function CampaignLanding({
  artist,
  campaign,
}: {
  campaign: Campaign;
  artist: { nickname: string; twitterUsername: string; imageUrl?: string };
}) {
  const desktop = "(min-width: 768px)";
  const isDesktop = useMediaQuery(desktop);
  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 font-sans overflow-clip h-screen w-screen">
      <div className="sm:shadow-2xl bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-stone-300 via-indigo-300 to-emerald-400 sm:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] sm:from-[#101010] sm:via-[#121212] sm:to-black h-full w-full sm:p-6 p-3 text-slate-800 sm:text-slate-200 flex flex-col items-center justify-between">
        <div className="flex flex-row justify-between items-center w-full">
          <a
            className="cursor-pointer"
            href="https://signed.gg"
            target="_blank"
          >
            {isDesktop ? (
              <Image
                src="/signedgg.png"
                alt="signed-logo"
                className="w-10 h-10"
                width="250"
                height="250"
              />
            ) : (
              <Image
                src="/signedgg-dark.png"
                alt="signed-logo"
                className="w-10 h-10"
                width="250"
                height="250"
              />
            )}
          </a>
          {artist.twitterUsername && (
            <a
              className="cursor-pointer uppercase font-sans font-black text-sm"
              href={`https://x.com/${artist.twitterUsername}`}
              target="_blank"
            >
              @{artist.twitterUsername}
            </a>
          )}
        </div>
        <div className="w-full flex flex-col gap-6 items-center justify-center h-full">
          <div className="flex flex-col text-3xl items-center justify-center">
            <div className="font-sans font-black uppercase">
              {artist.nickname}
            </div>
            <div className="font-title italic">Autograph Session</div>
          </div>
          {artist.imageUrl && (
            <Image
              src={artist.imageUrl}
              alt="profile picture"
              className="rounded-full w-40 h-40 shadow-xl"
              width={98}
              height={98}
            />
          )}
          <div className="">
            <a href={`/collector/${campaign.campaignId}/home`} target="_blank">
              <div>
                The campaign has ended 🥲.{" "}
                <a
                  href="https://opensea.io/assets/optimism/0x2cabc36bf9410488a6066d5902ece3ce2423cc5b"
                  target="_blank"
                >
                  {" "}
                  Check out the collection here!
                </a>
              </div>
              <BinderButton className="cursor-pointer dark:bg-slate-900 dark:text-white sm:dark:bg-slate-300 sm:dark:text-slate-900">
                Request Signature
              </BinderButton>
            </a>
          </div>
        </div>
        <a href="https://binder.studio" target="_blank">
          <div className="flex flex-row gap-1 items-center font-thin cursor-pointer text-sm ">
            Powered by
            <span className="font-title italic">
              Binder<span className="text-green-300">.</span>Studio
            </span>
          </div>
        </a>
      </div>
      <div className="sm:block hidden">
        {campaign.landingImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.landingImageUrl}
            alt="campaign promo image"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        ) : (
          <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-stone-300 via-indigo-300 to-emerald-400 w-full h-full"></div>
        )}
      </div>
    </div>
  );
}
