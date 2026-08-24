"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";
import PropertyMapClient from "@/components/custom/PropertyMapClient";

import {
  fetchLandByTokenId,
} from "@/lib/blockchain/fetchLandByTokenId";

import {
  getListing,
} from "@/lib/blockchain/marketplace";


export default function BuyAssetClient({
  tokenId,
}) {

  const router =
    useRouter();

  const [
    property,
    setProperty,
  ] = useState(null);

  const [
    listing,
    setListing,
  ] = useState(null);

  const [
    buyerWallet,
    setBuyerWallet,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // LOAD NFT + LISTING + WALLET
  // ==========================================================

  useEffect(() => {

    async function loadProperty() {

      try {

        setLoading(true);
        setError("");


        if (!window.ethereum) {

          throw new Error(
            "MetaMask is required."
          );
        }


        const accounts =
          await window.ethereum.request({
            method:
              "eth_accounts",
          });


        if (
          !accounts ||
          accounts.length === 0
        ) {

          throw new Error(
            "Please connect your MetaMask wallet."
          );
        }


        const wallet =
          accounts[0];


        setBuyerWallet(
          wallet
        );


        const [
          land,
          currentListing,
        ] =
          await Promise.all([

            fetchLandByTokenId(
              tokenId
            ),

            getListing(
              tokenId
            ),

          ]);


        if (
          !currentListing.active
        ) {

          throw new Error(
            "This property is no longer listed."
          );
        }


        // Prevent seller buying own NFT

        if (
          currentListing.seller
            .toLowerCase() ===
          wallet.toLowerCase()
        ) {

          throw new Error(
            "You cannot buy your own property."
          );
        }


        setProperty(
          land
        );


        setListing(
          currentListing
        );


      } catch (error) {

        console.error(
          "Buy page error:",
          error
        );


        setError(
          error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Unable to load property."
        );


      } finally {

        setLoading(false);
      }
    }


    loadProperty();

  }, [tokenId]);


  // ==========================================================
  // ACCOUNT CHANGE
  // ==========================================================

  useEffect(() => {

    function handleAccountsChanged(
      accounts
    ) {

      if (
        accounts &&
        accounts.length > 0
      ) {

        setBuyerWallet(
          accounts[0]
        );


        // Reload so seller check
        // happens again.

        window.location.reload();

      } else {

        setBuyerWallet("");

        setError(
          "Wallet disconnected."
        );
      }
    }


    window.ethereum?.on(
      "accountsChanged",
      handleAccountsChanged
    );


    return () => {

      window.ethereum?.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };

  }, []);


  // ==========================================================
  // START FAKE PAYMENT
  // ==========================================================

  async function handleBuy() {

    try {

      setError("");


      if (!window.ethereum) {

        throw new Error(
          "MetaMask is required."
        );
      }


      const accounts =
        await window.ethereum.request({
          method:
            "eth_accounts",
      });


      if (
        !accounts ||
        accounts.length === 0
      ) {

        throw new Error(
          "Please connect your wallet."
        );
      }


      const currentBuyer =
        accounts[0];


      if (!listing?.active) {

        throw new Error(
          "This property is no longer available."
        );
      }


      if (
        listing.seller
          .toLowerCase() ===
        currentBuyer
          .toLowerCase()
      ) {

        throw new Error(
          "You cannot buy your own property."
        );
      }


      // Store payment session

      const paymentData = {

        buyerAddress:
          currentBuyer,

        tokenId:
          tokenId.toString(),

        priceInINR:
          listing.priceInINR,

        sellerAddress:
          listing.seller,

        landId:
          property.land_id,

        propertyName:
          property.name,

        district:
          property.district,

        state:
          property.state,

        image:
          property.land_photo,

      };


      sessionStorage.setItem(
        "terrynPayment",
        JSON.stringify(
          paymentData
        )
      );


      // Go to fake checkout

      router.push(
        `/payment/${tokenId}`
      );


    } catch (error) {

      setError(
        error?.message ||
        "Unable to start payment."
      );
    }
  }



  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div className="min-h-screen flex flex-col bg-slate-50">

        <Navbar />


        <main className="flex-1 flex flex-col items-center justify-center">

          <span className="material-symbols-outlined text-6xl text-indigo-500 animate-spin">
            progress_activity
          </span>


          <p className="mt-4 text-slate-500 font-semibold">

            Loading property...

          </p>

        </main>


        <Footer />

      </div>

    );
  }



  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error &&
    !property
  ) {

    return (

      <div className="min-h-screen flex flex-col bg-slate-50">

        <Navbar />


        <main className="flex-1 flex items-center justify-center px-6">

          <div className="bg-white border border-rose-100 rounded-3xl p-10 max-w-lg w-full text-center">

            <span className="material-symbols-outlined text-6xl text-rose-400">

              error

            </span>


            <h2 className="text-2xl font-bold mt-4">

              Property Unavailable

            </h2>


            <p className="text-slate-500 mt-3">

              {error}

            </p>

          </div>

        </main>


        <Footer />

      </div>

    );
  }



  return (

    <div className="min-h-screen flex flex-col bg-slate-50">

      <Navbar />


      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 mt-[80px]">


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


          {/* ==================================================
              IMAGE
          ================================================== */}

          <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm">

            <img
              src={
                property.land_photo ||
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
              }
              alt={
                property.name ||
                "Terryn Property"
              }
              className="w-full h-[450px] object-cover rounded-2xl"
            />

          </div>



          {/* ==================================================
              DETAILS
          ================================================== */}

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">


            <p className="text-xs uppercase tracking-widest text-indigo-600 font-bold">

              Token #{tokenId}

            </p>


            <h1 className="text-4xl font-extrabold mt-2 text-slate-900">

              {
                property.name ||
                `Terryn Land #${tokenId}`
              }

            </h1>


            <p className="text-slate-500 mt-3">

              {property.district},{" "}
              {property.state}

            </p>



            <div className="mt-8 space-y-4 text-slate-700">


              <p>

                Land ID:{" "}

                <strong>

                  {
                    property.land_id
                  }

                </strong>

              </p>


              <p>

                Type:{" "}

                <strong>

                  {
                    property.land_type
                  }

                </strong>

              </p>


              <p>

                Area:{" "}

                <strong>

                  {
                    property.area
                  } sq.ft

                </strong>

              </p>


              <p>

                Landmark:{" "}

                <strong>

                  {
                    property.landmark ||
                    "N/A"
                  }

                </strong>

              </p>

            </div>



            {/* PRICE */}

            <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">


              <p className="text-xs uppercase tracking-widest font-bold text-emerald-600">

                Asking Price

              </p>


              <p className="text-4xl font-extrabold text-emerald-700 mt-1">

                ₹
                {
                  Number(
                    listing.priceInINR
                  )
                    .toLocaleString(
                      "en-IN"
                    )
                }

              </p>

            </div>



            {/* BUY BUTTON */}

            <button
              onClick={
                handleBuy
              }
              disabled={
                !listing?.active
              }
              className="
                w-full
                mt-6
                h-14
                rounded-xl
                bg-slate-900
                hover:bg-indigo-600
                text-white
                font-bold
                transition-all
                disabled:opacity-50
              "
            >

              Buy Property

            </button>



            {error && (

              <p className="text-rose-600 text-sm mt-4">

                {error}

              </p>

            )}

          </div>

        </div>



        {/* ==================================================
            MAP
        ================================================== */}

        {
          property.geo_lat !== null &&
          property.geo_lng !== null && (

            <div className="mt-8 h-[400px] bg-white rounded-3xl p-3 border border-slate-100">

              <PropertyMapClient
                latitude={
                  Number(
                    property.geo_lat
                  )
                }
                longitude={
                  Number(
                    property.geo_lng
                  )
                }
                landId={
                  property.land_id
                }
              />

            </div>

          )
        }

      </main>


      <Footer />

    </div>

  );
}