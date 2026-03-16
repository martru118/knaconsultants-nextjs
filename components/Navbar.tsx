import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./UserMenu";
import { checkUser } from "@/lib/checkUser";

async function Navbar() {
  await checkUser()
  
  return (
    <nav className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2">
      <Link href={"/"} className="flex items-center">
        <Image
          src="/logo.png"
          width="150"
          height="60"
          alt="Company Logo"
          className="h-16 w-auto"
        />
      </Link>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link href="/events?create=true">
            <Button className="flex items-center gap-2">
              <PenBox size={18} />
              Create Event
            </Button>
          </Link>

          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;
