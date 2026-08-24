"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import logo from "../../../public/img/logo.svg";
import { AvatarDropdown } from "./AvatarDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { Lobster } from "next/font/google";
import { getProfileCookie } from "@/app/actions/auth";
import ConnectWallet from "@/components/blockchain/ConnectWallet";

const lobster = Lobster({
  weight: "400", // Required for non-variable fonts like Lobster
  subsets: ["latin"],
});
const outfit = Outfit({
  subsets: ["latin"],
});

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    getProfileCookie().then(data => {
      setProfile(data);
      setLoading(false);
    });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-200 py-2' : 'bg-white/40 backdrop-blur-sm border-b border-white/20 py-4'}`}>
      <div className={`max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 ${outfit.className}`}>
        <div className="flex justify-between items-center h-14">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Image
                src={logo}
                alt="Logo"
                width={40}
                height={40}
                className="w-6 h-6 md:w-8 md:h-8 invert"
              />
            </div>
            <h2 className={`text-3xl font-bold tracking-tight text-slate-900 ${lobster.className}`}> 
              Terryn<span className="text-indigo-600">.in</span>
            </h2>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            
            {profile?.role === 'REVENUE_OFFICIAL' ? (
              <Link href="/admin-dashboard" className="hover:text-indigo-600 transition-colors">Admin Dashboard</Link>
            ) : (
              <>
                <Link href="/explore" className="hover:text-indigo-600 transition-colors">Explore</Link>
                <Link href="/governance" className="hover:text-indigo-600 transition-colors">Governance</Link>
                <Link href="/submitted-entities" className="hover:text-indigo-600 transition-colors">Submissions</Link>
              </>
            )}
          </div>

          {/* Right Section (Buttons & Avatar) */}
          <div className="hidden md:flex items-center space-x-4">
            
            {!loading && profile ? (
              <>
                {profile.role === 'CITIZEN' && (
                  <ConnectWallet/>
                )}
                {profile.role !== 'REVENUE_OFFICIAL' && (
                  <Link href="/add-entity">
                    <button className="px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-bold transition-colors border border-indigo-100 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Entity
                    </button>
                  </Link>
                )}
                <div className="h-8 w-px bg-slate-200 mx-1"></div>
                <AvatarDropdown />
              </>
            ) : !loading && !profile ? (
              <div className="flex gap-3">
                
                <Link href="/login">
                  <button className="px-5 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-lg transition-colors">Login</button>
                </Link>
                <Link href="/admin-login">
                  <button className="px-5 py-2 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-lg transition-colors">Official Login</button>
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-800 hover:text-indigo-600 focus:outline-none p-2 bg-slate-50 rounded-lg border border-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl leading-none">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute w-full left-0 top-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`px-6 pt-4 pb-8 space-y-2 text-base font-semibold text-slate-700 flex flex-col ${outfit.className}`}>
          <Link href="/" className="block px-4 py-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
          
          {profile?.role === 'REVENUE_OFFICIAL' ? (
            <Link href="/admin-dashboard" className="block px-4 py-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
          ) : (
            <>
              <Link href="/explore" className="block px-4 py-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Explore</Link>
              <Link href="/governance" className="block px-4 py-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Governance</Link>
              <Link href="/submitted-entities" className="block px-4 py-3 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Submissions</Link>
            </>
          )}
          
          <div className="pt-6 mt-2 border-t border-slate-100 flex flex-col space-y-4 px-2">
            {!loading && profile ? (
              <>
                {profile.role === 'CITIZEN' && (
                  <div className="mb-2">
                    <ConnectWallet/>
                  </div>
                )}
                {profile.role !== 'REVENUE_OFFICIAL' && (
                  <Link href="/add-entity" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">add_circle</span> Add Entity
                    </button>
                  </Link>
                )}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-slate-200">
                      {profile.photo_link ? (
                        <img src={`data:image/jpeg;base64,${profile.photo_link}`} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold">
                          {profile.first_name ? profile.first_name.substring(0, 2).toUpperCase() : profile.username ? profile.username.substring(0, 2).toUpperCase() : 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-slate-800 capitalize">{profile.first_name || profile.username || 'User'}</p>
                      <p className="text-xs text-slate-500 font-medium">Logged in</p>
                    </div>
                  </div>
                </div>
              </>
            ) : !loading && !profile ? (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full py-3 bg-slate-100 text-indigo-700 rounded-xl font-bold transition-colors">Citizen Login</button>
                </Link>
                <Link href="/admin-login" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition-colors shadow-md shadow-indigo-600/20">Official Login</button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
