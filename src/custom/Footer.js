import Link from "next/link";

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



export default function Footer() {
  return (
    <footer className="w-full bg-black text-[#FCFCFC]">
     
      <div className="mx-auto w-[92%] py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
         
          <div className="lg:col-span-2">
            <h2 className={`text-3xl font-bold tracking-tight ${lobster.className}`}> 
              Terryn<span className="text-[#FCFCFC]/60">.in</span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#FCFCFC]/70">
              A blockchain-based land record management platform and verified
              marketplace designed to make property ownership secure,
              transparent and trustworthy.
            </p>
          </div>

         
          <div>
            <h3 className={`mb-5 text-sm font-semibold uppercase tracking-wider ${baloo.className}`}>
              Platform
            </h3>

            <div className="flex flex-col gap-3 text-sm text-[#FCFCFC]/70">
              <Link href="/marketplace" className="transition hover:text-white">
                Marketplace
              </Link>

              <Link
                href="/land-records"
                className="transition hover:text-white"
              >
                Land Records
              </Link>

              <Link href="/verify" className="transition hover:text-white">
                Verify Property
              </Link>

              <Link href="/dashboard" className="transition hover:text-white">
                Dashboard
              </Link>
            </div>
          </div>

         
          <div>
            <h3 className={`mb-5 text-sm font-semibold uppercase tracking-wider ${baloo.className}`}>  
              Company
            </h3>

            <div className="flex flex-col gap-3 text-sm text-[#FCFCFC]/70">
              <Link href="/about" className="transition hover:text-white">
                About Terryn
              </Link>

              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>

              <Link href="/privacy" className="transition hover:text-white">
                Privacy Policy
              </Link>

              <Link href="/terms" className="transition hover:text-white">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

       
        <div className="my-10 h-px w-full bg-white/15" />

       
        <div className="flex flex-col gap-4 text-sm text-[#FCFCFC]/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Terryn.in. All rights reserved.</p>

          <p>Secure Records. Verified Ownership. Trusted Transactions.</p>
        </div>
      </div>
    </footer>
  );
}
