import { classNames } from "@/utils/styling";
import { ReactNode } from "react";
import { ThreeDots } from "react-loader-spinner";

type BinderButtonCoreProps = {
  primary?: boolean;
  title: string;
  isLoading?: boolean;
  children: ReactNode;
} & any;

export default function BinderButton({
  primary,
  title,
  isLoading,
  children,
  ...props
}: BinderButtonCoreProps) {
  return (
    <>
      <div
        className={classNames(
          primary
            ? "text-white bg-grey-900 border border-solid border-white"
            : "bg-white",
          "inline-flex items-center text-[16px] justify-center gap-[8px] px-[12px] py-[8px] relative  rounded-[8px]  cursor-pointer hover:opacity-70"
        )}
        {...props}
      >
        <div className="w-fit flex flex-row mt-[-1.00px] font-semibold   tracking-[0] leading-[24px] whitespace-nowrap">
          {isLoading ? (
            <ThreeDots
              height="5"
              width="100"
              radius="9"
              color="#fffff"
              ariaLabel="three-dots-loading"
              visible={true}
            />
          ) : (
            title
          )}
          {children}
        </div>
      </div>
    </>
  );
}
