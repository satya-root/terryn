"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function FilterOptions() {
  return (
    <div className={`w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-3 flex flex-col md:flex-row gap-3 ${outfit.className}`}>
      
      {/* Search */}
      <div className="flex-1 flex items-center bg-slate-50 border border-slate-100 hover:border-indigo-100 focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all rounded-xl px-4 h-14">
        <Search size={20} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by survey number, plot ID, or owner..."
          className="w-full h-full ml-3 bg-transparent text-slate-800 placeholder:text-slate-400 outline-none font-medium text-sm md:text-base"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* State Filter */}
        <select
          className="h-14 min-w-[160px] rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-white transition-colors px-4 text-slate-700 font-medium outline-none cursor-pointer focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 text-sm md:text-base"
        >
          <option value="">All States</option>
          <option value="odisha">Odisha</option>
          <option value="west-bengal">West Bengal</option>
          <option value="jharkhand">Jharkhand</option>
          <option value="bihar">Bihar</option>
        </select>

        {/* Property Type */}
        <select
          className="h-14 min-w-[180px] rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-white transition-colors px-4 text-slate-700 font-medium outline-none cursor-pointer focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 text-sm md:text-base"
        >
          <option value="">All Types</option>
          <option value="agricultural">Agricultural</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
        </select>

        {/* Filter Button */}
        <button
          className="h-14 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg hover:-translate-y-1 hover:shadow-xl px-6 font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <SlidersHorizontal size={19} />
          Filters
        </button>
      </div>

    </div>
  );
}