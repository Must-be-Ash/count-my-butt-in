import { resolveUrl } from "@/lib/ipfs";
import { NextResponse, type NextRequest } from "next/server";

// grab an ipfs metadara link and resolve to  valid ipfs urls
export async function POST(request: NextRequest) {
  const { ipfsUrl } = await request.json();
  let originalIpfsUrl = ipfsUrl;
  if (ipfsUrl.includes("https://ipfs.io/ipfs/")) {
    originalIpfsUrl = ipfsUrl.replace("https://ipfs.io/ipfs/", "ipfs://");
  }

  const url = await resolveUrl(originalIpfsUrl);
  const response = await fetch(url);
  const metadata = await response.json();
  let imageUrl = metadata.image;
  if (imageUrl?.includes("ipfs")) {
    const resolvedImageUrl = await resolveUrl(imageUrl);
    metadata.image = resolvedImageUrl;
  }
  return NextResponse.json({ metadata });
}
