'use client'

import { usePrivy } from "@privy-io/react-auth"

export default function UserInfo() {
  const privy = usePrivy();
  console.log(privy.user);
  return (
    <div></div>
  )
}