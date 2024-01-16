"use client";
import { classNames } from "@/utils/styling";
import { ButtonHTMLAttributes, ReactNode } from "react";
import Loader from "@/app/components/Loader";

type BinderButtonCoreProps = {
  primary?: boolean;
  title?: string;
  textColor?: string;
  isLoading?: boolean;
  children?: ReactNode;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BinderButton({
  primary,
  title,
  isLoading,
  textColor,
  children,
  disabled,
  ...props
}: BinderButtonCoreProps) {
  return (
    <>
      <button
        {...props}
        className={classNames(
          props.className,
          primary
            ? `${
                textColor || "text-white"
              } bg-[#232323] border`
            : `bg-white ${textColor || "text-black"} `,
          "inline-flex items-center text-[16px] justify-center gap-[8px] px-[12px] py-[8px] relative  rounded-[8px]  enabled:cursor-pointer enabled:hover:opacity-80",
          disabled ? "bg-[#404040] text-white" : ""
        )}
        disabled={disabled}
      >
        <div className="flex flex-row mt-[-1.00px] font-semibold tracking-[0] leading-[24px] whitespace-nowrap">
          {isLoading ? (
            <Loader height={"5"} width="100" color="#fffff" />
          ) : (
            title || "Button"
          )}
          {children}
        </div>
      </button>
    </>
  );
}
