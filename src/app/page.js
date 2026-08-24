'use client'; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfileCookie } from '@/app/actions/auth';
import Navbar from '@/components/custom/Navbar';
import Footer from '@/components/custom/Footer';
import { Outfit } from 'next/font/google';
import AbstractCards from '@/components/custom/AbstractCards';

const outfit = Outfit({ subsets: ['latin'] });

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const profile = await getProfileCookie();
      if (profile) {
        if (profile.role === 'REVENUE_OFFICIAL') {
          router.push('/admin-dashboard');
        } else {
          router.push('/explore');
        }
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-indigo-500">progress_activity</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${outfit.className}`}>
      <Navbar />
      
      <section className="h-screen w-full bg-[#FCFCFC] flex items-center justify-center">
        <h2 className="max-md:text-[14vw] text-center text-[9vw] font-semibold leading-[.8] tracking-tight">
          Buy, sell and <br /> showcase Lands
        </h2>
      </section>

      <AbstractCards />

      <section className="h-screen w-full bg-[#FCFCFC] flex items-center justify-center">
        <img
          src="/WebsiteDummy.png"
          alt="Land"
          className="w-full h-full object-cover"
        />
      </section>

      <Footer />
    </div>
  );
}
