"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CardImageBuy,
} from "@/components/custom/CardImageBuy";

import {
  fetchListedLands,
} from "@/lib/blockchain/fetchListedLands";


export default function ExploreListings() {
  const [
    properties,
    setProperties,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        setError("");

        const result =
          await fetchListedLands();

        console.log(
          "Active marketplace listings:",
          result
        );

        setProperties(result);

      } catch (error) {
        console.error(
          "Marketplace fetch failed:",
          error
        );

        setError(
          error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Unable to load marketplace."
        );

      } finally {
        setLoading(false);
      }
    }


    loadListings();

  }, []);


  if (loading) {
    return (
      <div className="col-span-full py-16 flex flex-col items-center justify-center">

        <span className="material-symbols-outlined text-5xl text-indigo-500 animate-spin">
          progress_activity
        </span>

        <p className="mt-4 text-slate-500 font-medium">
          Reading active listings from Sepolia...
        </p>

      </div>
    );
  }


  if (error) {
    return (
      <div className="col-span-full py-12 rounded-3xl border border-rose-100 bg-rose-50/50 text-center">

        <h3 className="font-bold text-slate-800 text-xl">
          Unable to load marketplace
        </h3>

        <p className="text-slate-500 mt-2">
          {error}
        </p>

      </div>
    );
  }


  if (properties.length === 0) {
    return (
      <div className="col-span-full py-14 rounded-3xl bg-slate-50 border border-slate-100 border-dashed text-center">

        <span className="material-symbols-outlined text-6xl text-slate-300">
          landscape
        </span>

        <h3 className="text-xl font-bold text-slate-700 mt-4">
          No Properties Listed
        </h3>

        <p className="text-slate-500 mt-2">
          There are currently no active Terryn marketplace listings.
        </p>

      </div>
    );
  }


  return properties.map(
    (property) => (
      <CardImageBuy
        key={
          `${property.nftAddress}-${property.tokenId}`
        }
        property={
          property
        }
      />
    )
  );
}