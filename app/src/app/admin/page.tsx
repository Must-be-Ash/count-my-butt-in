"use client";
import CreateCampaign from "../components/admin/CreateCampaign";
import ScanBlocks from "../components/admin/ScanBlocks";
export default function Admin() {
  return (
    <main className="flex flex-row gap-4">
      <CreateCampaign />
      <ScanBlocks />
    </main>
  );
}
