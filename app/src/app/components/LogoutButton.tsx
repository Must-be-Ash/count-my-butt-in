"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils/styling";

const sizeClass = {
  default: "h-2 w-2",
  sm: "h-4 w-4",
  lg: "h-6 w-6",
};
type Size = "default" | "sm" | "lg";

const sizeToClass = (size: Size) => sizeClass[size];
export default function LogoutButton({
  size = "default",
  withText = false,
}: {
  size?: Size;
  withText?: boolean;
}) {
  const { logout } = usePrivy();
  return (
    <div className="flex flex-row gap-2 cursor-pointer" onClick={logout}>
      <ArrowRightOnRectangleIcon className={classNames(sizeToClass(size))} />
      {withText && "Logout"}
    </div>
  );
}
