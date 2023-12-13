/**
 * PENDING = Token is waiting to be autographed on
 * AUTOGRAPHED = Artist has created and uploaded an autograph (from the UI - uploaded on arweave) and the autograph link has been stored in the database
 * REJECTED = the order was rejected
 */
type Status = "PENDING" | "AUTOGRAPHED" | "REJECTED";
type Order = {
  collectionTitle: string,
  tokenId: string,
  image: string,
  autograph?: string,
  status: Status
}