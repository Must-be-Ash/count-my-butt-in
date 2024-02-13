import BigLoginDisplayPage from "@/app/components/BigLoginDisplayPage";
import { DEFAULT_NETWORK } from "@/utils/common";

export default function Collector() {
  return (
    <BigLoginDisplayPage networkId={DEFAULT_NETWORK} />
  );
}
