import React from "react";
import Image from "next/image";
// import { Avatar } from '@mui/material'
// import { Avatar } from '@base-ui/react'
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import logo from "../../../public/img/logo.svg";
import { AvatarDropdown } from "./AvatarDropdown";
import Link from "next/link";
import { Lobster } from "next/font/google";

const lobster = Lobster({
  weight: "400", // Required for non-variable fonts like Lobster
  subsets: ["latin"],
});

const Navbar = () => {
  return (
    <>
      <div className="container flex flex-col justify-center bg-center min-w-screen bg-[#FCF9F8] min-h-[10vh] border-b-1 border-black">
        <div className="flex flex-row justify-around items-center ">
          <div className="flex flex-row justify-center items-center space-x-2">
            <Image
              src={logo}
              alt="Picture of the author"
              width={75}
              height={75} // Optional: gives a smooth blur-up effect while loading
            />
            <div className={`logo text-3xl ${lobster.className}`}>Terryn.in</div>
          </div>

          <div className="menu font-mono text-[060606] flex flex-row justify-center items-center space-x-3.5">
            <div>
              <Link href="/">Home</Link>
            </div>
            <div>
              <Link href="/">About</Link>
            </div>
            <div>
              <Link href="/">Help</Link>
            </div>
            <div>
              <Link href="/explore">Explore</Link>
            </div>
          </div>

          <div className="right flex flex-row justify-center items-center space-x-2">
            <Link href="/addproperty">
              <Button
                variant="default"
                className="bg-[#060606] font-mono text-[#FCFCFC]"
              >
                Add Entity 
              </Button>
            </Link>
            <AvatarDropdown />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
