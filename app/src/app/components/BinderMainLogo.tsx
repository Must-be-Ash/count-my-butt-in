import Image from "next/image";

const BinderMainLogo = () => {
  return (
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
        Binder <span className="font-light italic font-title">Studio</span>
      </div>
      <div className="text-sm mt-2">connecting through collecting</div>
    </div>
  </div>
  )
}

export default BinderMainLogo;