"use client";

import { clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    clearToken();
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
      <p className="text-gray-500">Logging out...</p>
    </div>
  );
}
