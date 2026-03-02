"use client";

import { useRole } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
};

const Navbar = () => {
  const role = useRole();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input className="w-50 p-2 bg-transparent outline-none" type="text" placeholder="Search..." />
      </div>

      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-4 h-4 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">1</div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs leading-3 font-medium text-gray-800">
            {role ? ROLE_LABELS[role] ?? role : "—"}
          </span>
          <Link href="/logout" className="text-[10px] text-gray-500 hover:text-red-600 transition-colors">
            Log out
          </Link>
        </div>
        <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" />
      </div>
    </div>
  );
};

export default Navbar;