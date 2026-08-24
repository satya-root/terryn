import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function CardImageBuy({ property }) {
  if (!property) {
    return null;
  }

  const {
    tokenId,
    land_id,
    land_type,
    state,
    district,
    landmark,
    area,
    land_photo,
    priceInINR,
    active,
  } = property;

  const parsedArea =
    Number.parseFloat(area);

  const formattedArea =
    Number.isFinite(parsedArea)
      ? parsedArea.toFixed(2)
      : "N/A";

  const formattedPrice =
    Number(priceInINR || 0)
      .toLocaleString("en-IN");

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative">

      {/* Decorative gradient blur */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors pointer-events-none" />

      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div className="relative aspect-[4/3] w-full overflow-hidden p-2 pb-0">

        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/60 to-transparent" />

          <img
            src={
              land_photo ||
              "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop"
            }
            alt={
              land_id
                ? `Terryn Land ${land_id}`
                : `Terryn Property Token ${tokenId}`
            }
            className="relative z-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%]"
          />

          {/* State Badge */}
          <div className="absolute top-3 left-3 z-20">

            <Badge className="bg-white/90 text-slate-800 hover:bg-white border-0 shadow-sm backdrop-blur-md px-3 py-1 font-bold">

              {state || "Unknown State"}

            </Badge>

          </div>


          {/* Token Badge */}
          <div className="absolute bottom-3 right-3 z-20">

            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono px-3 py-1.5 rounded-full border border-white/10">

              Token #{tokenId}

            </span>

          </div>

        </div>

      </div>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="p-6 pt-5 flex-1 flex flex-col relative z-20">

        {/* Title + Listing Status */}

        <div className="flex justify-between items-start mb-4 gap-3">

          <div className="min-w-0">

            <h3
              className="text-xl font-bold tracking-tight text-slate-800 truncate"
              title={
                land_id ||
                `Terryn Property #${tokenId}`
              }
            >

              {land_id
                ? `${land_id}`
                : `Property #${String(tokenId).padStart(4, "0")}`}

            </h3>


            <p className="text-xs text-slate-400 font-mono mt-1">

              Token No #{tokenId}

            </p>

          </div>


          <span
            className={`
              font-bold
              px-3
              py-1
              rounded-xl
              text-sm
              border
              flex
              items-center
              gap-1.5
              whitespace-nowrap

              ${
                active
                  ? "text-indigo-600 bg-indigo-50 border-indigo-100"
                  : "text-slate-500 bg-slate-50 border-slate-100"
              }
            `}
          >

            <span
              className={`
                w-1.5
                h-1.5
                rounded-full

                ${
                  active
                    ? "bg-indigo-500 animate-pulse"
                    : "bg-slate-400"
                }
              `}
            />

            {active
              ? "For Sale"
              : "Unavailable"}

          </span>

        </div>


        {/* ====================================================
            LAND DETAILS
        ==================================================== */}

        <div className="flex-1 space-y-3 mb-6">

          {/* District */}

          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">

            <span className="material-symbols-outlined text-[18px]">
              location_on
            </span>

            <span className="truncate">

              District: {district || "N/A"}

            </span>

          </div>


          {/* Landmark */}

          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">

            <span className="material-symbols-outlined text-[18px]">
              map
            </span>

            <span className="truncate">

              Landmark: {landmark || "N/A"}

            </span>

          </div>


          {/* Land Type */}

          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">

            <span className="material-symbols-outlined text-[18px]">
              landscape
            </span>

            <span className="truncate">

              Type: {land_type || "N/A"}

            </span>

          </div>


          {/* Area */}

          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">

            <span className="material-symbols-outlined text-[18px]">
              square_foot
            </span>

            <span>

              Area: {formattedArea} sq.ft

            </span>

          </div>

        </div>


        {/* ====================================================
            PRICE
        ==================================================== */}

        <div className="mb-5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">

          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">

            Asking Price

          </p>

          <p className="text-2xl font-extrabold text-slate-900 mt-1">

            ₹{formattedPrice}

          </p>

        </div>


        {/* ====================================================
            ACTION BUTTON
        ==================================================== */}

        <Link
          href={`/buy/${tokenId}`}
          className="block mt-auto"
        >

          <button
            disabled={!active}
            className="
              w-full
              bg-slate-900
              text-white
              font-bold
              py-3.5
              rounded-xl
              hover:bg-indigo-600
              transition-all
              shadow-lg
              hover:shadow-xl
              active:scale-95
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:bg-slate-900
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <span className="material-symbols-outlined text-[18px]">
              shopping_cart
            </span>

            View & Buy

          </button>

        </Link>

      </div>

    </div>
  );
}