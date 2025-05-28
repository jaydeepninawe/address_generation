"use client";
import dynamic from "next/dynamic";

// Dynamically import WalletGenerator with SSR disabled
const WalletGenerator = dynamic(() => import("./wallet"), { ssr: false });


export default function WalletClientWrapper() {
  return <WalletGenerator />;
}
