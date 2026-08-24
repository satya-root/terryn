import Link from "next/link";
import { Outfit } from "next/font/google";
import { Lobster } from "next/font/google";

const lobster = Lobster({
  weight: "400", // Required for non-variable fonts like Lobster
  subsets: ["latin"],
});
const outfit = Outfit({
  subsets: ["latin"],
});

export default function Footer() {
  return (
    <footer className={`w-full bg-slate-900 text-slate-300 relative overflow-hidden ${outfit.className}`}>
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-5">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-white text-[24px]">real_estate_agent</span>
                </div>
            <h2 className={`text-3xl font-bold tracking-tight ${lobster.className}`}> 
              Terryn<span className="text-[#FCFCFC]/60">.in</span>
            </h2>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400">
              A premium blockchain-based land record management platform and verified
              marketplace. Designed to make property ownership absolutely secure,
              transparent, and trustworthy for the modern digital citizen.
            </p>
            
            <div className="mt-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all cursor-pointer text-slate-400">
                <span className="material-symbols-outlined text-[18px]">language</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all cursor-pointer text-slate-400">
                <span className="material-symbols-outlined text-[18px]">hub</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all cursor-pointer text-slate-400">
                <span className="material-symbols-outlined text-[18px]">forum</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-4 lg:col-span-2 lg:col-start-7">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Platform
            </h3>
            <div className="flex flex-col gap-4 text-sm font-medium text-slate-400">
              <Link href="/marketplace" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Marketplace
              </Link>
              <Link href="/land-records" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Land Records
              </Link>
              <Link href="/verify" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Verify Property
              </Link>
              <Link href="/governance" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Governance
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">  
              Company
            </h3>
            <div className="flex flex-col gap-4 text-sm font-medium text-slate-400">
              <Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link>
              <Link href="/careers" className="hover:text-indigo-400 transition-colors">Careers</Link>
              <Link href="/press" className="hover:text-indigo-400 transition-colors">Press & Media</Link>
              <Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link>
            </div>
          </div>
          
          {/* Legal Links */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">  
              Legal
            </h3>
            <div className="flex flex-col gap-4 text-sm font-medium text-slate-400">
              <Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
              <Link href="/disclaimer" className="hover:text-indigo-400 transition-colors">Legal Disclaimer</Link>
              <Link href="/compliance" className="hover:text-indigo-400 transition-colors">Compliance</Link>
            </div>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-slate-800" />

        <div className="flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Landror. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-500">verified_user</span>
            <p>Secure Records. Verified Ownership. Trusted Transactions.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
