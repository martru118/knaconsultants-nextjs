import Image from "next/image";
import { header } from "@/public/messages/en.json";

interface LogoProps {
  size: number,
}

export default function Logo({size}: LogoProps) {
  return (
    <Image 
      src="/logo.svg"
      alt={header.alt}
      className="dark:invert" 
      width={size} 
      height={size}
      unoptimized
    />
  );
}