"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Lobster } from "next/font/google";

const lobster = Lobster({
  weight: "400", // Required for non-variable fonts like Lobster
  subsets: ["latin"],
});

export function CarouselAuto() {
  const plugin = React.useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
    })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-[90vw]"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Card className="h-[55vh] overflow-hidden p-0">

              <CardContent className="relative h-full p-0">

                
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdWQ3qneKPgjUpBshhWCQA8BX47qw2Lh4FiJDA4F5SiXrEyDBiwUx2HfWD&s=10"
                  alt="Land in Odisha"
                  className="w-full h-full object-cover  brightness-60 grayscale dark:brightness-40"
                />

                
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center text-white">

                  
                  <h1 className={`logo text-9xl md:text-8xl font-bold tracking-wide  ${lobster.className}`}>
                    Odisha
                  </h1>

                  
                  <p className="mt-4 text-l md:text-l font-mono font-medium">
                    Explore available properties
                  </p>

                </div>

              </CardContent>

            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}