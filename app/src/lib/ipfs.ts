import { ThirdwebStorage } from "@thirdweb-dev/storage";

// First, instantiate the thirdweb IPFS storage
const storage = new ThirdwebStorage({
  secretKey: process.env.THIRD_WEB_KEY,
});

export async function uploadMetadata(metadata: any) {
  // Here we get the IPFS URI of where our metadata has been uploaded
  const uri = await storage.upload(metadata);
  // This will log a URL like ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
  console.info(uri);

  // Here we get a URL with a gateway that we can look at in the browser
  const url = await storage.resolveScheme(uri);
  // The URL will be like https://ipfs.thirdwebstorage.com/ipfs/QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
  return url;
}

export async function uploadFile(dataBlob: any) {
  // Here we get the IPFS URI of where our metadata has been uploaded, this will return an array of URIs
  const uri = await storage.upload(dataBlob);
  console.info(uri);
  // grab the first uri
  const url = await storage.resolveScheme(uri);
  return url;
}
