"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";


export default function OTPPage() {

  const router =
    useRouter();


  const params =
    useParams();


  const [
    otp,
    setOtp,
  ] = useState("");


  const [
    payment,
    setPayment,
  ] = useState(null);


  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {

    const stored =
      sessionStorage.getItem(
        "terrynPayment"
      );


    if (!stored) {

      router.push(
        "/explore"
      );

      return;
    }


    try {

      setPayment(
        JSON.parse(
          stored
        )
      );


    } catch {

      router.push(
        "/explore"
      );
    }

  }, [router]);



  function verifyOTP() {

    setError("");


    if (
      otp !==
      "123456"
    ) {

      setError(
        "Invalid OTP. For this demo use 123456."
      );

      return;
    }


    sessionStorage.setItem(
      "terrynPaymentVerified",
      "true"
    );


    router.push(
      `/payment/${params.slug}/success`
    );
  }



  if (!payment) {

    return (

      <main className="min-h-screen flex items-center justify-center bg-slate-100">

        Loading...

      </main>

    );
  }



  return (

    <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">


      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center border border-slate-100">


        <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto">


          <span className="material-symbols-outlined text-3xl">

            lock

          </span>


        </div>



        <h1 className="text-2xl font-bold text-slate-900 mt-6">

          OTP Verification

        </h1>



        <p className="text-slate-500 mt-2">

          Enter the dummy OTP to authorize your simulated payment.

        </p>



        <div className="mt-6 bg-slate-50 rounded-xl p-4">


          <p className="text-sm text-slate-500">

            Amount

          </p>


          <p className="text-2xl font-bold text-slate-900">

            ₹
            {
              Number(
                payment.priceInINR
              )
                .toLocaleString(
                  "en-IN"
                )
            }

          </p>

        </div>



        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={
            otp
          }
          onChange={(e) => {

            const value =
              e.target.value
                .replace(
                  /\D/g,
                  ""
                );


            setOtp(
              value
            );

          }}
          placeholder="------"
          className="
            w-full
            mt-6
            h-16
            border
            border-slate-200
            rounded-xl
            text-center
            text-2xl
            tracking-[0.5em]
            font-bold
            outline-none
            focus:border-blue-600
            focus:ring-4
            focus:ring-blue-600/10
          "
        />



        {error && (

          <p className="text-rose-600 text-sm mt-4">

            {error}

          </p>

        )}



        <button
          onClick={
            verifyOTP
          }
          className="
            w-full
            h-14
            mt-6
            rounded-xl
            bg-[#072654]
            hover:bg-[#0c397a]
            text-white
            font-bold
            transition-all
          "
        >

          Verify & Pay

        </button>



        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-3">


          <p className="text-xs font-bold text-amber-700">

            DEMO OTP

          </p>


          <p className="text-lg font-mono font-bold text-amber-800 mt-1">

            123456

          </p>


          <p className="text-[11px] text-amber-600 mt-1">

            No actual banking transaction occurs.

          </p>

        </div>

      </div>

    </main>

  );
}