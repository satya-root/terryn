import Image from "next/image";
import Navbar from "@/components/custom/Navbar";
import logo from "../../../public/img/logo.svg";
import { Baloo_Bhai_2, Outfit } from "next/font/google";
import Footer from "@/components/custom/Footer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import OwnedLandsCollection from "@/components/custom/OwnedLandsCollection";
import ConnectWallet from "@/components/blockchain/ConnectWallet";

const baloo = Baloo_Bhai_2({
  weight: "700",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
});


async function getProfile(token) {
  try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return await res.json();

  } catch (error) {

    console.error(
      "Unable to load profile:",
      error
    );

    return null;
  }
}



export default async function Profile() {

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      "access_token"
    )?.value;


  if (!token) {

    redirect(
      "/login?callbackUrl=/profile"
    );
  }


  // ============================================================
  // FETCH PROFILE
  // ============================================================

  const profile =
    await getProfile(token);


  if (!profile) {

    redirect(
      "/login?callbackUrl=/profile"
    );
  }


  // ============================================================
  // FORMAT ADDRESS
  // ============================================================

  let addressString =
    "N/A";


  if (profile.address) {

    if (
      typeof profile.address ===
      "string"
    ) {

      addressString =
        profile.address;

    } else if (
      typeof profile.address ===
      "object"
    ) {

      addressString =
        Object
          .values(
            profile.address
          )
          .filter(Boolean)
          .join(", ");
    }
  }



  return (

    <div
      className={`
        min-h-screen
        flex
        flex-col
        text-slate-800
        ${outfit.className}
      `}
    >

      <Navbar />


      <main
        className="
          flex-1
          max-w-[1280px]
          w-full
          mx-auto
          px-6
          sm:px-8
          lg:px-12
          py-12
          mt-[80px]
        "
      >


        {/* ======================================================
            PROFILE HEADER
        ====================================================== */}

        <div
          className="
            bg-white
            rounded-[2rem]
            shadow-[0_8px_30px_rgb(0,0,0,0.04)]
            border
            border-slate-100
            overflow-hidden
            mb-10
            relative
            group
          "
        >


          {/* HEADER BACKGROUND */}

          <div
            className="
              h-48
              md:h-64
              w-full
              bg-slate-900
              relative
              overflow-hidden
            "
          >

            <div
              className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-[150%]
                sm:w-3/4
                h-32
                md:h-64
                bg-indigo-500/30
                blur-[80px]
                rounded-full
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]
                mix-blend-overlay
                opacity-10
              "
            />

            <div
              className="
                absolute
                top-0
                right-0
                w-96
                h-96
                bg-indigo-400/20
                rounded-full
                blur-3xl
                -translate-y-1/2
                translate-x-1/3
              "
            />

            <div
              className="
                absolute
                bottom-0
                left-0
                w-full
                h-1/2
                bg-gradient-to-t
                from-black/40
                to-transparent
              "
            />

          </div>



          {/* ==================================================
              PROFILE CONTENT
          ================================================== */}

          <div
            className="
              px-6
              sm:px-12
              pb-8
              md:pb-10
              pt-20
              md:pt-24
              relative
            "
          >


            {/* AVATAR */}

            <div
              className="
                absolute
                -top-16
                md:-top-20
                left-6
                sm:left-12
              "
            >

              <div
                className="
                  w-32
                  h-32
                  md:w-40
                  md:h-40
                  rounded-full
                  border-4
                  md:border-[6px]
                  border-white
                  shadow-2xl
                  shadow-indigo-900/20
                  bg-white
                  overflow-hidden
                  relative
                  group/avatar
                  z-10
                  rotate-3
                  transition-transform
                  duration-500
                  hover:rotate-0
                  flex-shrink-0
                "
              >

                {
                  profile.photo_link ? (

                    <img
                      alt="Profile Avatar"
                      src={
                        `data:image/jpeg;base64,${profile.photo_link}`
                      }
                      className="
                        w-full
                        h-full
                        object-cover
                        rounded-full
                        scale-[1.02]
                      "
                    />

                  ) : (

                    <Image
                      alt="Profile Avatar"
                      src={logo}
                      className="
                        w-full
                        h-full
                        object-cover
                        rounded-full
                        scale-[1.02]
                      "
                      width={160}
                      height={160}
                    />

                  )
                }


                <div
                  className="
                    absolute
                    inset-0
                    bg-slate-900/40
                    flex
                    items-center
                    justify-center
                    opacity-0
                    group-hover/avatar:opacity-100
                    transition-opacity
                    cursor-pointer
                    backdrop-blur-sm
                    rounded-full
                  "
                >

                  <span
                    className="
                      material-symbols-outlined
                      text-white
                      text-3xl
                    "
                  >
                    photo_camera
                  </span>

                </div>

              </div>

            </div>



            {/* PROFILE NAME */}

            <div
              className="
                flex
                flex-col
                md:flex-row
                justify-between
                items-start
                md:items-end
                gap-6
                md:gap-8
                mt-2
              "
            >

              <div
                className="
                  flex-1
                  text-left
                  z-10
                "
              >

                <h1
                  className="
                    text-3xl
                    md:text-4xl
                    font-extrabold
                    tracking-tight
                    mb-1
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r
                    from-slate-900
                    to-slate-700
                    capitalize
                  "
                >

                  {
                    profile.first_name ||
                    profile.username ||
                    "User"
                  }

                </h1>


                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mt-2
                  "
                >

                  <span
                    className="
                      text-base
                      md:text-lg
                      text-slate-500
                      font-medium
                    "
                  >
                    Digital Citizen
                  </span>


                  {
                    profile.is_wallet_active && (

                      <span
                        className="
                          bg-emerald-500/10
                          border
                          border-emerald-500/20
                          text-emerald-600
                          text-xs
                          px-3
                          py-1
                          rounded-full
                          flex
                          items-center
                          gap-1.5
                          font-bold
                          shadow-sm
                          backdrop-blur-md
                        "
                      >

                        <span
                          className="
                            material-symbols-outlined
                            text-[14px]
                          "
                        >
                          verified
                        </span>

                        KYC Verified

                      </span>

                    )
                  }

                </div>

              </div>



              {/* PROFILE ACTION BUTTONS */}

              <div
                className="
                  z-10
                  w-full
                  md:w-auto
                  flex
                  gap-3
                "
              >

                <button
                  className="
                    flex-1
                    md:flex-none
                    px-6
                    py-3
                    bg-white
                    hover:bg-slate-50
                    text-slate-700
                    border
                    border-slate-200
                    rounded-2xl
                    text-sm
                    font-bold
                    transition-all
                    shadow-sm
                    active:scale-95
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  <span
                    className="
                      material-symbols-outlined
                      text-[18px]
                    "
                  >
                    edit
                  </span>

                  Edit

                </button>


                <button
                  className="
                    flex-1
                    md:flex-none
                    px-6
                    py-3
                    bg-slate-900
                    hover:bg-indigo-600
                    text-white
                    rounded-2xl
                    text-sm
                    font-bold
                    transition-all
                    shadow-lg
                    hover:shadow-indigo-500/25
                    active:scale-95
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  <span
                    className="
                      material-symbols-outlined
                      text-[18px]
                    "
                  >
                    download
                  </span>

                  Export ID

                </button>

              </div>

            </div>

          </div>

        </div>



        {/* ======================================================
            BENTO GRID
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-6
          "
        >


          {/* LEFT COLUMN */}

          <div
            className="
              lg:col-span-8
              flex
              flex-col
              gap-6
            "
          >

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-6
              "
            >


              {/* ===============================================
                  AADHAAR
              =============================================== */}

              <div
                className="
                  bg-white
                  rounded-[2rem]
                  shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                  border
                  border-slate-100
                  p-6
                  flex
                  flex-col
                  justify-between
                  hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                  transition-all
                  group
                  overflow-hidden
                  relative
                "
              >

                <div
                  className="
                    absolute
                    -right-6
                    -top-6
                    w-24
                    h-24
                    bg-rose-50
                    rounded-full
                    blur-2xl
                    group-hover:bg-rose-100
                    transition-colors
                  "
                />


                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-6
                    relative
                    z-10
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-rose-100
                      text-rose-600
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <span className="material-symbols-outlined">
                      badge
                    </span>

                  </div>


                  <span
                    className="
                      text-sm
                      font-semibold
                      text-slate-500
                      uppercase
                      tracking-widest
                    "
                  >
                    Aadhaar ID
                  </span>

                </div>


                <div
                  className="
                    text-xl
                    font-bold
                    tracking-widest
                    text-slate-800
                    relative
                    z-10
                  "
                >
                  {
                    profile.aadhar_number ||
                    "N/A"
                  }
                </div>

              </div>



              {/* ===============================================
                  WALLET
              =============================================== */}

              <div
                className="
                  bg-white
                  rounded-[2rem]
                  shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                  border
                  border-slate-100
                  p-6
                  flex
                  flex-col
                  justify-between
                  hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                  transition-all
                  group
                  overflow-hidden
                  relative
                "
              >

                <div
                  className="
                    absolute
                    -right-6
                    -bottom-6
                    w-24
                    h-24
                    bg-indigo-50
                    rounded-full
                    blur-2xl
                    group-hover:bg-indigo-100
                    transition-colors
                  "
                />


                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-6
                    relative
                    z-10
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-indigo-100
                        text-indigo-600
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <span className="material-symbols-outlined">
                        account_balance_wallet
                      </span>

                    </div>


                    <span
                      className="
                        text-sm
                        font-semibold
                        text-slate-500
                        uppercase
                        tracking-widest
                      "
                    >
                      Web3 Wallet
                    </span>

                  </div>


                  <button
                    className="
                      w-8
                      h-8
                      rounded-full
                      bg-slate-50
                      hover:bg-indigo-50
                      text-slate-400
                      hover:text-indigo-600
                      flex
                      items-center
                      justify-center
                      transition-colors
                    "
                  >

                    <span
                      className="
                        material-symbols-outlined
                        text-[16px]
                      "
                    >
                      content_copy
                    </span>

                  </button>

                </div>


                <div
                  className="
                    text-lg
                    font-mono
                    font-medium
                    text-slate-800
                    truncate
                    w-full
                    relative
                    z-10
                  "
                  title={
                    profile.wallet_address ||
                    "N/A"
                  }
                >

                  {
                    profile.wallet_address ||
                    <ConnectWallet />
                  }

                </div>

              </div>



              {/* ===============================================
                  EMAIL
              =============================================== */}

              <div
                className="
                  bg-white
                  rounded-[2rem]
                  shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                  border
                  border-slate-100
                  p-6
                  flex
                  flex-col
                  justify-between
                  hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                  transition-all
                  group
                  overflow-hidden
                  relative
                "
              >

                <div
                  className="
                    absolute
                    -left-6
                    -bottom-6
                    w-24
                    h-24
                    bg-amber-50
                    rounded-full
                    blur-2xl
                    group-hover:bg-amber-100
                    transition-colors
                  "
                />


                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-6
                    relative
                    z-10
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-amber-100
                      text-amber-600
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <span className="material-symbols-outlined">
                      alternate_email
                    </span>

                  </div>


                  <span
                    className="
                      text-sm
                      font-semibold
                      text-slate-500
                      uppercase
                      tracking-widest
                    "
                  >
                    Email Address
                  </span>

                </div>


                <div
                  className="
                    text-lg
                    font-bold
                    text-slate-800
                    truncate
                    relative
                    z-10
                  "
                >
                  {
                    profile.email ||
                    "N/A"
                  }
                </div>

              </div>



              {/* ===============================================
                  PHONE
              =============================================== */}

              <div
                className="
                  bg-white
                  rounded-[2rem]
                  shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                  border
                  border-slate-100
                  p-6
                  flex
                  flex-col
                  justify-between
                  hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                  transition-all
                  group
                  overflow-hidden
                  relative
                "
              >

                <div
                  className="
                    absolute
                    -left-6
                    -top-6
                    w-24
                    h-24
                    bg-emerald-50
                    rounded-full
                    blur-2xl
                    group-hover:bg-emerald-100
                    transition-colors
                  "
                />


                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-6
                    relative
                    z-10
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-emerald-100
                      text-emerald-600
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <span className="material-symbols-outlined">
                      smartphone
                    </span>

                  </div>


                  <span
                    className="
                      text-sm
                      font-semibold
                      text-slate-500
                      uppercase
                      tracking-widest
                    "
                  >
                    Phone Number
                  </span>

                </div>


                <div
                  className="
                    text-lg
                    font-bold
                    text-slate-800
                    relative
                    z-10
                  "
                >
                  N/A
                </div>

              </div>

            </div>



            {/* ===============================================
                ADDRESS
            =============================================== */}

            <div
              className="
                bg-white
                rounded-[2rem]
                shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                border
                border-slate-100
                p-6
                flex
                flex-col
                sm:flex-row
                gap-6
                items-center
              "
            >

              <div
                className="
                  w-full
                  sm:w-48
                  h-32
                  bg-slate-100
                  rounded-2xl
                  border
                  border-slate-200
                  overflow-hidden
                  relative
                  group
                "
              >

                <img
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-110
                  "
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwMECW23jFnvgS4Ta76vioFnKlYVR9UXjxHGteAcBn26PFwYQhz99i_375bIe4apMb744hNORgtGDs-7Ih-QCAXXK2r0xxxqgJnnLUynJ0qL8Y5eCjxPpD4_7yEHGakcguwnxAktbGG_gThVe9FLATGSsR-5UooG9uCmdpSdspgjWyuecfoB4Kb9s7n293feTw9rCPju6v6o2Foo8xeWQP1OvQB5SOdldMNOylIJS6js8JXmge2kiNN6XujIv2t9UBUG_8P8Xmlfw"
                  alt="Map Location"
                />


                <div className="absolute inset-0 bg-black/10" />


                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                  "
                >

                  <div
                    className="
                      w-8
                      h-8
                      rounded-full
                      bg-white/90
                      backdrop-blur
                      shadow-sm
                      flex
                      items-center
                      justify-center
                      text-rose-500
                    "
                  >

                    <span
                      className="
                        material-symbols-outlined
                        text-[18px]
                      "
                    >
                      location_on
                    </span>

                  </div>

                </div>

              </div>


              <div
                className="
                  flex-1
                  w-full
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-3
                  "
                >

                  <span
                    className="
                      text-sm
                      font-semibold
                      text-slate-500
                      uppercase
                      tracking-widest
                    "
                  >
                    Primary Address
                  </span>


                  <span
                    className="
                      bg-emerald-50
                      text-emerald-600
                      text-[10px]
                      uppercase
                      px-2
                      py-1
                      rounded-full
                      font-bold
                      tracking-widest
                    "
                  >
                    Verified
                  </span>

                </div>


                <p
                  className="
                    text-lg
                    text-slate-800
                    font-medium
                    leading-relaxed
                  "
                  title={
                    addressString
                  }
                >

                  {addressString}

                </p>

              </div>

            </div>

          </div>



          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}

          <div
            className="
              lg:col-span-4
              flex
              flex-col
              h-full
            "
          >

            <div
              className="
                bg-slate-900
                rounded-[2rem]
                p-8
                text-white
                shadow-xl
                h-full
                flex
                flex-col
                relative
                overflow-hidden
                group
              "
            >

              <div
                className="
                  absolute
                  -right-20
                  -top-20
                  w-64
                  h-64
                  bg-indigo-500/20
                  rounded-full
                  blur-3xl
                  group-hover:bg-indigo-500/30
                  transition-colors
                "
              />


              <div
                className="
                  flex
                  items-center
                  gap-4
                  mb-8
                  relative
                  z-10
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-white/10
                    flex
                    items-center
                    justify-center
                    backdrop-blur-md
                    border
                    border-white/10
                  "
                >

                  <span className="material-symbols-outlined text-white">
                    admin_panel_settings
                  </span>

                </div>


                <div>

                  <h3
                    className="
                      text-xs
                      text-slate-400
                      uppercase
                      tracking-widest
                      font-bold
                    "
                  >
                    System Clearance
                  </h3>

                  <div
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    L1 - Citizen
                  </div>

                </div>

              </div>


              <div
                className="
                  mb-8
                  relative
                  z-10
                "
              >

                <div
                  className="
                    text-xs
                    text-slate-400
                    uppercase
                    tracking-widest
                    font-bold
                    mb-2
                  "
                >
                  Account ID
                </div>


                <div
                  className="
                    text-2xl
                    font-mono
                    text-indigo-300
                    font-medium
                    tracking-tight
                  "
                >
                  ACC-
                  {
                    profile.id
                      ?.toString()
                      .padStart(4, "0")
                  }
                  -XTQ
                </div>

              </div>


              <div
                className="
                  bg-white/5
                  backdrop-blur-md
                  p-4
                  rounded-2xl
                  flex
                  justify-between
                  items-center
                  border
                  border-white/10
                  mt-auto
                  relative
                  z-10
                  group-hover:bg-white/10
                  transition-colors
                  cursor-pointer
                "
              >

                <div>

                  <div
                    className="
                      text-xs
                      text-slate-400
                      font-medium
                      mb-1
                    "
                  >
                    Network Status
                  </div>


                  <div
                    className="
                      text-sm
                      font-bold
                      text-white
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <span
                      className="
                        w-2
                        h-2
                        rounded-full
                        bg-emerald-400
                        animate-pulse
                        shadow-[0_0_10px_rgba(52,211,153,0.5)]
                      "
                    />

                    Sepolia Connected

                  </div>

                </div>


                <span
                  className="
                    material-symbols-outlined
                    text-slate-400
                  "
                >
                  chevron_right
                </span>

              </div>

            </div>

          </div>

        </div>



        {/* ======================================================
            MY BLOCKCHAIN COLLECTION
        ====================================================== */}

        <div
          className="
            mt-16
            mb-8
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-8
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-indigo-100
                  text-indigo-600
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  border
                  border-indigo-200
                "
              >

                <span className="material-symbols-outlined">
                  real_estate_agent
                </span>

              </div>


              <div>

                <h2
                  className="
                    text-3xl
                    text-slate-800
                    tracking-tight
                    font-extrabold
                  "
                >
                  My Collection
                </h2>


                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  Properties owned by your connected wallet
                </p>

              </div>

            </div>

          </div>


          {/* THIS COMPONENT READS METAMASK + BLOCKCHAIN */}

          <OwnedLandsCollection />

        </div>

      </main>


      <Footer />

    </div>
  );
}