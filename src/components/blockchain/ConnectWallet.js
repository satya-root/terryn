"use client";

import { useState } from "react";

import { connectWallet } from "@/lib/blockchain/wallet";
import { Button } from "../ui/button";

export default function ConnectWallet() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  async function handleConnect() {
    try {
      setError("");

      const wallet = await connectWallet();

      setAddress(wallet.address);
    } catch (err) {
      setError(err.message);
    }
  }

  if (address) {
    return (
      <button>
        {address.slice(0, 6)}
        ...
        {address.slice(-4)}
      </button>
    );
  }

  return (
    <div>
      <Button
        variant="default"
        className="bg-[#060606] font-mono text-[#FCFCFC]"
        onClick={handleConnect}
      >
        Connect Wallet
      </Button>
      {/* <button>Connect Wallet</button> */}

      {error && <p>{error}</p>}
    </div>
  );
}
