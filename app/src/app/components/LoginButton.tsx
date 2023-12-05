'use client'
import {usePrivy} from '@privy-io/react-auth';

export default function LoginButton () {
  const {login} = usePrivy();
return (
  <button className="text-white text-lg p-4 bg-blue-800 cursor-pointer" onClick={() => login()}>login</button>
)
}