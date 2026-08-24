"use client";

import dynamic from "next/dynamic";

const PropertyMapClient = dynamic(
  () => import("./PropertyMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#FCF9F8]">
        <p className="text-black/50">
          Loading map...
        </p>
      </div>
    ),
  }
);

export default PropertyMapClient;