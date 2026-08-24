"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";
import PropertyMapClient from "@/components/custom/PropertyMapClient";

import { Outfit, JetBrains_Mono } from "next/font/google";

import {
  approveMarketplace,
  listLand,
  getListing,
  cancelLandListing,
} from "@/lib/blockchain/marketplace";

import { fetchLandByTokenId } from "@/lib/blockchain/fetchLandByTokenId";

// import {
//   approveMarketplace,
//   listLand,
//   getListing,
// } from "@/lib/blockchain/marketplace";

const outfit = Outfit({
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
});

export default function ListAssetClient({ tokenId }) {
  const [property, setProperty] = useState(null);

  const [connectedWallet, setConnectedWallet] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [listingPrice, setListingPrice] = useState("");

  const [listingStatus, setListingStatus] = useState("");

  const [listing, setListing] = useState(null);

  const [isUnlisting, setIsUnlisting] = useState(false);

  const [isListing, setIsListing] = useState(false);

  // ==========================================================
  // LOAD WALLET + NFT
  // ==========================================================

  useEffect(() => {
    async function loadAsset() {
      try {
        setLoading(true);
        setError("");

        if (!window.ethereum) {
          throw new Error("MetaMask is required.");
        }

        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (!accounts || accounts.length === 0) {
          throw new Error("Please connect your MetaMask wallet.");
        }

        const wallet = accounts[0];

        setConnectedWallet(wallet);

        // =========================================
        // Read NFT data
        // =========================================

        const land = await fetchLandByTokenId(tokenId);

        // =========================================
        // Read marketplace listing
        // =========================================

        const currentListing = await getListing(tokenId);

        console.log("NFT owner:", land.owner);

        console.log("Marketplace listing:", currentListing);

        setListing(currentListing);

        // =========================================
        // Access Rules
        // =========================================

        const walletOwnsNFT = land.owner.toLowerCase() === wallet.toLowerCase();

        const walletIsSeller =
          currentListing.active &&
          currentListing.seller.toLowerCase() === wallet.toLowerCase();

        /*
         * User can manage the asset if:
         *
         * 1. NFT is currently in their wallet
         *
         * OR
         *
         * 2. NFT is inside Escrow but
         *    they are the active seller.
         */

        if (!walletOwnsNFT && !walletIsSeller) {
          throw new Error("The connected wallet cannot manage this NFT.");
        }

        setProperty(land);

        // If currently listed,
        // show the existing asking price.

        if (currentListing.active) {
          setListingPrice(currentListing.priceInINR);
        }
      } catch (error) {
        console.error("Asset loading error:", error);

        setError(
          error?.shortMessage ||
            error?.reason ||
            error?.message ||
            "Unable to load property.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAsset();
  }, [tokenId]);

  // ==========================================================
  // ACCOUNT CHANGE
  // ==========================================================

  useEffect(() => {
    function handleAccountsChanged(accounts) {
      if (accounts && accounts.length > 0) {
        setConnectedWallet(accounts[0]);

        window.location.reload();
      } else {
        setConnectedWallet("");

        setProperty(null);

        setError("Wallet disconnected.");
      }
    }

    window.ethereum?.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  // ==========================================================
  // LIST NFT
  // ==========================================================

  async function handleListNFT() {
    if (!property) {
      return;
    }

    if (!listingPrice || Number(listingPrice) <= 0) {
      setListingStatus("Enter a valid listing price.");

      return;
    }

    try {
      setIsListing(true);

      setListingStatus("Waiting for Marketplace approval...");

      // =========================================
      // STEP 1 — Approve marketplace
      // =========================================

      const approval = await approveMarketplace(tokenId);

      console.log("Approval transaction:", approval.txHash);

      // =========================================
      // STEP 2 — List NFT
      // =========================================

      setListingStatus("Approval confirmed. Listing property...");

      const listingResult = await listLand(tokenId, listingPrice);

      console.log("Listing transaction:", listingResult.txHash);

      // =========================================
      // STEP 3 — Verify blockchain state
      // =========================================

      const updatedListing = await getListing(tokenId);

      if (!updatedListing.active) {
        throw new Error("Listing did not become active.");
      }

      setListing(updatedListing);

      // NFT owner should now be Escrow.

      const refreshedProperty = await fetchLandByTokenId(tokenId);

      setProperty(refreshedProperty);

      setListingStatus("Property successfully listed.");
    } catch (error) {
      console.error("Listing failed:", error);

      setListingStatus(
        error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Listing failed.",
      );
    } finally {
      setIsListing(false);
    }
  }

  async function handleUnlistNFT() {
    try {
      setIsUnlisting(true);

      setListingStatus("Cancelling listing...");

      // =========================================
      // STEP 1 — cancelListing()
      // =========================================

      const result = await cancelLandListing(tokenId);

      console.log("Cancellation transaction:", result.txHash);

      // =========================================
      // STEP 2 — Verify listing inactive
      // =========================================

      const updatedListing = await getListing(tokenId);

      if (updatedListing.active) {
        throw new Error("Listing is still active.");
      }

      // =========================================
      // STEP 3 — Verify NFT returned
      // =========================================

      const refreshedProperty = await fetchLandByTokenId(tokenId);

      if (
        refreshedProperty.owner.toLowerCase() !== connectedWallet.toLowerCase()
      ) {
        throw new Error("NFT was not returned to the seller wallet.");
      }

      setProperty(refreshedProperty);

      setListing(updatedListing);

      setListingPrice("");

      setListingStatus(
        "Property successfully unlisted and returned to your wallet.",
      );
    } catch (error) {
      console.error("Unlisting failed:", error);

      setListingStatus(
        error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Unable to unlist property.",
      );
    } finally {
      setIsUnlisting(false);
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div
        className={`
          min-h-screen
          flex
          flex-col
          bg-slate-50
          ${outfit.className}
        `}
      >
        <Navbar />

        <main
          className="
            flex-1
            flex
            flex-col
            justify-center
            items-center
          "
        >
          <span
            className="
              material-symbols-outlined
              text-6xl
              text-indigo-500
              animate-spin
            "
          >
            progress_activity
          </span>

          <p
            className="
              mt-4
              text-slate-500
              font-semibold
            "
          >
            Reading asset from Sepolia...
          </p>
        </main>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !property) {
    return (
      <div
        className={`
          min-h-screen
          flex
          flex-col
          bg-slate-50
          ${outfit.className}
        `}
      >
        <Navbar />

        <main
          className="
            flex-1
            flex
            items-center
            justify-center
            px-6
          "
        >
          <div
            className="
              max-w-lg
              w-full
              bg-white
              border
              border-rose-100
              rounded-3xl
              p-10
              text-center
              shadow-sm
            "
          >
            <span
              className="
                material-symbols-outlined
                text-6xl
                text-rose-400
              "
            >
              error
            </span>

            <h2
              className="
                text-2xl
                font-bold
                text-slate-800
                mt-4
              "
            >
              Unable To Manage Asset
            </h2>

            <p
              className="
                text-slate-500
                mt-2
              "
            >
              {error}
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const numericArea = Number.parseFloat(property.area);

  const area = Number.isFinite(numericArea) ? numericArea : 0;

  return (
    <div
      className={`
        min-h-screen
        flex
        flex-col
        bg-slate-50
        text-slate-800
        ${outfit.className}
        relative
      `}
    >
      {/* BACKGROUND */}

      <div
        className="
          absolute
          inset-0
          z-0
          opacity-[0.03]
          pointer-events-none
        "
        style={{
          backgroundImage:
            "linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)",

          backgroundSize: "24px 24px",
        }}
      />

      <div
        className="
          fixed
          inset-0
          z-0
          pointer-events-none
          opacity-70
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -top-40
            -right-40
            w-[800px]
            h-[800px]
            bg-gradient-to-br
            from-indigo-200/60
            to-purple-100/20
            rounded-full
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-40
            w-[800px]
            h-[800px]
            bg-gradient-to-tr
            from-blue-200/60
            to-emerald-100/20
            rounded-full
            blur-[100px]
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          flex
          flex-col
          min-h-screen
        "
      >
        <Navbar />

        <main
          className="
            flex-1
            w-full
            max-w-[1440px]
            mx-auto
            px-6
            sm:px-12
            py-12
            mt-[80px]
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-8">
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-1
                rounded-full
                bg-indigo-50
                border
                border-indigo-100
                text-indigo-600
                text-sm
                font-bold
                tracking-widest
                uppercase
                mb-4
                shadow-sm
              "
            >
              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-indigo-500
                  animate-pulse
                "
              />
              Token #{property.tokenId}
            </div>

            <h1
              className="
                text-4xl
                md:text-5xl
                font-extrabold
                text-slate-900
                tracking-tight
              "
            >
              Property Asset Manager
            </h1>

            <p
              className="
                text-slate-500
                mt-2
                text-lg
                max-w-2xl
              "
            >
              Manage your verified blockchain land asset and list it on the
              Terryn marketplace.
            </p>
          </div>

          <div
            className="
              flex
              flex-col
              lg:flex-row
              justify-between
              items-start
              gap-8
            "
          >
            {/* =================================================
                LEFT
            ================================================= */}

            <div
              className="
                flex
                flex-col
                gap-6
                w-full
                lg:w-[45%]
              "
            >
              {/* ASSET IDENTITY */}

              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-8
                  relative
                  overflow-hidden
                  shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                "
              >
                <h2
                  className="
                    text-sm
                    uppercase
                    tracking-[0.2em]
                    text-slate-400
                    font-bold
                    mb-6
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span className="material-symbols-outlined text-[18px]">
                    fingerprint
                  </span>
                  Asset Identity
                </h2>

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-y-8
                    gap-x-6
                  "
                >
                  <div>
                    <p className="text-xs uppercase text-slate-400 tracking-wider mb-1 font-bold">
                      Land ID
                    </p>

                    <p
                      className={`
                        text-lg
                        text-indigo-600
                        font-bold
                        ${jetbrains.className}
                      `}
                    >
                      {property.land_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-slate-400 tracking-wider mb-1 font-bold">
                      Land Type
                    </p>

                    <p className="text-lg text-slate-800 font-medium">
                      {property.land_type}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-slate-400 tracking-wider mb-1 font-bold">
                      Location
                    </p>

                    <p className="text-lg text-slate-800 font-medium">
                      {property.landmark || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-slate-400 tracking-wider mb-1 font-bold">
                      District
                    </p>

                    <p className="text-lg text-slate-800 font-medium">
                      {property.district || "N/A"}
                    </p>
                  </div>

                  <div
                    className="
                      col-span-2
                      border-t
                      border-slate-100
                      pt-6
                      mt-2
                    "
                  >
                    <p className="text-xs uppercase text-slate-400 tracking-wider mb-1 font-bold">
                      State
                    </p>

                    <p className="text-lg text-slate-800 font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-500">
                        near_me
                      </span>

                      {property.state || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* DIMENSIONS */}

              <div className="flex flex-col sm:flex-row gap-6">
                <div
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    flex-1
                    shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                  "
                >
                  <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400 font-bold mb-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      straighten
                    </span>
                    Dimensions
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 text-sm">Total Area</span>

                      <span className="font-bold">{area.toFixed(2)} sq.ft</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 text-sm">Length</span>

                      <span className="font-bold">
                        {property.length || "N/A"} ft
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Width</span>

                      <span className="font-bold">
                        {property.width || "N/A"} ft
                      </span>
                    </div>
                  </div>
                </div>

                {/* GPS */}

                <div
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    flex-1
                    shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                  "
                >
                  <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400 font-bold mb-5">
                    Telemetry
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <span className="block text-slate-400 text-xs uppercase font-bold">
                        Latitude
                      </span>

                      <span className="text-emerald-600 font-bold">
                        {property.geo_lat ?? "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-slate-400 text-xs uppercase font-bold">
                        Longitude
                      </span>

                      <span className="text-emerald-600 font-bold">
                        {property.geo_lng ?? "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div
              className="
                flex
                flex-col
                gap-6
                w-full
                lg:w-[55%]
              "
            >
              {/* MAP + IMAGE */}

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  gap-4
                  w-full
                  h-[60vh]
                  sm:h-[40vh]
                  lg:h-[45vh]
                "
              >
                {/* MAP */}

                <div
                  className="
                    relative
                    flex-1
                    rounded-2xl
                    overflow-hidden
                    shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                    bg-white
                    p-2
                    h-full
                  "
                >
                  <div className="relative w-full h-full rounded-[1rem] overflow-hidden">
                    {property.geo_lat !== null && property.geo_lng !== null ? (
                      <PropertyMapClient
                        latitude={Number(property.geo_lat)}
                        longitude={Number(property.geo_lng)}
                        landId={property.land_id}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        Coordinates unavailable
                      </div>
                    )}
                  </div>
                </div>

                {/* IMAGE */}

                <div className="relative flex-1 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] group bg-white p-2 h-full">
                  <div className="relative w-full h-full rounded-[1rem] overflow-hidden">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />

                    <img
                      src={
                        property.land_photo ||
                        "https://assets.site-static.com/userFiles/1681/image/uploads/agent-1/buy-sell-land.jpg"
                      }
                      alt="Land Asset"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  LISTING CONSOLE
              ================================================= */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  p-6
                  shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                  border
                  border-slate-100
                "
              >
                <h3 className="text-slate-900 font-bold text-xl">
                  List Property
                </h3>

                <p className="text-slate-500 text-sm mt-1 mb-5">
                  Set the asking price in INR and move this NFT into Terryn
                  Escrow.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="number"
                    min="1"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    placeholder="Price in INR"
                    className="
                      flex-1
                      h-14
                      px-4
                      border
                      border-slate-200
                      rounded-xl
                      outline-none
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                    "
                  />

                  <button
                    onClick={handleListNFT}
                    disabled={isListing}
                    className="
                      px-8
                      h-14
                      rounded-xl
                      bg-slate-900
                      text-white
                      font-bold
                      hover:bg-indigo-600
                      transition-all
                      disabled:opacity-50
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      storefront
                    </span>

                    {isListing ? "Processing..." : "List for Sale"}
                  </button>
                </div>

                {listingStatus && (
                  <p className="mt-4 text-sm font-medium text-slate-600">
                    {listingStatus}
                  </p>
                )}

                {/* ROR */}

                {property.ror_document && (
                  <a
                    href={property.ror_document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex mt-5"
                  >
                    <button className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">
                        description
                      </span>
                      View RoR
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </main>

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
