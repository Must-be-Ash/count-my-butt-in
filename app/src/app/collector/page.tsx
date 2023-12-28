import Image from "next/image";
import LoginButton from "@/app/components/LoginButton";

export default function Collector() {
  return (
    <main>
      {/* <div className='text-6xl font-bold mt-8'>Welcome to Binder</div> */}
      <div className="flex flex-row gap-16 mt-5">
        <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-90 hover:cursor-pointer p-16 flex-1 ">
          <Image
            src="/assets/icon_white.svg"
            alt="binder-logo"
            className="mb-12 w-20 sm:w-24"
            width="0"
            height="0"
            sizes="100vw"
          />
          <div className="text-2xl font-bold">
            Binder <span className="font-light font-baskerville">Studio</span>
          </div>
          <div className="text-sm mt-2">connecting through collecting</div>
        </div>
      </div>

      {/* <div className='w-full text-xl text-right mt-10'>Skip for now</div> */}

      <div className="flex flex-col items-center justify-center mt-16">
        <LoginButton />
      </div>
      <div className="absolute bottom-5 right-1/3 flex flex-row items-center text-[10px] sm:text-sm break-words">
        By signing in you agreed to the
        <a
          className="mr-1 ml-1 font-bold flex flex-row"
          href="https://alive-pastry-274.notion.site/Terms-and-Conditions-e79bb18213964f49941c99d0db6da297"
          target="_blank"
        >
          Terms and Condition
        </a>{" "}
        and our
        <a
          className="ml-1 font-bold"
          href="https://alive-pastry-274.notion.site/Privacy-Policy-888b290c0a54448cb9a6444a4eff8a91"
          target="_blank"
        >
          Privacy Policy
        </a>{" "}
      </div>
    </main>
  );
}
