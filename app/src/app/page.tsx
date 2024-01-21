// import { prisma } from "@/utils/db";
import BigLoginDisplayPage from "./components/BigLoginDisplayPage";

// async function users() {
//   'use server'
//   const artists = await prisma.artist.findMany({});
//   return;
// }

export default async function Home() {
  // await users();
  return (
    <BigLoginDisplayPage />
  )

}
