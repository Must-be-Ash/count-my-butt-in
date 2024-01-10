import React from "react";
import { ThreeDots } from "react-loader-spinner";

type LoadingProps = {
  height?: string;
  width?: string;
  color?: string;
  radius?: string;
} & any;

export default function Loader({
  height,
  width,
  color,
  radius,
  ...props
}: LoadingProps) {
  return (
    <>
      <div {...props}>
        {" "}
        <ThreeDots
          height={height || 50}
          width={width || 50}
          radius={radius || "9"}
          color={color || "#ffffff"}
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    </>
  );
}
