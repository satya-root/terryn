"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CardImageSell,
} from "@/components/custom/CardImageSell";

import {
  fetchOwnedLands,
} from "@/lib/blockchain/fetchOwnedLands";


export default function OwnedLandsCollection() {
  const [
    walletAddress,
    setWalletAddress,
  ] = useState("");

  const [
    ownedProperties,
    setOwnedProperties,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // ============================================================
  // GET CONNECTED METAMASK WALLET
  // ============================================================

  useEffect(() => {
    async function loadWallet() {
      try {
        if (
          typeof window ===
            "undefined" ||
          !window.ethereum
        ) {
          setError(
            "MetaMask is not installed."
          );

          setLoading(false);

          return;
        }

        const accounts =
          await window.ethereum.request({
            method:
              "eth_accounts",
          });

        if (
          !accounts ||
          accounts.length === 0
        ) {
          setWalletAddress("");

          setOwnedProperties([]);

          setError(
            "Connect your wallet to view your properties."
          );

          setLoading(false);

          return;
        }

        console.log(
          "Connected profile wallet:",
          accounts[0]
        );

        setWalletAddress(
          accounts[0]
        );

        setError("");

      } catch (error) {
        console.error(
          "Wallet loading failed:",
          error
        );

        setError(
          error?.message ||
          "Unable to read connected wallet."
        );

        setLoading(false);
      }
    }

    loadWallet();


    // ==========================================================
    // LISTEN FOR WALLET CHANGES
    // ==========================================================

    function handleAccountsChanged(
      accounts
    ) {
      if (
        accounts &&
        accounts.length > 0
      ) {
        setWalletAddress(
          accounts[0]
        );

        setOwnedProperties([]);

        setError("");

      } else {
        setWalletAddress("");

        setOwnedProperties([]);

        setError(
          "Connect your wallet to view your properties."
        );
      }
    }

    window.ethereum?.on(
      "accountsChanged",
      handleAccountsChanged
    );

    return () => {
      window.ethereum?.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };

  }, []);


  // ============================================================
  // LOAD BLOCKCHAIN PROPERTIES
  // ============================================================

  useEffect(() => {
    if (!walletAddress) {
      return;
    }

    let cancelled = false;

    async function loadProperties() {
      try {
        setLoading(true);

        setError("");

        console.log(
          "Reading Terryn NFTs owned by:",
          walletAddress
        );

        const properties =
          await fetchOwnedLands(
            walletAddress
          );

        if (cancelled) {
          return;
        }

        setOwnedProperties(
          properties
        );

      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Unable to load properties:",
          error
        );

        setOwnedProperties([]);

        setError(
          error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Unable to fetch owned properties."
        );

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProperties();

    return () => {
      cancelled = true;
    };

  }, [walletAddress]);


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-3xl">

        <span className="material-symbols-outlined text-5xl text-indigo-500 animate-spin">
          progress_activity
        </span>

        <h3 className="mt-5 text-lg font-bold text-slate-700">
          Loading Your Properties
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Reading NFT ownership from Sepolia...
        </p>

      </div>
    );
  }


  // ============================================================
  // ERROR
  // ============================================================

  if (
    error &&
    ownedProperties.length === 0
  ) {
    return (
      <div className="py-12 px-6 flex flex-col items-center justify-center bg-rose-50/40 border border-rose-100 border-dashed rounded-3xl">

        <span className="material-symbols-outlined text-6xl text-rose-300 mb-4">
          error
        </span>

        <h3 className="text-xl font-bold text-slate-700 mb-2">
          Unable To Load Properties
        </h3>

        <p className="text-slate-500 text-center max-w-lg">
          {error}
        </p>

      </div>
    );
  }


  // ============================================================
  // EMPTY
  // ============================================================

  if (
    ownedProperties.length === 0
  ) {
    return (
      <div className="py-12 px-6 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 border-dashed rounded-3xl">

        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
          real_estate_agent
        </span>

        <h3 className="text-xl font-bold text-slate-700 mb-2">
          No Properties In This Wallet
        </h3>

        <p className="text-slate-500 text-center max-w-md">
          No Terryn land NFTs are currently owned by the connected wallet.
        </p>

        {walletAddress && (
          <p className="mt-4 text-xs font-mono text-slate-400 text-center break-all max-w-lg">
            {walletAddress}
          </p>
        )}

      </div>
    );
  }


  // ============================================================
  // SUCCESS
  // ============================================================

  return (
    <>
      <div className="mb-6 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />

          <span className="text-sm font-semibold text-emerald-800">
            Connected Wallet
          </span>

          <span className="font-mono text-xs text-emerald-700 bg-white border border-emerald-100 px-3 py-1 rounded-full">

            {`${walletAddress.slice(
              0,
              6
            )}...${walletAddress.slice(
              -4
            )}`}

          </span>

        </div>

        <span className="text-sm text-emerald-700 font-medium">

          {ownedProperties.length}{" "}

          {ownedProperties.length === 1
            ? "Property"
            : "Properties"}

        </span>

      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {ownedProperties.map(
          (property) => (

            <CardImageSell
              key={
                `${property.nftAddress}-${property.tokenId}`
              }
              property={
                property
              }
            />

          )
        )}

      </div>
    </>
  );
}