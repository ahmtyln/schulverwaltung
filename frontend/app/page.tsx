"use client";

import { getDashboardPath } from "@/lib/auth";
import { useRole } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
};

export default function Homepage() {
  const router = useRouter();
  const role = useRole();

  useEffect(() => {
    if (role) {
      router.replace(getDashboardPath(role));
      return;
    }
  }, [role, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FA] gap-6">
      <Image src="/logo.png" alt="Logo" width={64} height={64} />
      <h1 className="text-2xl font-bold text-gray-800">SchulKompass</h1>
      <p className="text-gray-500 text-sm">School management system</p>
      <div className="flex gap-4 mt-4">
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
