'use client';

import { useState, useEffect, Suspense } from 'react';
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/explore';
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: true });

  useEffect(() => {
    getProfileCookie().then((profile) => {
      if (profile) {
        router.replace(callbackUrl);
      }
    });
  }, [router, callbackUrl]);
  const [showCreateAccountPrompt, setShowCreateAccountPrompt] = useState(false);
  
  // Pending authentication state
  const [pendingAadhar, setPendingAadhar] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/auth` 
    : 'http://127.0.0.1:8000/api/auth';

  useEffect(() => {
    // --- DIGILOCKER CALLBACK HANDLING ---
    const savedVerificationId = sessionStorage.getItem('digilocker_verification_id');
    const savedAadhar = sessionStorage.getItem('pending_aadhar');
    
    if (savedVerificationId && savedAadhar) {
      showMessage("Verifying Digilocker session...", false);
      setIsProcessing(true);
      setAadhaar(savedAadhar);
      
      sessionStorage.removeItem('digilocker_verification_id');
      sessionStorage.removeItem('pending_aadhar');
      
      fetch(`${API_BASE_URL}/digilocker-callback/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({ 
            verification_id: savedVerificationId,
            aadhar_number: savedAadhar
        })
      })
      .then(res => res.json())
      .then(async (data) => {
        if (data.access) {
            await setAuthCookies(data.access, data.refresh);
            showMessage("Account Created & Verified Successfully!", false);
            router.push(callbackUrl);
        } else {
            showMessage(data.error || "Digilocker verification failed.");
            setIsProcessing(false);
        }
      })
      .catch(err => {
        showMessage("Error reaching verification server.");
        setIsProcessing(false);
      });
    }
  }, [router]);

  function showMessage(text, isError = true) {
    setMessage({ text, isError });
  }

  const formatAadhaar = (val) => {
    let cleanVal = val.replace(/\D/g, '').slice(0, 12);
    let formattedValue = '';
    for(let i=0; i<cleanVal.length; i++) {
        if(i > 0 && i % 4 === 0) formattedValue += ' ';
        formattedValue += cleanVal[i];
    }
    return formattedValue;
  };

  const handleAadhaarChange = (e) => {
    setAadhaar(formatAadhaar(e.target.value));
  };

  const handleContinue = async () => {
    const rawAadhar = aadhaar.replace(/\s/g, '');
    if (rawAadhar.length !== 12) {
      showMessage('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    setIsProcessing(true);
    setMessage({ text: '', isError: true });
    setShowCreateAccountPrompt(false);

    try {
      const response = await fetch(`${API_BASE_URL}/check-aadhar/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aadhar_number: rawAadhar })
      });

      const data = await response.json();

      if (data.exists) {
          setPendingAadhar(rawAadhar);
          setShowOtp(true);
          setIsProcessing(false);
      } else {
          setPendingAadhar(rawAadhar);
          setShowCreateAccountPrompt(true);
          setIsProcessing(false);
      }
    } catch (error) {
        showMessage("Error connecting to backend.");
        setIsProcessing(false);
    }
  };

  const handleCreateAccount = async () => {
      setIsProcessing(true);
      showMessage("Initializing secure Digilocker setup...", false);
      
      try {
          const urlResponse = await fetch(`${API_BASE_URL}/digilocker-url/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  user_flow: 'signup',
                  redirection_url: window.location.href
              })
          });
          const urlData = await urlResponse.json();
          
          if (urlResponse.ok && urlData.url) {
              sessionStorage.setItem('digilocker_verification_id', urlData.verification_id);
              sessionStorage.setItem('pending_aadhar', pendingAadhar);
              
              setTimeout(() => {
                  window.location.href = urlData.url;
              }, 1000);
          } else {
              showMessage(urlData.error || "Failed to initialize Digilocker. Please try again.");
              setIsProcessing(false);
          }
      } catch (error) {
          showMessage("Error connecting to backend.");
          setIsProcessing(false);
      }
  };

  const handleVerifyOtp = async () => {
    if(otp.length !== 6) {
        showMessage("Please enter a valid 6-digit OTP.");
        return;
    }

    setIsProcessing(true);
    setMessage({ text: '', isError: true });

    try {
        const response = await fetch(`${API_BASE_URL}/verify-otp/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'omit',
            body: JSON.stringify({ 
                aadhar_number: pendingAadhar,
                otp: otp 
            })
        });

        const data = await response.json();

        if (response.ok) {
            await setAuthCookies(data.access, data.refresh);
            showMessage("Login Successful!", false);
            
            setTimeout(() => {
                router.push(callbackUrl);
            }, 1000);
        } else {
            showMessage(data.error || "Invalid OTP.");
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
          <span className="material-symbols-outlined text-white text-2xl">account_balance</span>
        </div>
      </div>
      
      <div className="absolute bottom-32 left-[10%] sm:left-[20%] hidden sm:flex flex-col items-center gap-2 opacity-80 animate-float-reverse">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500/30 to-teal-500/30 border border-white/20 backdrop-blur-md flex items-center justify-center -rotate-12 shadow-lg shadow-emerald-500/20">
          <span className="material-symbols-outlined text-white text-xl">gavel</span>
        </div>
      </div>

      <div className="absolute top-1/3 right-[5%] sm:right-[15%] hidden sm:flex flex-col items-center gap-2 opacity-90 animate-float-slow">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-bl from-blue-500/30 to-indigo-500/30 border border-white/20 backdrop-blur-md flex items-center justify-center -rotate-6 shadow-lg shadow-blue-500/20">
          <span className="material-symbols-outlined text-white text-3xl">fingerprint</span>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10 w-full perspective-1000">
        
        {/* --- LOGIN CARD WITH PURE CSS ENTRANCE TRANSITION --- */}
        <div className="bg-white/90 backdrop-blur-2xl border border-white/30 shadow-2xl shadow-indigo-900/40 rounded-[2rem] w-full max-w-md overflow-hidden relative group animate-fade-in-up">
          
          <div className="p-8 pb-6 text-center mt-4 relative">
            <div className="relative w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl mx-auto flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3 border border-slate-700">
              <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-white text-4xl">real_estate_agent</span>
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-2 text-slate-900 ${lobster.className}`}>
              Terryn<span className="text-indigo-600">.in</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-[280px] mx-auto font-medium mt-1">
              Unified portal for secure land registration & transactions.
            </p>
          </div>

          <div className="px-8 pb-10 flex-1 flex flex-col justify-center">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              <div className="space-y-5">
                <div className="animate-fade-in-up-small animation-delay-200">
                  <label htmlFor="aadhaar" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Aadhaar Number
                  </label>
                  <div className="relative rounded-xl shadow-sm group/input">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-slate-400 text-[20px] group-focus-within/input:text-indigo-500 transition-colors duration-300">badge</span>
                    </div>
                    <input
                      type="text"
                      id="aadhaar"
                      value={aadhaar}
                      onChange={handleAadhaarChange}
                      disabled={isProcessing || showOtp || showCreateAccountPrompt}
                      className="block w-full rounded-xl border border-slate-200/80 py-4 pl-12 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-base bg-white/50 backdrop-blur-sm disabled:opacity-50 outline-none transition-all duration-300 font-medium hover:bg-white"
                      placeholder="0000 0000 0000"
                      maxLength={14}
                    />
                  </div>
                </div>

                {!showOtp && !showCreateAccountPrompt && (
                  <div className="animate-fade-in-up-small animation-delay-400">
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={isProcessing}
                      className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-base py-4 px-8 rounded-xl shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_25px_-8px_rgba(79,70,229,0.5)] transition-all duration-300 active:scale-[0.98] hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer mt-2"
                    >
                      {isProcessing ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">sync</span> Authenticating...
                        </>
                      ) : (
                        <>
                          Continue
                          <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {showCreateAccountPrompt && (
                  <div className="bg-slate-50/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 mt-2 animate-fade-in-up-small shadow-inner">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <span className="material-symbols-outlined text-2xl">person_add</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Account Not Found</h3>
                    <p className="text-sm text-slate-500 text-center mb-5">
                      No account exists for this Aadhaar number. Would you like to create a new account using Digilocker?
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateAccountPrompt(false);
                          setMessage({ text: '', isError: false });
                        }}
                        disabled={isProcessing}
                        className="flex-1 bg-white text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 border border-slate-200 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateAccount}
                        disabled={isProcessing}
                        className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessing ? 'Processing...' : 'Proceed'}
                      </button>
                    </div>
                  </div>
                )}

                {showOtp && (
                  <div className="bg-indigo-50/70 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100 mt-2 animate-fade-in-up-small shadow-inner">
                    <label htmlFor="otp" className="block text-sm font-bold text-slate-700 mb-2 text-center">
                      Enter Security Code
                    </label>
                    <p className="text-xs text-slate-500 text-center mb-4">6-digit OTP sent to your registered mobile</p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        maxLength={6}
                        disabled={isProcessing}
                        className="block w-full rounded-xl border border-slate-200 py-3 text-center text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-xl tracking-[0.5em] bg-white outline-none font-bold transition-all duration-300"
                        placeholder="------"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isProcessing || otp.length !== 6}
                        className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all duration-300 flex-shrink-0 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
                      >
                        {isProcessing ? '...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}

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
              <span className="material-symbols-outlined text-[18px] text-indigo-500 group-hover/trust:scale-110 transition-transform duration-300">shield_lock</span>
              Identity verified securely via <strong className="text-slate-700">UIDAI Digilocker</strong>
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

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
