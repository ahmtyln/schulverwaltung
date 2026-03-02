import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      <aside className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] min-w-[64px] p-4 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2 shrink-0">
          <Image src="/logo.png" alt="logo" width={32} height={32}/>
          <span className="hidden lg:block font-bold">SchulKompass</span>
        </Link>
        <nav className="flex-1 mt-4 overflow-y-auto">
          <Menu />
        </nav>
      </aside>
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar/>
        {children}
      </div>
    </div>
  );
}