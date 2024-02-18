"use client";
import { ReactNode } from "react";
import Loader from "@/app/components/Loader";
import { Button, ButtonProps } from "@/components/ui/button";

type BinderButtonCoreProps = {
  isLoading?: boolean;
  children?: ReactNode;
  disabled?: boolean;
} & ButtonProps;

export default function BinderButton({
  isLoading,
  children,
  disabled,
  className,
  ...props
}: BinderButtonCoreProps) {
  if (isLoading) {
    return (
      <Button {...props} className={className}>
        <Loader height={"5"} color="#fffff" />
      </Button>
    );
  }
  return (
    <Button {...props} className={className}>
      {children}
    </Button>
  );
}
