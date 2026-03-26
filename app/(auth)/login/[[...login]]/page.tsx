import { SignIn } from "@clerk/nextjs";

function Page() {
  return <SignIn forceRedirectUrl="/dashboard" />
}

export default Page;