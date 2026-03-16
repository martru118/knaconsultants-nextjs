import { create } from "zustand";

interface CopiedState {
  isCopied: string | null;
  setCopied: (link: string) => void;
  resetCopied: () => void;
}

export const useCopy = create<CopiedState>((set) => ({
  isCopied: null,
  setCopied: (link) => set({ isCopied: link }),
  resetCopied: () => set({ isCopied: null }),
}));
