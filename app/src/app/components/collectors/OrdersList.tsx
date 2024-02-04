import React from "react";

import { useOrdersByUser } from "@/hooks/useOrders";
import Loader from "../Loader";
import OrdersListItem from "./OrdersListItem";

const OrdersList = ({
  privyUserId,
}: {
  privyUserId: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { isLoading, orders } = useOrdersByUser(privyUserId);
  if (isLoading) return <Loader />;

  return (
    <>
      {!!orders && orders.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {orders.map((order) => (
            <OrdersListItem key={`${order.orderId}`} order={order} />
          ))}
        </div>
      ) : (
        <div className=" mt-10">No orders? NGMI</div>
      )}
    </>
  );
};

export default OrdersList;
