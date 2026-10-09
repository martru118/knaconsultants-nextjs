"use client"

import { useClerk } from "@clerk/nextjs"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert"
import { Button } from "../ui/button"
import { AlertTriangleIcon } from "lucide-react"

export function OnboardingAlert() {
  const { openUserProfile, user } = useClerk()
  const providers = user?.externalAccounts.map(accounts => accounts.provider)
  
  // show when user is missing Google Account
  if (providers?.includes("google")) {
    return null
  } else {
    return (
      <div className="pb-4">
        <Alert className="max-w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
          <AlertTriangleIcon />
          <AlertTitle>Connect your Google Account</AlertTitle>
          <AlertDescription>
            You must connect your Google Account to allow clients to book meetings with you.
          </AlertDescription>
    
          <AlertAction>
            <Button 
              onClick={() => openUserProfile() }
              className="bg-amber-900 hover:bg-amber-700" 
              size="xs" 
              variant="default"
            >
              Connect
            </Button>
          </AlertAction>
        </Alert>
      </div>
    )
  }
}