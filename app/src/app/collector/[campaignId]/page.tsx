import Image from "next/image";
import LoginButton from "@/app/components/LoginButton";
import Main from "@/app/layouts/Main";

export default function Collector() {
  return (
    <Main>
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
    </Main>
  );
}
