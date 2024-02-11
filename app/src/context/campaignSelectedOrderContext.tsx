import { Order } from "@prisma/client";
import * as React from "react";
import { createContext, useContext } from "react";

const campaignSelectedOrderContext = createContext<{
  order?: Order;
  setOrder: (order: Order | undefined) => void;
}>({
  order: undefined,
  setOrder: (order: Order | undefined) => {},
});

export function CampaignSelectedOrderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [order, setOrder] = React.useState<Order | undefined>();

  return (
    <campaignSelectedOrderContext.Provider
      value={{
        order,
        setOrder,
      }}
    >
      {children}
    </campaignSelectedOrderContext.Provider>
  );
}

export const useCampaignSelectedOrder = () =>
  useContext(campaignSelectedOrderContext);
