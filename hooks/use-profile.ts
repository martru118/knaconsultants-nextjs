import { getProfileUsername } from "@/actions/users";
import { create } from "zustand";

interface ProfileState {
  profile: string | null,
  fetchProfile: (email: string) => Promise<void>
}

export const useProfileStore = create<ProfileState>(set => ({
  profile: null,
  fetchProfile: async(email) => {
    // fetch username from database
    const username = await getProfileUsername(email)
    set({ profile: username })
  }
}))