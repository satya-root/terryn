"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Baloo_Bhai_2 } from "next/font/google";

import { Lobster } from "next/font/google";

const lobster = Lobster({
  weight: "400", // Required for non-variable fonts like Lobster
  subsets: ["latin"],
});

const baloo = Baloo_Bhai_2({
  weight: "700", // Required for non-variable fonts like Lobster
  subsets: ["latin"],
});

export default function FilterOptions() {
  return (
    <section className="w-[90vw] mx-auto my-6 bg-black text-[#FCFCFC] rounded-2xl px-6 py-6">
      
      {/* Heading */}
      <div className="mb-5">
        <h2 className={`text-2xl font-semibold ${baloo.className}`}> 
          Find Verified Properties
        </h2>

        <p className="mt-1 text-sm font-mono text-[#FCFCFC]/60">
          Search and filter verified land records available on Terryn.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Search */}
        <div className="flex flex-1 items-center bg-[#FCF9F8] rounded-xl px-4 h-14">
          <Search
            size={20}
            className="text-black shrink-0"
          />

          <input
            type="text"
            placeholder="Search by location, property ID or owner..."
            className="
              w-full
              h-full
              ml-3
              bg-transparent
              text-black
              placeholder:text-black/40
              outline-none
            "
          />
        </div>

        {/* State Filter */}
        <select
          className="
            h-14
            min-w-[160px]
            rounded-xl
            bg-[#FCF9F8]
            px-4
            text-black
            outline-none
            cursor-pointer
          "
        >
          <option value="">State</option>
          <option value="odisha">Odisha</option>
          <option value="west-bengal">West Bengal</option>
          <option value="jharkhand">Jharkhand</option>
          <option value="bihar">Bihar</option>
        </select>

        {/* Property Type */}
        <select
          className="
            h-14
            min-w-[180px]
            rounded-xl
            bg-[#FCF9F8]
            px-4
            text-black
            outline-none
            cursor-pointer
          "
        >
          <option value="">Property Type</option>
          <option value="agricultural">Agricultural Land</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
        </select>

        {/* Filter Button */}
        <button
          className="
            h-14
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-white/30
            px-6
            font-medium
            transition
            hover:bg-[#FCF9F8]
            hover:text-black
            cursor-pointer
          "
        >
          <SlidersHorizontal size={19} />

          Filters
        </button>

      </div>
    </section>
  );
}