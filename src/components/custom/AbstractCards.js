"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    img: "/assets/1.jpg",
    pos: "h-[15vw] w-[13vw] max-md:h-[32vw] max-md:w-[26vw] top-[10%] left-[10%] max-md:top-[8%] max-md:left-[6%]",
    bg: "bg-red-500",
  },
  {
    img: "/assets/3.jpg",
    pos: "h-[13vw] w-[10vw] max-md:h-[23vw] max-md:w-[18vw] top-[20%] left-[5%] max-md:top-[14%] max-md:left-[3%]",
    bg: "bg-blue-500",
  },
  {
    img: "/assets/2.jpg",
    pos: "h-[20vw] w-[17vw] max-md:h-[33vw] max-md:w-[28vw] top-[70%] left-[0%] max-md:top-[56%] max-md:left-[0%]",
    bg: "bg-green-500",
  },
  {
    img: "/assets/4.jpg",
    pos: "h-[13vw] w-[17vw] max-md:h-[25vw] max-md:w-[28vw] top-[75%] left-[20%] max-md:top-[65%] max-md:left-[16%]",
    bg: "bg-yellow-500",
  },
  {
    img: "/assets/5.jpg",
    pos: "h-[12vw] w-[10vw] max-md:h-[25vw] max-md:w-[18vw] top-[10%] left-[55%] max-md:top-[8%] max-md:left-[50%]",
    bg: "bg-yellow-500",
  },
  {
    img: "/assets/8.jpg",
    pos: "h-[17vw] w-[17vw] max-md:h-[33vw] max-md:w-[29vw] top-[20%] right-[1%] max-md:top-[13%] max-md:right-[2%]",
    bg: "bg-blue-500",
  },
  {
    img: "/assets/6.jpg",
    pos: "h-[19vw] w-[18vw] max-md:h-[34vw] max-md:w-[30vw] top-[70%] right-[5%] max-md:top-[56%] max-md:right-[6%]",
    bg: "bg-green-500",
  },
  {
    img: "/assets/7.jpg",
    pos: "h-[15vw] w-[14vw] max-md:h-[26vw] max-md:w-[23vw] top-[80%] right-[15%] max-md:top-[70%] max-md:right-[11%]",
    bg: "bg-red-500",
  },
];

const AbstractCards = () => {
  const sectionRef = useRef(null);
  const wrappersRefs = useRef([]);
  const innersRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const initial = CARDS.map(() => ({
      rotation: Math.round(Math.random() * 60 - 30),
      scale: 1.3,
      zIndex: gsap.utils.random(5, 50, 1),
    }));

    wrappersRefs.current.forEach((wrapper, idx) => {
      if (wrapper) wrapper.style.zIndex = String(initial[idx].zIndex);
    });

    const ctx = gsap.context(() => {
      innersRefs.current.forEach((inner, idx) => {
        const wrapper = wrappersRefs.current[idx];
        if (!inner || !wrapper) return;

        const measureOffset = () => {
          const wRect = wrapper.getBoundingClientRect();
          const sRect = section.getBoundingClientRect();
          return {
            x: sRect.left + sRect.width / 2 - (wRect.left + wRect.width / 2),
            y: sRect.top + sRect.height / 2 - (wRect.top + wRect.height / 2),
          };
        };

        gsap.fromTo(
          inner,
          {
            x: () => measureOffset().x,
            y: () => measureOffset().y,
            scale: initial[idx].scale,
            rotate: initial[idx].rotation,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            ease: "back.inOut(2)",
            scrollTrigger: {
              trigger: section,
              start: "top 20%",
              end: "top -10%",
              scrub: 1.3,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full flex flex-col items-center justify-center bg-[#FCFCFC] text-[#1b1b1b] overflow-x-clip relative"
    >
      <h2 className="max-md:text-[14vw] text-center text-[9vw] font-semibold leading-[.8] tracking-tight">
        new to <br /> Terryn?
      </h2>

      <p className="mt-10 max-md:mt-8 max-md:w-[85vw] max-md:text-[3.7vw] w-[40%] text-center text-[1.3vw] leading-[1.3] tracking-tight">
        Terryn is a blockchain-powered platform that transforms land records
        into secure, verifiable digital assets. Discover trusted ownership,
        transparent property history, and a seamless marketplace designed to
        make land transactions safer and simpler.
      </p>

      <button
        type="button"
        className="mt-10 max-md:mt-8 max-md:px-8 max-md:py-3 max-md:text-[4vw] rounded-full bg-[#1b1b1b] px-6 py-2 text-1.25vw] font-semibold text-white"
      >
        <Link href="/explore">Learn more</Link>
      </button>

      {CARDS.map((card, idx) => (
        <div
          key={card.img}
          ref={(el) => {
            wrappersRefs.current[idx] = el;
          }}
          className={`absolute ${card.pos}`}
        >
          <div
            ref={(el) => {
              innersRefs.current[idx] = el;
            }}
            className={`h-full w-full overflow-hidden rounded-2xl will-change-transform ${card.bg}`}
          >
            <img
              src={card.img}
              className="pointer-events-none w-full h-full select-none object-cover"
              draggable={false}
              alt="img"
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default AbstractCards;
