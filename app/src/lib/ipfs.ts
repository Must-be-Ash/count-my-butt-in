import { ThirdwebStorage } from "@thirdweb-dev/storage";

// First, instantiate the thirdweb IPFS storage
const storage = new ThirdwebStorage({
  secretKey: process.env.THIRD_WEB_KEY,
});

// Upload and return the manifest url
export async function uploadMetadata(
  defaultMetadata: any,
  metadata: any[]
): Promise<string> {
  // the first metadata will always be the default metadata
  // Here we get the IPFS URI of where our metadata has been uploaded
  const uris = await storage.uploadBatch([defaultMetadata, ...metadata]);
  // This will log a URL like ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0

  if (!uris.length) return "";
  const manifestUri = await storage.resolveScheme(
    uris[0].slice(0, uris[0].lastIndexOf("/"))
  );

  // Here we get a URL with a gateway that we can look at in the browser
  return manifestUri.slice(0, manifestUri.length - 1); // remove the last "/" from the uri
}

export async function uploadFile(dataBlob: Blob) {
  const file = new File([dataBlob], "signature.png", { type: "image/png" });
  const data = await file.arrayBuffer();
  // Here we get the IPFS URI of where our metadata has been uploaded, this will return an array of URIs
  const uri = await storage.upload(Buffer.from(data));
  // grab the first uri
  const url = await storage.resolveScheme(uri);
  return url;
}
