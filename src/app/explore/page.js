import Navbar from "@/components/custom/Navbar";
import { CarouselAuto } from "@/components/custom/CarouselAuto";
import { Outfit } from "next/font/google";
import Footer from "@/components/custom/Footer";
import FilterOptions from "@/components/custom/FilterOptions";

import ExploreListings from "@/components/custom/ExploreListings";


const outfit = Outfit({
  subsets: ["latin"],
});


export default function Home() {
  return (
    <div
      className={`
        min-h-screen
        flex
        flex-col
        text-slate-800
        ${outfit.className}
      `}
    >

      <Navbar />


      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 mt-[80px]">

        {/* ====================================================
            CAROUSEL
        ==================================================== */}

        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-10 p-4 relative group">

          <div className="relative w-full h-[50vh] overflow-hidden rounded-[1.5rem] flex flex-row justify-center items-center bg-slate-900">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />

            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />


            <div className="z-10 w-full h-full">
              <CarouselAuto />
            </div>

          </div>

        </div>



        {/* ====================================================
            TITLE & FILTERS
        ==================================================== */}

        <div className="flex flex-col gap-6 mb-8">

          <div>

            <div className="flex items-center gap-3 mb-2">

              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">

                <span className="material-symbols-outlined">
                  explore
                </span>

              </div>


              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Marketplace
              </span>

            </div>


            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Explore Properties
            </h1>


            <p className="text-slate-500 mt-2">
              Browse active land listings verified on the Terryn marketplace.
            </p>

          </div>


          <div className="w-full z-20">
            <FilterOptions />
          </div>

        </div>



        {/* ====================================================
            BLOCKCHAIN LISTINGS
        ==================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">

          <ExploreListings />

        </div>

      </main>


      <Footer />

    </div>
  );
}