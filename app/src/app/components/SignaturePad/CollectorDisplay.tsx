import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Order } from "@prisma/client";
import { defaultNote } from "@/utils/common";
import UserInfo from "../UserInfo";
import { useUser } from "@/hooks/useUser";
import Loader from "../Loader";

export default function CollectorDisplay({ order }: { order: Order }) {
  const { user } = useUser(order.userId);
  return (
    <>
      {user && (
        <div className="mb-10 flex flex-col items-center ">
          <UserInfo overrideUser={user} />
          <Accordion type="single" collapsible>
            <AccordionItem
              value="item-1"
              className="text-center flex flex-col items-center text-neutral-500"
            >
              <AccordionTrigger>Note for the artist</AccordionTrigger>
              <AccordionContent>
                {order.personalNote || defaultNote}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </>
  );
}
