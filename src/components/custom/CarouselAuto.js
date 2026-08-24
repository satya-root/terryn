"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Lobster, Outfit } from "next/font/google";

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
});

const PRESTIGE_PROPERTIES = [
  {
    title: "Marine Drive Estate, Puri",
    subtitle: "Premium Coastal Land Parcel near Golden Beach",
    price: "Starting from ₹12.4 Cr",
    image: "https://plus.unsplash.com/premium_photo-1697644693174-216346d85792?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxhbmR8ZW58MHx8MHx8fDA%3D"
  },
  {
    title: "Chilika Lakefront Reserve",
    subtitle: "Verified Eco-Tourism Property Zone",
    price: "Starting from ₹8.2 Cr",
    image: "https://rei.wlimg.com/prop_images/3822165/1381441_3.jpg"
  },
  {
    title: "Infocity Premium, Bhubaneswar",
    subtitle: "High-Yield Commercial Tech Sector",
    price: "Starting from ₹4.5 Cr",
    image: "https://5.imimg.com/data5/SELLER/Default/2025/3/493840316/LK/FC/AA/40529957/whatsapp-image-2025-02-03-at-8-31-02-pm-500x500.jpeg"
  }
];

export function CarouselAuto() {
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      className={`w-full h-full ${outfit.className}`}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="h-full ml-0">
        {PRESTIGE_PROPERTIES.map((property, index) => (
          <CarouselItem key={index} className="h-[50vh] p-0 relative overflow-hidden pl-0">
            
            {/* Image Background */}
            <img
              src={property.image}
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[10000ms] ease-out"
            />
            
            {/* Gradients for readability and premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent z-10" />

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 lg:p-16">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                <div className="max-w-2xl">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Blockchain Verified
                  </div>
                  
                  {/* Title */}
                  <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-2 ${lobster.className}`}>
                    {property.title}
                  </h1>
                  
                  {/* Subtitle */}
                  <p className="text-lg md:text-xl text-slate-300 font-medium max-w-xl">
                    {property.subtitle}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Price Tag */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white text-right">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-1">Valuation</div>
                    <div className="text-2xl font-bold">{property.price}</div>
                  </div>
                </div>
              </div>

            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {PRESTIGE_PROPERTIES.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === i ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </Carousel>
  );
}