import LoginOrUserWidget from "@/app/components/LoginOrUserWidget";
import BinderButton from "@/app/components/binderButton";
import Main from "@/app/layouts/Main";
import mockOrders from "@/utils/mocks/orders";
import Image from "next/image";
import type Order from "util/types";

const StatusButton = ({orderStatus}:{orderStatus: Order["status"]}) => {
  switch (orderStatus) {
    case "AUTOGRAPHED": {
      return (
        <BinderButton className="w-full mt-2" disabled>Done</BinderButton>
      )
    }
    case "PENDING": {
      return (
        <BinderButton className="w-full mt-2">Fill Order</BinderButton>
      )
    }
  }
}

const SubmitStickyButton = () => {
  return (
    <div className="w-full sticky bottom-0 bg-slate-900 pt-8 pb-16">
    <div className="h-full w-full flex flex-col items-center">
    <BinderButton className="w-3/4">Submit</BinderButton>
    </div>
  </div>
  )
}

export default function Orders() {
  return (
    <Main>
      <LoginOrUserWidget />
      <div className="self-start">
        Order List
      </div>
      <div className="flex flex-row gap-3 mt-8  flex-wrap">
        {
          mockOrders.map((order, key) => {
            return (
              <div key={key} className="h-[265px] w-[173px] bg-black rounded-lg">
                <div className="h-[173px] w-[173px] rounded-t-lg relative">
                  {/* image */}
                  <Image src={order.image} alt="nft image" fill className="rounded-t-lg" />
                </div>
                {/* content */}
                <div className="p-3">
                  <div className="text-white text-sm">
                    {`${order.collectionTitle} #${order.tokenId}`}
                  </div>
                  <div>
                    <StatusButton orderStatus={order.status} />
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <SubmitStickyButton />
    </Main>
  );
}
