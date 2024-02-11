import React from "react";

import { useOrdersByCampaignId, useOrdersByUser } from "@/hooks/useOrders";
import Loader from "../Loader";
import CampaignListItem from "../collectors/CampaignListItem";

const CampaignList = ({
  campaignId,
}: {
  campaignId: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { isLoading, orders } = useOrdersByCampaignId(campaignId);
  if (isLoading) return <Loader />;

  return (
    <>
      {!!orders && orders.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {orders.map((order) => (
            <CampaignListItem key={`${order.orderId}`} order={order} />
          ))}
        </div>
      ) : (
        <div className=" mt-10">No orders? NGMI</div>
      )}
    </>
  );
};

export default CampaignList;
