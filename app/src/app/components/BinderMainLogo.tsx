import Image from "next/image";

const BinderMainLogo = () => {
  return (
    <div className="flex flex-row gap-16 mt-5">
      <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-90 hover:cursor-pointer p-16 flex-1 ">
        <Image
          src="/assets/signed_gg_logo.png"
          alt="binder-logo"
          width="150"
          height="150"
          sizes="100vw"
        />
        <div className="text-2xl font-bold">
          Signed
        </div>
        <div className="text-sm mt-2">autographs for digital media</div>
      </div>
    </div>
  );
};

export default BinderMainLogo;
