"use client"

import { getPathTitle } from "@/lib/helper";
import { usePathname } from "next/navigation";
import { MoonLoader } from "react-spinners";

export function AppLoader() {
  const pathname = usePathname()
  const title = getPathTitle(pathname.slice(1))

	return (
    <div className="flex flex-col w-full pt-20 m-auto gap-5 items-center">
      <MoonLoader size={100} color="#4f39f6" />
      <span>Loading {title}...</span>
    </div>
	);
}