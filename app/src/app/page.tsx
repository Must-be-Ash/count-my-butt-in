"use client"
/**
 * this is the landing page of a particular campaign for
 * an artist, based on
 */
import BigLoginDisplayPage from './components/BigLoginDisplayPage';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams()
  const chain = searchParams.get("chain") ?? "8453";
  return (
    <BigLoginDisplayPage networkId={parseInt(chain)} />
  )
}
