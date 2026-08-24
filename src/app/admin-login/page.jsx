'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthCookies, getProfileCookie } from '../actions/auth';
import { Outfit, Lobster } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
});

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
});

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin-dashboard';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: true });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/auth` 
    : 'http://127.0.0.1:8000/api/auth';

  useEffect(() => {
    getProfileCookie().then((profile) => {
      if (profile) {
        router.replace('/admin-dashboard');
      }
    });
  }, [router]);

  function showMessage(text, isError = true) {
    setMessage({ text, isError });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showMessage('Please enter both employee ID and password.');
      return;
    }

    setIsProcessing(true);
    setMessage({ text: '', isError: true });

    try {
      const response = await fetch(`${API_BASE_URL}/admin-login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
          await setAuthCookies(data.access, data.refresh);
          showMessage("Admin Login Successful!", false);
          setTimeout(() => {
            router.push(callbackUrl); 
          }, 1000);
      } else {
          showMessage(data.error || "Invalid credentials or unauthorized access.");
          setIsProcessing(false);
      }
    } catch (error) {
        showMessage("Error connecting to backend.");
        setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-800 flex flex-col relative overflow-hidden ${outfit.className}`}>
      
      {/* --- HARDWARE-ACCELERATED CSS ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-reverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-40px) rotate(-10deg) scale(1.1); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; will-change: transform; }
        .animate-float-reverse { animation: float-reverse 8s ease-in-out infinite; will-change: transform; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; will-change: transform; }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes fade-in-up-small {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-up-small {
          opacity: 0;
          animation: fade-in-up-small 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animation-delay-200 { animation-delay: 150ms; }
        .animation-delay-400 { animation-delay: 300ms; }
        .animation-delay-600 { animation-delay: 450ms; }

        /* Prevent autofill from overriding transparent background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            transition: background-color 5000s ease-in-out 0s !important;
            -webkit-text-fill-color: #1e293b !important; /* text-slate-800 */
        }
      `}} />

      {/* --- STATIC BACKGROUND ORBS (Optimized for performance) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none"></div>

      {/* --- WIREFRAME CUBE TEXTURE --- */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.25] pointer-events-none"></div>

      {/* --- FLOATING UI ELEMENTS (Small animated frames) --- */}
      <div className="absolute top-32 left-[10%] sm:left-[15%] hidden sm:flex flex-col items-center gap-2 opacity-90 animate-float">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 border border-white/20 backdrop-blur-md flex items-center justify-center rotate-12 shadow-lg shadow-indigo-500/20">
          <span className="material-symbols-outlined text-white text-2xl">shield_person</span>
        </div>
      </div>
      
      <div className="absolute bottom-32 left-[10%] sm:left-[20%] hidden sm:flex flex-col items-center gap-2 opacity-80 animate-float-reverse">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500/30 to-teal-500/30 border border-white/20 backdrop-blur-md flex items-center justify-center -rotate-12 shadow-lg shadow-emerald-500/20">
          <span className="material-symbols-outlined text-white text-xl">admin_panel_settings</span>
        </div>
      </div>

      <div className="absolute top-1/3 right-[5%] sm:right-[15%] hidden sm:flex flex-col items-center gap-2 opacity-90 animate-float-slow">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-bl from-blue-500/30 to-indigo-500/30 border border-white/20 backdrop-blur-md flex items-center justify-center -rotate-6 shadow-lg shadow-blue-500/20">
          <span className="material-symbols-outlined text-white text-3xl">verified</span>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10 w-full perspective-1000">
        
        {/* --- LOGIN CARD WITH PURE CSS ENTRANCE TRANSITION --- */}
        <div className="bg-white/90 backdrop-blur-2xl border border-white/30 shadow-2xl shadow-indigo-900/40 rounded-[2rem] w-full max-w-md overflow-hidden relative group animate-fade-in-up">
          
          <div className="p-8 pb-6 text-center mt-4 relative">
            <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-800 to-indigo-950 rounded-2xl mx-auto flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3 border border-indigo-700">
              <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 to-white text-4xl">local_police</span>
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-2 text-slate-900 ${lobster.className}`}>
              Terryn<span className="text-indigo-600">.in</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-[280px] mx-auto font-medium mt-1">
              Revenue Official / Administrator Portal
            </p>
          </div>

          <div className="px-8 pb-10 flex-1 flex flex-col justify-center">
            <form className="space-y-6" onSubmit={handleLogin}>
              
              <div className="space-y-5">
                <div className="animate-fade-in-up-small animation-delay-200">
                  <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Employee ID
                  </label>
                  <div className="relative rounded-xl shadow-sm group/input">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-slate-400 text-[20px] group-focus-within/input:text-indigo-500 transition-colors duration-300">badge</span>
                    </div>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isProcessing}
                      className="block w-full rounded-xl border border-slate-200/80 py-4 pl-12 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-base bg-white/50 backdrop-blur-sm disabled:opacity-50 outline-none transition-all duration-300 font-medium hover:bg-white"
                      placeholder="e.g. RI-4501"
                    />
                  </div>
                </div>

                <div className="animate-fade-in-up-small animation-delay-400">
                  <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Password
                  </label>
                  <div className="relative rounded-xl shadow-sm group/input">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-slate-400 text-[20px] group-focus-within/input:text-indigo-500 transition-colors duration-300">lock</span>
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isProcessing}
                      className="block w-full rounded-xl border border-slate-200/80 py-4 pl-12 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-base bg-white/50 backdrop-blur-sm disabled:opacity-50 outline-none transition-all duration-300 font-medium hover:bg-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="animate-fade-in-up-small animation-delay-600">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-base py-4 px-8 rounded-xl shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_25px_-8px_rgba(79,70,229,0.5)] transition-all duration-300 active:scale-[0.98] hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer mt-2"
                  >
                    {isProcessing ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">sync</span> Authenticating...
                      </>
                    ) : (
                      <>
                        Login as Admin
                        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>

                {message.text && (
                  <div className={`text-sm font-bold mt-2 text-center p-3 rounded-xl border animate-fade-in-up-small ${message.isError ? 'bg-red-50 text-red-600 border-red-100 shadow-sm' : 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm'}`}>
                    {message.text}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Trust Footer */}
          <div className="bg-slate-50/80 py-5 px-6 text-center border-t border-slate-100/50 backdrop-blur-md">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium group/trust cursor-default">
              <span className="material-symbols-outlined text-[18px] text-indigo-500 group-hover/trust:scale-110 transition-transform duration-300">security</span>
              Internal Access Only
            </p>
          </div>
        </div>
      </main>

      {/* Global Footer (Simplified for Login) */}
      <footer className="py-6 px-4 md:px-8 z-20 relative text-center pb-8 animate-fade-in-up-small animation-delay-600">
         <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-400">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-1.5 px-4 rounded-full backdrop-blur-md hover:bg-white/10 transition-colors duration-300 cursor-default">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">verified_user</span> 
              Secure Node Active
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-1.5 px-4 rounded-full backdrop-blur-md hover:bg-white/10 transition-colors duration-300 cursor-default">
              <span className="material-symbols-outlined text-[14px] text-slate-300">lock</span> 
              E2E Encrypted
            </span>
         </div>
      </footer>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
