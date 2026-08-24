"use client"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Outfit } from "next/font/google";
import { useEffect, useState } from "react";
import { getProfileCookie, clearAuthCookies } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const outfit = Outfit({
  subsets: ["latin"],
});

export function AvatarDropdown() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getProfileCookie().then(data => {
      if (data) setProfile(data);
    });
  }, []);

  const getInitials = () => {
    if (profile?.first_name) return profile.first_name.substring(0, 2).toUpperCase();
    if (profile?.username) return profile.username.substring(0, 2).toUpperCase();
    return "U";
  };

  const handleLogout = async () => {
    await clearAuthCookies();
    // Redirect to home and refresh state
    router.push('/');
    router.refresh(); // forces Next.js to re-evaluate server components (like checking cookies again)
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 ring-2 ring-slate-100 ring-offset-2 hover:ring-indigo-100 transition-all overflow-hidden group">
          <Avatar className="h-full w-full group-hover:scale-110 transition-transform">
            {profile?.photo_link ? (
              <img src={`data:image/jpeg;base64,${profile.photo_link}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold">{getInitials()}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      } />
      
      <DropdownMenuContent className={`w-56 mt-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-100 shadow-xl p-2 ${outfit.className}`} align="end">
        <div className="px-2 py-3 mb-2 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-800 capitalize">{profile?.first_name || profile?.username || 'User'}</p>
          <p className="text-xs text-slate-500 font-medium truncate">{profile?.username || 'user@ledger.gov.in'}</p>
        </div>
        
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem className="p-0 rounded-xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors">
            <Link href="/profile" className="flex items-center gap-3 w-full p-3 text-slate-700 font-medium rounded-xl">
              <span className="material-symbols-outlined text-[20px] text-slate-400">person</span>
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 rounded-xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors">
            <Link href="/dashboard" className="flex items-center gap-3 w-full p-3 text-slate-700 font-medium rounded-xl">
              <span className="material-symbols-outlined text-[20px] text-slate-400">dashboard</span>
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 rounded-xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors">
            <Link href="/settings" className="flex items-center gap-3 w-full p-3 text-slate-700 font-medium rounded-xl">
              <span className="material-symbols-outlined text-[20px] text-slate-400">settings</span>
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="my-2 bg-slate-100" />
        
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={handleLogout}
            className="rounded-xl cursor-pointer hover:bg-red-50 focus:bg-red-50 transition-colors p-3 group flex items-center gap-3 w-full text-red-600 font-medium text-left"
          >
            <span className="material-symbols-outlined text-[20px] text-red-400 group-hover:text-red-600 transition-colors">logout</span>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
