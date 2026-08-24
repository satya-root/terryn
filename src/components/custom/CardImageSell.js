import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function CardImageSell({ property }) {
  if (!property) return null;

  const area = Number.parseFloat(property.area);

  const formattedArea =
    Number.isFinite(area)
      ? area.toFixed(2)
      : "N/A";

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative">

      <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors pointer-events-none" />

      <div className="relative aspect-[4/3] w-full overflow-hidden p-2 pb-0">
        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/60 to-transparent" />

          <img
            src={
              property.land_photo ||
              "https://assets.site-static.com/userFiles/1681/image/uploads/agent-1/buy-sell-land.jpg"
            }
            alt={property.name || "Terryn Property"}
            className="relative z-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%]"
          />

          <div className="absolute top-3 left-3 z-20">
            <Badge className="bg-white/90 text-slate-800 hover:bg-white border-0 shadow-sm backdrop-blur-md px-3 py-1 font-bold">
              {property.state || "State"}
            </Badge>
          </div>

          <div className="absolute bottom-3 right-3 z-20">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono px-3 py-1.5 rounded-full">
              Token #{property.tokenId}
            </span>
          </div>

        </div>
      </div>


      <div className="p-6 pt-5 flex-1 flex flex-col relative z-20">

        <div className="flex justify-between items-start mb-4 gap-2">

          <h3
            className="text-xl font-bold tracking-tight text-slate-800 truncate"
            title={`${property.land_type} - Token #${property.tokenId}`}
          >
            {property.land_type || "Land"} - #
            {String(property.tokenId).padStart(4, "0")}
          </h3>

          <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-xl text-xs border border-emerald-100 flex items-center gap-1 whitespace-nowrap">

            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

            Owned
          </span>

        </div>


        <div className="flex-1 space-y-3 mb-6">

          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">
              location_on
            </span>

            <span className="truncate">
              District: {property.district || "N/A"}
            </span>
          </div>


          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">

            <span className="material-symbols-outlined text-[18px]">
              map
            </span>

            <span className="truncate">
              Landmark: {property.landmark || "N/A"}
            </span>
          </div>


          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">

            <span className="material-symbols-outlined text-[18px]">
              square_foot
            </span>

            <span>
              Area: {formattedArea} sq ft
            </span>
          </div>

        </div>


        {/* tokenId becomes [slug] */}

        <Link
          href={`/list/${property.tokenId}`}
          className="mt-auto block"
        >
          <button
            className="
              w-full
              bg-gradient-to-r
              from-slate-900
              to-slate-800
              text-white
              font-bold
              py-3.5
              px-6
              rounded-xl
              transition-all
              shadow-lg
              hover:-translate-y-1
              hover:shadow-xl
              active:scale-95
              cursor-pointer
              flex
              items-center
              justify-center
              gap-2
            "
          >
            Manage Asset

            <span className="material-symbols-outlined text-[18px]">
              settings
            </span>
          </button>
        </Link>

      </div>

    </div>
  );
}