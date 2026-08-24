"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";


export default function PaymentSuccessPage() {

    const router =
        useRouter();


    const alreadyCalled =
        useRef(false);


    const [
        state,
        setState,
    ] = useState(
        "settling"
    );


    const [
        payment,
        setPayment,
    ] = useState(null);


    const [
        txHash,
        setTxHash,
    ] = useState("");


    const [
        error,
        setError,
    ] = useState("");



    useEffect(() => {

        async function settlePurchase() {

            // Prevent React Strict Mode
            // triggering duplicate buy transactions.

            if (
                alreadyCalled.current
            ) {
                return;
            }


            alreadyCalled.current =
                true;


            try {

                // ====================================================
                // VERIFY DEMO PAYMENT
                // ====================================================

                const verified =
                    sessionStorage.getItem(
                        "terrynPaymentVerified"
                    );


                if (
                    verified !==
                    "true"
                ) {

                    throw new Error(
                        "Payment verification session is missing."
                    );
                }



                // ====================================================
                // GET PAYMENT DATA
                // ====================================================

                const stored =
                    sessionStorage.getItem(
                        "terrynPayment"
                    );


                if (!stored) {

                    throw new Error(
                        "Payment information was not found."
                    );
                }


                const paymentData =
                    JSON.parse(
                        stored
                    );


                setPayment(
                    paymentData
                );



                // ====================================================
                // CALL NODE RELAYER
                // ====================================================

                const response =
                    await fetch(
                        "https://terryn-relayer-api-4d62eca847a4.herokuapp.com/buy",
                        {
                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                /*
                                 * DEMO ONLY.
                                 *
                                 * Don't expose this in production.
                                 */

                                "x-api-key":"2c4cb3bdd1e323ca8583ff7c5417ccc0b5815c1a9b100eada07f992ab48a0585",

                            },

                            body:
                                JSON.stringify({

                                    buyerAddress:
                                        paymentData
                                            .buyerAddress,

                                    tokenId:
                                        paymentData
                                            .tokenId,

                                    transactionId:
                                        `DEMO-${Date.now()}`,

                                }),

                        }
                    );



                const result =
                    await response.json();



                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.error ||
                        "Blockchain settlement failed."
                    );
                }



                // ====================================================
                // SUCCESS
                // ====================================================

                setTxHash(
                    result.txHash
                );


                setState(
                    "success"
                );


                // Remove verification flag.

                sessionStorage.removeItem(
                    "terrynPaymentVerified"
                );


                sessionStorage.removeItem(
                    "terrynDummyAccount"
                );



            } catch (error) {

                console.error(
                    "Purchase settlement failed:",
                    error
                );


                setError(
                    error?.message ||
                    "Blockchain ownership transfer failed."
                );


                setState(
                    "failed"
                );
            }
        }


        settlePurchase();

    }, []);



    // ==========================================================
    // BLOCKCHAIN PROCESSING
    // ==========================================================

    if (
        state ===
        "settling"
    ) {

        return (

            <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">


                <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10 text-center">


                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">


                        <span className="material-symbols-outlined text-5xl">

                            check_circle

                        </span>


                    </div>



                    <h1 className="text-3xl font-extrabold text-slate-900 mt-6">

                        Payment Successful

                    </h1>



                    <p className="text-slate-500 mt-3">

                        Your simulated payment was successful.

                    </p>



                    <div className="mt-8 flex items-center justify-center gap-3">


                        <span className="material-symbols-outlined text-indigo-600 animate-spin">

                            progress_activity

                        </span>


                        <span className="font-semibold text-slate-700">

                            Transferring digital ownership...

                        </span>


                    </div>



                    <p className="text-xs text-slate-400 mt-6">

                        The Terryn relayer is submitting the transaction and paying the Sepolia gas fee.

                    </p>


                </div>

            </main>

        );
    }



    // ==========================================================
    // FAILED
    // ==========================================================

    if (
        state ===
        "failed"
    ) {

        return (

            <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">


                <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10 text-center">


                    <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">


                        <span className="material-symbols-outlined text-5xl">

                            error

                        </span>


                    </div>



                    <h1 className="text-3xl font-extrabold text-slate-900 mt-6">

                        Settlement Failed

                    </h1>



                    <p className="text-slate-500 mt-3">

                        The demo payment succeeded, but blockchain ownership transfer could not be completed.

                    </p>



                    <div className="mt-6 bg-rose-50 border border-rose-100 rounded-xl p-4 text-rose-600 text-sm">

                        {error}

                    </div>



                    <button
                        onClick={() =>
                            router.push(
                                "/explore"
                            )
                        }
                        className="w-full mt-7 h-14 bg-slate-900 text-white rounded-xl font-bold"
                    >

                        Return to Marketplace

                    </button>


                </div>

            </main>

        );
    }



    // ==========================================================
    // SUCCESS
    // ==========================================================

    return (

        <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">


            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10 text-center">


                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">


                    <span className="material-symbols-outlined text-5xl">

                        verified

                    </span>


                </div>



                <h1 className="text-3xl font-extrabold text-slate-900 mt-6">

                    Purchase Complete

                </h1>



                <p className="text-slate-500 mt-3">

                    Payment was successful and the land NFT has been transferred to your wallet.

                </p>



                {
                    payment && (

                        <div className="mt-6 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left">


                            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">

                                New Owner

                            </p>


                            <p className="font-mono text-xs break-all text-slate-700 mt-2">

                                {
                                    payment.buyerAddress
                                }

                            </p>


                            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-5">

                                Token ID

                            </p>


                            <p className="font-bold text-slate-800 mt-1">

                                #
                                {
                                    payment.tokenId
                                }

                            </p>


                        </div>

                    )
                }



                {
                    txHash && (

                        <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-left">


                            <p className="text-xs uppercase tracking-widest text-indigo-500 font-bold">

                                Blockchain Transaction

                            </p>


                            <p className="font-mono text-xs break-all text-indigo-800 mt-2">

                                {txHash}

                            </p>


                        </div>

                    )
                }



                <div className="flex flex-col sm:flex-row gap-3 mt-7">


                    <button
                        onClick={() => {

                            sessionStorage.removeItem(
                                "terrynPayment"
                            );


                            router.push(
                                "/profile"
                            );

                        }}
                        className="flex-1 h-14 bg-slate-900 text-white rounded-xl font-bold"
                    >

                        View My Property

                    </button>



                    <button
                        onClick={() => {

                            sessionStorage.removeItem(
                                "terrynPayment"
                            );


                            router.push(
                                "/explore"
                            );

                        }}
                        className="flex-1 h-14 border border-slate-200 rounded-xl font-bold text-slate-700"
                    >

                        Marketplace

                    </button>


                </div>



                <p className="mt-6 text-xs text-slate-400">

                    DEMO PAYMENT — No real financial transaction occurred.

                </p>


            </div>

        </main>

    );
}