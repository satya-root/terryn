'use client';

import React, { useState, useEffect } from 'react';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import exifr from 'exifr';
import { submitEntityAction } from '@/app/actions/entity';

const outfit = Outfit({ subsets: ['latin'] });
const jetbrains = JetBrains_Mono({ subsets: ['latin'] });

export default function AddEntityForm() {

  // ============================================================
  // CONNECTED WALLET
  // ============================================================

  const [ownerWallet, setOwnerWallet] = useState('');

  const [formData, setFormData] = useState({
    landType: 'residential',
    district: '',
    state: '',
    landmark: '',
    area: '',
    length: '',
    width: '',
  });

  const [files, setFiles] = useState({
    rorPdf: null,
    landPhoto: null,
  });

  const [geoData, setGeoData] = useState({
    lat: null,
    lng: null,
  });

  const [geoError, setGeoError] = useState('');
  const [isParsingGeo, setIsParsingGeo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [showConfirmModal, setShowConfirmModal] =
    useState(false);

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [previewFile, setPreviewFile] = useState(null);

  const [statesData, setStatesData] = useState([]);
  const [availableDistricts, setAvailableDistricts] =
    useState([]);

  const [isLoadingStates, setIsLoadingStates] =
    useState(true);


  // ============================================================
  // FETCH CONNECTED METAMASK WALLET
  // ============================================================

  useEffect(() => {

    const fetchConnectedWallet = async () => {

      try {

        if (
          typeof window === 'undefined' ||
          !window.ethereum
        ) {

          console.warn(
            'MetaMask is not installed'
          );

          return;
        }

        /*
         * eth_accounts DOES NOT open
         * the MetaMask connection popup.
         *
         * It only reads wallets that are
         * already connected to this website.
         */

        const accounts =
          await window.ethereum.request({
            method: 'eth_accounts',
          });

        if (accounts.length > 0) {

          setOwnerWallet(accounts[0]);

          console.log(
            'Connected Wallet:',
            accounts[0]
          );

        } else {

          setOwnerWallet('');

          console.log(
            'No wallet currently connected'
          );
        }

      } catch (error) {

        console.error(
          'Failed to fetch connected wallet:',
          error
        );
      }
    };


    fetchConnectedWallet();


    // ============================================================
    // LISTEN FOR METAMASK ACCOUNT CHANGES
    // ============================================================

    const handleAccountsChanged = (accounts) => {

      if (accounts.length > 0) {

        setOwnerWallet(accounts[0]);

        console.log(
          'Wallet changed:',
          accounts[0]
        );

      } else {

        setOwnerWallet('');

        console.log(
          'Wallet disconnected'
        );
      }
    };


    if (window.ethereum) {

      window.ethereum.on(
        'accountsChanged',
        handleAccountsChanged
      );
    }


    // Cleanup listener

    return () => {

      if (window.ethereum) {

        window.ethereum.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
      }
    };

  }, []);


  // ============================================================
  // FETCH STATES
  // ============================================================

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    fetch(`${API_BASE_URL}/records/states/`)
      .then((res) => res.json())

      .then((data) => {

        setStatesData(data);

        setIsLoadingStates(false);
      })

      .catch((err) => {

        console.error(
          'Failed to load states',
          err
        );

        setIsLoadingStates(false);
      });

  }, []);


  // ============================================================
  // UPDATE DISTRICTS WHEN STATE CHANGES
  // ============================================================

  useEffect(() => {

    if (
      formData.state &&
      statesData.length > 0
    ) {

      const selectedState =
        statesData.find(
          (s) =>
            s.name === formData.state
        );


      if (selectedState) {

        setAvailableDistricts(
          selectedState.districts
        );


        if (
          !selectedState.districts.find(
            (d) =>
              d.name === formData.district
          )
        ) {

          setFormData((prev) => ({
            ...prev,
            district: '',
          }));
        }
      }

    } else {

      setAvailableDistricts([]);
    }

  }, [
    formData.state,
    statesData,
    formData.district,
  ]);


  // ============================================================
  // AUTO CALCULATE AREA
  // ============================================================

  useEffect(() => {

    const l =
      parseFloat(formData.length);

    const w =
      parseFloat(formData.width);


    if (
      !isNaN(l) &&
      !isNaN(w)
    ) {

      setFormData((prev) => ({
        ...prev,
        area: (l * w).toFixed(2),
      }));

    } else {

      setFormData((prev) => ({
        ...prev,
        area: '',
      }));
    }

  }, [
    formData.length,
    formData.width,
  ]);


  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleInputChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ============================================================
  // PDF UPLOAD
  // ============================================================

  const handlePdfUpload = (e) => {

    if (
      e.target.files &&
      e.target.files[0]
    ) {

      setFiles((prev) => ({
        ...prev,
        rorPdf:
          e.target.files[0],
      }));
    }
  };


  // ============================================================
  // LAND PHOTO + GPS EXTRACTION
  // ============================================================

  const handlePhotoUpload =
    async (e) => {

      const file =
        e.target.files[0];


      if (!file) return;


      setFiles((prev) => ({
        ...prev,
        landPhoto: file,
      }));


      setGeoError('');

      setGeoData({
        lat: null,
        lng: null,
      });

      setIsParsingGeo(true);


      try {

        // Parse EXIF GPS

        const gps =
          await exifr.gps(file);


        if (
          gps &&
          gps.latitude &&
          gps.longitude
        ) {

          setGeoData({
            lat: gps.latitude,
            lng: gps.longitude,
          });

        } else {

          setGeoError(
            'No GPS coordinates found in the image metadata. Please upload a photo with Location tags enabled.'
          );
        }

      } catch (err) {

        console.error(err);

        setGeoError(
          'Failed to parse image metadata. Please ensure it is a valid JPEG/HEIC image.'
        );

      } finally {

        setIsParsingGeo(false);
      }
    };


  // ============================================================
  // FORM SUBMISSION VALIDATION
  // ============================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!ownerWallet) {

      setGeoError(
        'Please connect your MetaMask wallet before submitting.'
      );

      return;
    }


    if (
      !geoData.lat ||
      !geoData.lng
    ) {

      setGeoError(
        'Cannot submit: Valid GPS coordinates are required.'
      );

      return;
    }


    setShowConfirmModal(true);
  };


  // ============================================================
  // ACTUAL FORM SUBMISSION
  // ============================================================

  const executeSubmit = async () => {

    setShowConfirmModal(false);


    // Double check wallet

    if (!ownerWallet) {

      setGeoError(
        'Please connect your wallet before submitting.'
      );

      return;
    }


    setIsSubmitting(true);


    const fd =
      new FormData();


    // ============================================================
    // CONNECTED WALLET
    // ============================================================

    fd.append(
      'owner_wallet',
      ownerWallet
    );


    // ============================================================
    // LAND DATA
    // ============================================================

    fd.append(
      'land_type',
      formData.landType
    );

    fd.append(
      'state',
      formData.state
    );

    fd.append(
      'district',
      formData.district
    );

    fd.append(
      'landmark',
      formData.landmark
    );

    fd.append(
      'area',
      formData.area
    );


    if (formData.length) {

      fd.append(
        'length',
        formData.length
      );
    }


    if (formData.width) {

      fd.append(
        'width',
        formData.width
      );
    }


    // ============================================================
    // GPS
    // ============================================================

    fd.append(
      'geo_lat',
      parseFloat(
        geoData.lat
      ).toFixed(6)
    );


    fd.append(
      'geo_lng',
      parseFloat(
        geoData.lng
      ).toFixed(6)
    );


    // ============================================================
    // FILES
    // ============================================================

    if (files.landPhoto) {

      fd.append(
        'land_photo',
        files.landPhoto
      );
    }


    if (files.rorPdf) {

      fd.append(
        'ror_document',
        files.rorPdf
      );
    }


    // Debug

    console.log(
      'Submitting Owner Wallet:',
      ownerWallet
    );


    // ============================================================
    // SUBMIT TO DJANGO
    // ============================================================

    const res =
      await submitEntityAction(fd);


    setIsSubmitting(false);


    if (res.success) {

      setShowSuccessModal(true);

    } else {

      let errorMsg =
        'Failed to submit entity. Please try again.';


      if (res.error) {

        if (
          typeof res.error ===
          'string'
        ) {

          errorMsg =
            res.error;

        } else if (
          typeof res.error ===
          'object'
        ) {

          errorMsg =
            Object
              .values(res.error)
              .flat()
              .join(' ');
        }
      }


      setGeoError(
        errorMsg
      );
    }
  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <div
      className={`
        w-full
        max-w-4xl
        mx-auto
        bg-white
        rounded-2xl
        shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        border
        border-slate-100
        overflow-hidden
        ${outfit.className}
      `}
    >


      {/* ========================================================
          HEADER
      ======================================================== */}

      <div
        className="
          bg-slate-900
          px-8
          py-6
          flex
          justify-between
          items-center
          relative
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            top-0
            right-0
            w-64
            h-64
            bg-indigo-500/20
            blur-[80px]
            rounded-full
            pointer-events-none
            -mt-32
            -mr-32
          "
        />


        <div className="relative z-10">

          <h2
            className="
              text-2xl
              font-bold
              text-white
              tracking-tight
            "
          >
            Register New Entity
          </h2>

          <p
            className="
              text-slate-300
              text-sm
              mt-1
            "
          >
            Submit verifiable land records to the immutable ledger.
          </p>

        </div>


        <div
          className="
            relative
            z-10
            hidden
            sm:block
          "
        >

          <span
            className="
              material-symbols-outlined
              text-4xl
              text-indigo-400
            "
          >
            landscape
          </span>

        </div>

      </div>


      <div className="p-8">

        {submitSuccess ? (

          // ======================================================
          // SUCCESS STATE
          // ======================================================

          <div
            className="
              bg-emerald-50
              border
              border-emerald-200
              rounded-xl
              p-8
              text-center
              flex
              flex-col
              items-center
            "
          >

            <span
              className="
                material-symbols-outlined
                text-emerald-500
                text-5xl
                mb-4
              "
            >
              check_circle
            </span>


            <h3
              className="
                text-xl
                font-bold
                text-emerald-800
                mb-2
              "
            >
              Entity Registration Initiated
            </h3>


            <p
              className="
                text-emerald-600
                max-w-md
              "
            >
              Your land details and verified geocoordinates have been submitted for processing onto the blockchain.
            </p>


            <button
              onClick={() => {

                setSubmitSuccess(false);

                setGeoData({
                  lat: null,
                  lng: null,
                });

                setFiles({
                  rorPdf: null,
                  landPhoto: null,
                });

                setFormData({
                  landType:
                    'residential',

                  district: '',

                  state: '',

                  landmark: '',

                  area: '',

                  length: '',

                  width: '',
                });
              }}
              className="
                mt-6
                px-6
                py-2.5
                bg-emerald-600
                text-white
                font-bold
                rounded-lg
                hover:bg-emerald-700
                transition-colors
              "
            >
              Register Another Entity
            </button>

          </div>

        ) : (

          // ======================================================
          // FORM
          // ======================================================

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >


            {/* ==================================================
                CONNECTED WALLET
            ================================================== */}

            <section>

              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-800
                  mb-4
                  flex
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    bg-emerald-100
                    text-emerald-700
                    w-6
                    h-6
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs
                  "
                >
                  ✓
                </span>

                Connected Wallet

              </h3>


              <div
                className="
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  p-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <span
                    className={`
                      material-symbols-outlined
                      ${
                        ownerWallet
                          ? 'text-emerald-600'
                          : 'text-rose-500'
                      }
                    `}
                  >
                    account_balance_wallet
                  </span>


                  <div className="flex-1">

                    <p
                      className="
                        text-xs
                        text-slate-500
                        mb-1
                      "
                    >
                      Owner Wallet Address
                    </p>


                    <p
                      className={`
                        text-sm
                        font-medium
                        break-all
                        ${jetbrains.className}
                        ${
                          ownerWallet
                            ? 'text-slate-800'
                            : 'text-rose-600'
                        }
                      `}
                    >

                      {
                        ownerWallet ||
                        'No MetaMask wallet connected'
                      }

                    </p>

                  </div>

                </div>

              </div>

            </section>


            <hr className="border-slate-100" />


            {/* ==================================================
                1. PROPERTY TYPE
            ================================================== */}

            <section>

              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-800
                  mb-4
                  flex
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    bg-indigo-100
                    text-indigo-700
                    w-6
                    h-6
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs
                  "
                >
                  1
                </span>

                Classification

              </h3>


              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-4
                "
              >


                {/* Residential */}

                <label
                  className={`
                    cursor-pointer
                    border-2
                    rounded-xl
                    p-4
                    flex
                    items-center
                    gap-4
                    transition-all

                    ${
                      formData.landType ===
                      'residential'

                        ? 'border-indigo-600 bg-indigo-50'

                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }
                  `}
                >

                  <input
                    type="radio"
                    name="landType"
                    value="residential"
                    checked={
                      formData.landType ===
                      'residential'
                    }
                    onChange={
                      handleInputChange
                    }
                    className="hidden"
                  />


                  <div
                    className={`
                      w-5
                      h-5
                      rounded-full
                      border-2
                      flex
                      items-center
                      justify-center

                      ${
                        formData.landType ===
                        'residential'

                          ? 'border-indigo-600'

                          : 'border-slate-300'
                      }
                    `}
                  >

                    {
                      formData.landType ===
                        'residential' && (

                        <div
                          className="
                            w-2.5
                            h-2.5
                            bg-indigo-600
                            rounded-full
                          "
                        />

                      )
                    }

                  </div>


                  <div>

                    <div
                      className="
                        font-bold
                        text-slate-800
                        leading-tight
                      "
                    >
                      Residential
                    </div>

                    <div
                      className="
                        text-[11px]
                        text-slate-500
                        mt-0.5
                      "
                    >
                      Housing & living
                    </div>

                  </div>

                </label>


                {/* Agricultural */}

                <label
                  className={`
                    cursor-pointer
                    border-2
                    rounded-xl
                    p-4
                    flex
                    items-center
                    gap-4
                    transition-all

                    ${
                      formData.landType ===
                      'agricultural'

                        ? 'border-indigo-600 bg-indigo-50'

                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }
                  `}
                >

                  <input
                    type="radio"
                    name="landType"
                    value="agricultural"
                    checked={
                      formData.landType ===
                      'agricultural'
                    }
                    onChange={
                      handleInputChange
                    }
                    className="hidden"
                  />


                  <div
                    className={`
                      w-5
                      h-5
                      rounded-full
                      border-2
                      flex
                      items-center
                      justify-center

                      ${
                        formData.landType ===
                        'agricultural'

                          ? 'border-indigo-600'

                          : 'border-slate-300'
                      }
                    `}
                  >

                    {
                      formData.landType ===
                        'agricultural' && (

                        <div
                          className="
                            w-2.5
                            h-2.5
                            bg-indigo-600
                            rounded-full
                          "
                        />

                      )
                    }

                  </div>


                  <div>

                    <div
                      className="
                        font-bold
                        text-slate-800
                        leading-tight
                      "
                    >
                      Agricultural
                    </div>

                    <div
                      className="
                        text-[11px]
                        text-slate-500
                        mt-0.5
                      "
                    >
                      Farming & cultivation
                    </div>

                  </div>

                </label>


                {/* Commercial */}

                <label
                  className={`
                    cursor-pointer
                    border-2
                    rounded-xl
                    p-4
                    flex
                    items-center
                    gap-4
                    transition-all

                    ${
                      formData.landType ===
                      'commercial'

                        ? 'border-indigo-600 bg-indigo-50'

                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }
                  `}
                >

                  <input
                    type="radio"
                    name="landType"
                    value="commercial"
                    checked={
                      formData.landType ===
                      'commercial'
                    }
                    onChange={
                      handleInputChange
                    }
                    className="hidden"
                  />


                  <div
                    className={`
                      w-5
                      h-5
                      rounded-full
                      border-2
                      flex
                      items-center
                      justify-center

                      ${
                        formData.landType ===
                        'commercial'

                          ? 'border-indigo-600'

                          : 'border-slate-300'
                      }
                    `}
                  >

                    {
                      formData.landType ===
                        'commercial' && (

                        <div
                          className="
                            w-2.5
                            h-2.5
                            bg-indigo-600
                            rounded-full
                          "
                        />

                      )
                    }

                  </div>


                  <div>

                    <div
                      className="
                        font-bold
                        text-slate-800
                        leading-tight
                      "
                    >
                      Commercial
                    </div>

                    <div
                      className="
                        text-[11px]
                        text-slate-500
                        mt-0.5
                      "
                    >
                      Business & retail
                    </div>

                  </div>

                </label>


                {/* Industrial */}

                <label
                  className={`
                    cursor-pointer
                    border-2
                    rounded-xl
                    p-4
                    flex
                    items-center
                    gap-4
                    transition-all

                    ${
                      formData.landType ===
                      'industrial'

                        ? 'border-indigo-600 bg-indigo-50'

                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }
                  `}
                >

                  <input
                    type="radio"
                    name="landType"
                    value="industrial"
                    checked={
                      formData.landType ===
                      'industrial'
                    }
                    onChange={
                      handleInputChange
                    }
                    className="hidden"
                  />


                  <div
                    className={`
                      w-5
                      h-5
                      rounded-full
                      border-2
                      flex
                      items-center
                      justify-center

                      ${
                        formData.landType ===
                        'industrial'

                          ? 'border-indigo-600'

                          : 'border-slate-300'
                      }
                    `}
                  >

                    {
                      formData.landType ===
                        'industrial' && (

                        <div
                          className="
                            w-2.5
                            h-2.5
                            bg-indigo-600
                            rounded-full
                          "
                        />

                      )
                    }

                  </div>


                  <div>

                    <div
                      className="
                        font-bold
                        text-slate-800
                        leading-tight
                      "
                    >
                      Industrial
                    </div>

                    <div
                      className="
                        text-[11px]
                        text-slate-500
                        mt-0.5
                      "
                    >
                      Factories & warehouses
                    </div>

                  </div>

                </label>


                {/* Raw */}

                <label
                  className={`
                    cursor-pointer
                    border-2
                    rounded-xl
                    p-4
                    flex
                    items-center
                    gap-4
                    transition-all

                    ${
                      formData.landType ===
                      'raw'

                        ? 'border-indigo-600 bg-indigo-50'

                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }
                  `}
                >

                  <input
                    type="radio"
                    name="landType"
                    value="raw"
                    checked={
                      formData.landType ===
                      'raw'
                    }
                    onChange={
                      handleInputChange
                    }
                    className="hidden"
                  />


                  <div
                    className={`
                      w-5
                      h-5
                      rounded-full
                      border-2
                      flex
                      items-center
                      justify-center

                      ${
                        formData.landType ===
                        'raw'

                          ? 'border-indigo-600'

                          : 'border-slate-300'
                      }
                    `}
                  >

                    {
                      formData.landType ===
                        'raw' && (

                        <div
                          className="
                            w-2.5
                            h-2.5
                            bg-indigo-600
                            rounded-full
                          "
                        />

                      )
                    }

                  </div>


                  <div>

                    <div
                      className="
                        font-bold
                        text-slate-800
                        leading-tight
                      "
                    >
                      Raw / Undeveloped
                    </div>

                    <div
                      className="
                        text-[11px]
                        text-slate-500
                        mt-0.5
                      "
                    >
                      Vacant bare land
                    </div>

                  </div>

                </label>

              </div>

            </section>


            <hr className="border-slate-100" />


            {/* ==================================================
                2. LOCATION
            ================================================== */}

            <section>

              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-800
                  mb-4
                  flex
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    bg-indigo-100
                    text-indigo-700
                    w-6
                    h-6
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs
                  "
                >
                  2
                </span>

                Geographic Location

              </h3>


              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                "
              >


                <div className="space-y-1.5">

                  <label
                    className="
                      text-sm
                      font-semibold
                      text-slate-700
                      block
                    "
                  >
                    State
                  </label>


                  <div className="relative">

                    <select
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={
                        isLoadingStates
                      }
                      className="
                        w-full
                        h-12
                        bg-slate-50
                        border
                        border-slate-200
                        rounded-xl
                        px-4
                        text-slate-800
                        focus:outline-none
                        focus:border-indigo-500
                        focus:ring-4
                        focus:ring-indigo-500/10
                        transition-all
                        cursor-pointer
                        disabled:opacity-50
                        appearance-none
                      "
                    >

                      <option
                        value=""
                        disabled
                      >
                        Select State
                      </option>


                      {
                        statesData.map(
                          (stateObj) => (

                            <option
                              key={
                                stateObj.id
                              }
                              value={
                                stateObj.name
                              }
                            >
                              {
                                stateObj.name
                              }
                            </option>

                          )
                        )
                      }

                    </select>


                    <span
                      className="
                        material-symbols-outlined
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        pointer-events-none
                      "
                    >
                      expand_more
                    </span>

                  </div>

                </div>


                <div className="space-y-1.5">

                  <label
                    className="
                      text-sm
                      font-semibold
                      text-slate-700
                      block
                    "
                  >
                    District
                  </label>


                  <div className="relative">

                    <select
                      required
                      name="district"
                      value={
                        formData.district
                      }
                      onChange={
                        handleInputChange
                      }
                      disabled={
                        !formData.state ||
                        availableDistricts.length ===
                          0
                      }
                      className="
                        w-full
                        h-12
                        bg-slate-50
                        border
                        border-slate-200
                        rounded-xl
                        px-4
                        text-slate-800
                        focus:outline-none
                        focus:border-indigo-500
                        focus:ring-4
                        focus:ring-indigo-500/10
                        transition-all
                        cursor-pointer
                        disabled:opacity-50
                        appearance-none
                      "
                    >

                      <option
                        value=""
                        disabled
                      >

                        {
                          formData.state
                            ? 'Select District'
                            : 'Select State First'
                        }

                      </option>


                      {
                        availableDistricts.map(
                          (distObj) => (

                            <option
                              key={
                                distObj.id
                              }
                              value={
                                distObj.name
                              }
                            >
                              {
                                distObj.name
                              }
                            </option>

                          )
                        )
                      }

                    </select>


                    <span
                      className="
                        material-symbols-outlined
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        pointer-events-none
                      "
                    >
                      expand_more
                    </span>

                  </div>

                </div>


                <div
                  className="
                    space-y-1.5
                    md:col-span-2
                  "
                >

                  <label
                    className="
                      text-sm
                      font-semibold
                      text-slate-700
                      block
                    "
                  >
                    Landmark / Precise Locality
                  </label>


                  <input
                    required
                    name="landmark"
                    value={
                      formData.landmark
                    }
                    onChange={
                      handleInputChange
                    }
                    type="text"
                    placeholder="e.g. Near River Bank, Sector 4"
                    className="
                      w-full
                      h-12
                      bg-slate-50
                      border
                      border-slate-200
                      rounded-xl
                      px-4
                      text-slate-800
                      focus:outline-none
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      transition-all
                    "
                  />

                </div>

              </div>

            </section>


            <hr className="border-slate-100" />


            {/* ==================================================
                3. DIMENSIONS
            ================================================== */}

            <section>

              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-800
                  mb-4
                  flex
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    bg-indigo-100
                    text-indigo-700
                    w-6
                    h-6
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs
                  "
                >
                  3
                </span>

                Land Dimensions

              </h3>


              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-5
                "
              >


                <div className="space-y-1.5">

                  <label
                    className="
                      text-sm
                      font-semibold
                      text-slate-700
                      block
                    "
                  >
                    Total Area (sq.ft)
                  </label>


                  <input
                    readOnly
                    name="area"
                    value={formData.area}
                    type="number"
                    placeholder="Auto-calculated"
                    className={`
                      w-full
                      h-12
                      bg-slate-100
                      border
                      border-slate-200
                      rounded-xl
                      px-4
                      text-slate-500
                      cursor-not-allowed
                      focus:outline-none
                      transition-all
                      ${jetbrains.className}
                    `}
                  />

                </div>


                <div className="space-y-1.5">

                  <label
                    className="
                      text-sm
                      font-semibold
                      text-slate-700
                      block
                    "
                  >
                    Length (ft)
                  </label>


                  <input
                    required
                    min="0"
                    onKeyDown={(e) => {

                      if (
                        e.key === '-'
                      ) {

                        e.preventDefault();
                      }
                    }}
                    name="length"
                    value={
                      formData.length
                    }
                    onChange={
                      handleInputChange
                    }
                    type="number"
                    placeholder="0.00"
                    className={`
                      w-full
                      h-12
                      bg-slate-50
                      border
                      border-slate-200
                      rounded-xl
                      px-4
                      text-slate-800
                      focus:outline-none
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      transition-all
                      ${jetbrains.className}
                    `}
                  />

                </div>


                <div className="space-y-1.5">

                  <label
                    className="
                      text-sm
                      font-semibold
                      text-slate-700
                      block
                    "
                  >
                    Width (ft)
                  </label>


                  <input
                    required
                    min="0"
                    onKeyDown={(e) => {

                      if (
                        e.key === '-'
                      ) {

                        e.preventDefault();
                      }
                    }}
                    name="width"
                    value={
                      formData.width
                    }
                    onChange={
                      handleInputChange
                    }
                    type="number"
                    placeholder="0.00"
                    className={`
                      w-full
                      h-12
                      bg-slate-50
                      border
                      border-slate-200
                      rounded-xl
                      px-4
                      text-slate-800
                      focus:outline-none
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-500/10
                      transition-all
                      ${jetbrains.className}
                    `}
                  />

                </div>

              </div>

            </section>


            <hr className="border-slate-100" />


            {/* ==================================================
                4. DOCUMENTS
            ================================================== */}

            <section>

              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-800
                  mb-4
                  flex
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    bg-indigo-100
                    text-indigo-700
                    w-6
                    h-6
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs
                  "
                >
                  4
                </span>

                Verification Documents

              </h3>


              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                "
              >


                {/* ROR PDF */}

                <div
                  className="
                    border
                    border-dashed
                    border-slate-300
                    rounded-xl
                    p-5
                    bg-slate-50
                    hover:bg-slate-100
                    transition-colors
                    relative
                    group
                    flex
                    flex-col
                    justify-between
                  "
                >

                  <input
                    required={
                      !files.rorPdf
                    }
                    type="file"
                    accept="application/pdf"
                    onChange={
                      handlePdfUpload
                    }
                    className="
                      absolute
                      inset-0
                      w-full
                      h-full
                      opacity-0
                      cursor-pointer
                      z-10
                    "
                    title=""
                  />


                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      space-y-2
                      pointer-events-none
                      relative
                      z-0
                      py-2
                    "
                  >

                    <span
                      className={`
                        material-symbols-outlined
                        text-4xl

                        ${
                          files.rorPdf
                            ? 'text-indigo-600'
                            : 'text-slate-400'
                        }
                      `}
                    >
                      description
                    </span>


                    <div>

                      <div
                        className="
                          font-bold
                          text-slate-700
                        "
                      >
                        RoR Document (PDF)
                      </div>


                      <div
                        className="
                          text-xs
                          text-slate-500
                          mt-1
                        "
                      >

                        {
                          files.rorPdf
                            ? files.rorPdf.name
                            : 'Click or drag to upload'
                        }

                      </div>

                    </div>

                  </div>


                  {
                    files.rorPdf && (

                      <div
                        className="
                          mt-2
                          relative
                          z-20
                          flex
                          gap-2
                        "
                      >

                        <button
                          type="button"
                          onClick={(e) => {

                            e.preventDefault();

                            e.stopPropagation();

                            setPreviewFile({

                              type: 'pdf',

                              url:
                                URL.createObjectURL(
                                  files.rorPdf
                                ),

                              name:
                                files.rorPdf.name,

                            });
                          }}
                          className="
                            flex-1
                            bg-white
                            border
                            border-indigo-200
                            text-indigo-700
                            hover:bg-indigo-50
                            font-semibold
                            py-1.5
                            rounded-lg
                            text-sm
                            transition-colors
                            flex
                            items-center
                            justify-center
                            gap-1
                            shadow-sm
                          "
                        >

                          <span
                            className="
                              material-symbols-outlined
                              text-[16px]
                            "
                          >
                            visibility
                          </span>

                          View PDF

                        </button>


                        <button
                          type="button"
                          onClick={(e) => {

                            e.preventDefault();

                            e.stopPropagation();

                            setFiles(
                              (prev) => ({
                                ...prev,
                                rorPdf: null,
                              })
                            );
                          }}
                          className="
                            bg-white
                            border
                            border-slate-200
                            text-rose-600
                            hover:bg-rose-50
                            hover:border-rose-200
                            font-semibold
                            px-3
                            rounded-lg
                            text-sm
                            transition-colors
                            flex
                            items-center
                            justify-center
                            shadow-sm
                          "
                          title="Remove PDF"
                        >

                          <span
                            className="
                              material-symbols-outlined
                              text-[18px]
                            "
                          >
                            delete
                          </span>

                        </button>

                      </div>

                    )
                  }

                </div>


                {/* LAND PHOTO */}

                <div
                  className={`
                    border
                    border-dashed
                    rounded-xl
                    p-5
                    transition-colors
                    relative
                    group
                    flex
                    flex-col
                    justify-between

                    ${
                      geoError

                        ? 'border-rose-400 bg-rose-50'

                        : files.landPhoto &&
                          geoData.lat

                        ? 'border-emerald-400 bg-emerald-50'

                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                    }
                  `}
                >

                  <input
                    required={
                      !files.landPhoto
                    }
                    type="file"
                    accept="
                      image/jpeg,
                      image/png,
                      image/heic
                    "
                    onChange={
                      handlePhotoUpload
                    }
                    className="
                      absolute
                      inset-0
                      w-full
                      h-full
                      opacity-0
                      cursor-pointer
                      z-10
                    "
                    title=""
                  />


                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      space-y-2
                      pointer-events-none
                      relative
                      z-0
                      py-2
                    "
                  >

                    {
                      isParsingGeo ? (

                        <span
                          className="
                            material-symbols-outlined
                            text-4xl
                            text-indigo-600
                            animate-spin
                          "
                        >
                          refresh
                        </span>

                      ) : (

                        <span
                          className={`
                            material-symbols-outlined
                            text-4xl

                            ${
                              geoError

                                ? 'text-rose-500'

                                : files.landPhoto &&
                                  geoData.lat

                                ? 'text-emerald-600'

                                : 'text-slate-400'
                            }
                          `}
                        >

                          {
                            geoError

                              ? 'error'

                              : files.landPhoto &&
                                geoData.lat

                              ? 'verified'

                              : 'add_a_photo'
                          }

                        </span>

                      )
                    }


                    <div>

                      <div
                        className={`
                          font-bold

                          ${
                            geoError

                              ? 'text-rose-700'

                              : files.landPhoto &&
                                geoData.lat

                              ? 'text-emerald-800'

                              : 'text-slate-700'
                          }
                        `}
                      >
                        Land Photograph (GPS Required)
                      </div>


                      <div
                        className={`
                          text-xs
                          mt-1

                          ${
                            geoError
                              ? 'text-rose-600'
                              : 'text-slate-500'
                          }
                        `}
                      >

                        {
                          files.landPhoto

                            ? files.landPhoto.name

                            : 'Must contain location tags'
                        }

                      </div>

                    </div>

                  </div>


                  {
                    files.landPhoto && (

                      <div
                        className="
                          mt-2
                          relative
                          z-20
                          flex
                          gap-2
                        "
                      >

                        <button
                          type="button"
                          onClick={(e) => {

                            e.preventDefault();

                            e.stopPropagation();

                            setPreviewFile({

                              type: 'image',

                              url:
                                URL.createObjectURL(
                                  files.landPhoto
                                ),

                              name:
                                files.landPhoto.name,

                            });
                          }}
                          className={`
                            flex-1
                            bg-white
                            border
                            font-semibold
                            py-1.5
                            rounded-lg
                            text-sm
                            transition-colors
                            flex
                            items-center
                            justify-center
                            gap-1
                            shadow-sm

                            ${
                              geoError

                                ? 'border-rose-200 text-rose-700 hover:bg-rose-50'

                                : geoData.lat

                                ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'

                                : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                            }
                          `}
                        >

                          <span
                            className="
                              material-symbols-outlined
                              text-[16px]
                            "
                          >
                            visibility
                          </span>

                          View Photo

                        </button>


                        <button
                          type="button"
                          onClick={(e) => {

                            e.preventDefault();

                            e.stopPropagation();

                            setFiles(
                              (prev) => ({
                                ...prev,
                                landPhoto: null,
                              })
                            );

                            setGeoData({
                              lat: null,
                              lng: null,
                            });

                            setGeoError('');

                          }}
                          className="
                            bg-white
                            border
                            border-slate-200
                            text-rose-600
                            hover:bg-rose-50
                            hover:border-rose-200
                            font-semibold
                            px-3
                            rounded-lg
                            text-sm
                            transition-colors
                            flex
                            items-center
                            justify-center
                            shadow-sm
                          "
                          title="Remove Photo"
                        >

                          <span
                            className="
                              material-symbols-outlined
                              text-[18px]
                            "
                          >
                            delete
                          </span>

                        </button>

                      </div>

                    )
                  }

                </div>

              </div>


              {/* GPS ERROR */}

              {
                geoError && (

                  <div
                    className="
                      mt-3
                      bg-rose-50
                      border
                      border-rose-200
                      text-rose-700
                      px-4
                      py-3
                      rounded-lg
                      text-sm
                      flex
                      items-start
                      gap-2
                    "
                  >

                    <span
                      className="
                        material-symbols-outlined
                        text-[18px]
                      "
                    >
                      warning
                    </span>

                    <p>
                      {geoError}
                    </p>

                  </div>

                )
              }


              {/* GPS SUCCESS */}

              {
                geoData.lat &&
                geoData.lng &&
                !geoError && (

                  <div
                    className="
                      mt-3
                      bg-emerald-50
                      border
                      border-emerald-200
                      text-emerald-800
                      px-4
                      py-3
                      rounded-lg
                      text-sm
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <span
                      className="
                        material-symbols-outlined
                        text-[20px]
                        text-emerald-600
                      "
                    >
                      satellite_alt
                    </span>


                    <div>

                      <p
                        className="
                          font-semibold
                        "
                      >
                        GPS Coordinates Verified
                      </p>


                      <p
                        className={`
                          text-xs
                          mt-0.5
                          text-emerald-700
                          ${jetbrains.className}
                        `}
                      >

                        LAT:{' '}

                        {
                          geoData.lat.toFixed(
                            6
                          )
                        }

                        {' | '}

                        LNG:{' '}

                        {
                          geoData.lng.toFixed(
                            6
                          )
                        }

                      </p>

                    </div>

                  </div>

                )
              }

            </section>


            {/* ==================================================
                SUBMIT
            ================================================== */}

            <div
              className="
                pt-4
                flex
                justify-end
              "
            >

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !geoData.lat ||
                  !ownerWallet
                }
                className="
                  w-full
                  sm:w-auto
                  h-14
                  px-8
                  rounded-xl
                  bg-slate-900
                  text-white
                  font-bold
                  shadow-lg
                  hover:shadow-indigo-500/25
                  hover:-translate-y-1
                  hover:shadow-xl
                  active:scale-95
                  transition-all
                  flex
                  items-center
                  justify-center
                  gap-2
                  disabled:opacity-50
                  disabled:pointer-events-none
                  disabled:transform-none
                "
              >

                {
                  isSubmitting ? (

                    <>
                      <span
                        className="
                          material-symbols-outlined
                          animate-spin
                          text-[20px]
                        "
                      >
                        refresh
                      </span>

                      Processing...
                    </>

                  ) : (

                    <>
                      <span
                        className="
                          material-symbols-outlined
                          text-[20px]
                        "
                      >
                        upload
                      </span>

                      Submit Entity
                    </>

                  )
                }

              </button>

            </div>

          </form>

        )}

      </div>


      {/* ========================================================
          FILE PREVIEW MODAL
      ======================================================== */}

      {
        previewFile && (

          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-slate-900/60
              backdrop-blur-sm
              p-4
              sm:p-8
            "
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                w-full
                max-w-4xl
                max-h-full
                flex
                flex-col
                overflow-hidden
                animate-in
                fade-in
                zoom-in-95
                duration-200
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-6
                  py-4
                  border-b
                  border-slate-100
                  bg-slate-50
                "
              >

                <h3
                  className="
                    font-bold
                    text-slate-800
                    truncate
                    pr-4
                  "
                >
                  {previewFile.name}
                </h3>


                <button
                  onClick={() =>
                    setPreviewFile(null)
                  }
                  className="
                    p-2
                    hover:bg-slate-200
                    rounded-lg
                    text-slate-500
                    transition-colors
                  "
                >

                  <span
                    className="
                      material-symbols-outlined
                      leading-none
                    "
                  >
                    close
                  </span>

                </button>

              </div>


              <div
                className="
                  flex-1
                  overflow-auto
                  bg-slate-100
                  p-4
                  sm:p-6
                  flex
                  items-center
                  justify-center
                  min-h-[50vh]
                "
              >

                {
                  previewFile.type ===
                  'image' ? (

                    <img
                      src={
                        previewFile.url
                      }
                      alt="Preview"
                      className="
                        max-w-full
                        max-h-[70vh]
                        object-contain
                        rounded-lg
                        shadow-sm
                      "
                    />

                  ) : (

                    <iframe
                      src={
                        previewFile.url
                      }
                      className="
                        w-full
                        h-[70vh]
                        rounded-lg
                        shadow-sm
                        bg-white
                      "
                      title="PDF Preview"
                    />

                  )
                }

              </div>

            </div>

          </div>

        )
      }


      {/* ========================================================
          CONFIRMATION MODAL
      ======================================================== */}

      {
        showConfirmModal && (

          <div
            className="
              fixed
              inset-0
              z-[110]
              flex
              items-center
              justify-center
              bg-slate-900/40
              backdrop-blur-sm
              p-4
              animate-in
              fade-in
              duration-200
            "
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                max-w-md
                w-full
                p-8
                text-center
                animate-in
                zoom-in-95
                duration-200
              "
            >

              <div
                className="
                  w-16
                  h-16
                  bg-amber-100
                  text-amber-600
                  rounded-full
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-6
                "
              >

                <span
                  className="
                    material-symbols-outlined
                    text-3xl
                  "
                >
                  warning
                </span>

              </div>


              <h3
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  mb-2
                  tracking-tight
                "
              >
                Confirm Submission
              </h3>


              <p
                className="
                  text-slate-500
                  mb-8
                "
              >
                Are you sure you want to submit this entity for registration? Once submitted, it will be reviewed by the Revenue Inspector.
              </p>


              <div className="flex gap-4">

                <button
                  onClick={() =>
                    setShowConfirmModal(
                      false
                    )
                  }
                  className="
                    flex-1
                    py-3
                    bg-slate-100
                    hover:bg-slate-200
                    text-slate-700
                    font-bold
                    rounded-xl
                    transition-colors
                  "
                >
                  Cancel
                </button>


                <button
                  onClick={
                    executeSubmit
                  }
                  className="
                    flex-1
                    py-3
                    bg-indigo-600
                    hover:bg-indigo-700
                    text-white
                    font-bold
                    rounded-xl
                    shadow-lg
                    shadow-indigo-200
                    transition-colors
                  "
                >
                  Confirm & Submit
                </button>

              </div>

            </div>

          </div>

        )
      }


      {/* ========================================================
          SUCCESS MODAL
      ======================================================== */}

      {
        showSuccessModal && (

          <div
            className="
              fixed
              inset-0
              z-[110]
              flex
              items-center
              justify-center
              bg-slate-900/40
              backdrop-blur-sm
              p-4
              animate-in
              fade-in
              duration-200
            "
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                max-w-md
                w-full
                p-8
                text-center
                animate-in
                zoom-in-95
                duration-200
              "
            >

              <div
                className="
                  w-16
                  h-16
                  bg-emerald-100
                  text-emerald-600
                  rounded-full
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-6
                "
              >

                <span
                  className="
                    material-symbols-outlined
                    text-3xl
                  "
                >
                  verified
                </span>

              </div>


              <h3
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  mb-2
                  tracking-tight
                "
              >
                Submission Successful
              </h3>


              <p
                className="
                  text-slate-500
                  mb-8
                "
              >
                Your land registration request has been submitted and is currently pending review.
              </p>


              <button
                onClick={() => {

                  setShowSuccessModal(
                    false
                  );

                  setSubmitSuccess(
                    true
                  );

                }}
                className="
                  w-full
                  py-3
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  font-bold
                  rounded-xl
                  shadow-lg
                  shadow-emerald-200
                  transition-colors
                "
              >
                Continue
              </button>

            </div>

          </div>

        )
      }

    </div>
  );
}