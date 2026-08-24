"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";


export default function PaymentPage() {

  const router =
    useRouter();


  const [
    payment,
    setPayment,
  ] = useState(null);


  const [
    selectedAccount,
    setSelectedAccount,
  ] = useState("");


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

      const parsed =
        JSON.parse(
          stored
        );


      setPayment(
        parsed
      );


    } catch {

      router.push(
        "/explore"
      );
    }

  }, [router]);



  function continuePayment() {

    if (!selectedAccount) {

      setError(
        "Please select a dummy bank account."
      );

      return;
    }


    sessionStorage.setItem(
      "terrynDummyAccount",
      selectedAccount
    );


    router.push(
      `/payment/${payment.tokenId}/otp`
    );
  }



  if (!payment) {

    return (

      <main className="min-h-screen bg-slate-100 flex items-center justify-center">

        Loading payment...

      </main>

    );
  }



  return (

    <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4 py-10">


      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="bg-[#072654] px-6 py-5 text-white">


          <div className="flex items-center justify-between">


            <div>

              <h1 className="text-xl font-bold">

                Terryn Pay

              </h1>


              <p className="text-xs text-white/60 mt-1">

                Demo Secure Checkout

              </p>

            </div>


            <span className="material-symbols-outlined">

              verified_user

            </span>

          </div>

        </div>



        <div className="p-6">


          {/* ==================================================
              DEMO WARNING
          ================================================== */}

          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-3 rounded-xl mb-6 text-center">

            DEMO PAYMENT — NO REAL MONEY WILL BE CHARGED

          </div>



          {/* ==================================================
              PROPERTY
          ================================================== */}

          <div className="flex items-center gap-4">


            {
              payment.image && (

                <img
                  src={
                    payment.image
                  }
                  alt="Property"
                  className="w-20 h-20 object-cover rounded-xl"
                />

              )
            }


            <div className="min-w-0">


              <p className="font-bold text-slate-900 truncate">

                {
                  payment.propertyName
                }

              </p>


              <p className="text-sm text-slate-500 mt-1">

                {
                  payment.landId
                }

              </p>


              <p className="text-xs text-slate-400 mt-1">

                {
                  payment.district
                },{" "}
                {
                  payment.state
                }

              </p>

            </div>

          </div>



          {/* ==================================================
              AMOUNT
          ================================================== */}

          <div className="mt-6 border-t border-slate-100 pt-6">


            <p className="text-sm text-slate-500">

              Amount Payable

            </p>


            <h2 className="text-4xl font-extrabold text-slate-900 mt-1">

              ₹
              {
                Number(
                  payment.priceInINR
                )
                  .toLocaleString(
                    "en-IN"
                  )
              }

            </h2>

          </div>



          {/* ==================================================
              ACCOUNTS
          ================================================== */}

          <h3 className="font-bold text-slate-800 mt-8 mb-4">

            Choose Payment Account

          </h3>



          <div className="space-y-3">


            {
              [
                {
                  id:
                    "sbi",

                  name:
                    "State Bank Demo",

                  number:
                    "•••• 4211",
                },

                {
                  id:
                    "hdfc",

                  name:
                    "HDFC Demo Bank",

                  number:
                    "•••• 8842",
                },

                {
                  id:
                    "icici",

                  name:
                    "ICICI Demo Bank",

                  number:
                    "•••• 1709",
                },

              ].map(
                (account) => (

                  <label
                    key={
                      account.id
                    }
                    className={`
                      flex
                      items-center
                      gap-4
                      p-4
                      border
                      rounded-xl
                      cursor-pointer
                      transition-all

                      ${
                        selectedAccount ===
                        account.id

                          ? "border-blue-600 bg-blue-50"

                          : "border-slate-200 hover:bg-slate-50"
                      }
                    `}
                  >


                    <input
                      type="radio"
                      name="account"
                      value={
                        account.id
                      }
                      checked={
                        selectedAccount ===
                        account.id
                      }
                      onChange={(e) =>
                        setSelectedAccount(
                          e.target.value
                        )
                      }
                    />


                    <div>


                      <p className="font-bold text-slate-800">

                        {
                          account.name
                        }

                      </p>


                      <p className="text-sm text-slate-500">

                        {
                          account.number
                        }

                      </p>

                    </div>


                  </label>

                )
              )
            }

          </div>



          {error && (

            <p className="text-rose-600 text-sm mt-4">

              {error}

            </p>

          )}



          {/* ==================================================
              CONTINUE
          ================================================== */}

          <button
            onClick={
              continuePayment
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

            Pay ₹
            {
              Number(
                payment.priceInINR
              )
                .toLocaleString(
                  "en-IN"
                )
            }

          </button>

        </div>

      </div>

    </main>

  );
}