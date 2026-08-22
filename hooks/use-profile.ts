import { cachedUserProfile } from "@/actions/users";
import { create } from "zustand";

interface ProfileState {
  profile: string | null,
  isUpdated: boolean,
  fetchProfile: (email: string) => Promise<void>,
  setIsUpdated: (status: boolean) => void
}

export const useProfileStore = create<ProfileState>(set => ({
  profile: null,
  isUpdated: false,
  fetchProfile: async(email) => {
    // fetch username from Clerk
    const username = await cachedUserProfile(email)
    set({ profile: username })
  },
  setIsUpdated: (status) => set({ isUpdated: status })
}))