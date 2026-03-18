import { create } from "zustand";

interface CopiedStore {
  isCopied: string | null;
  setCopied: (link: string) => void;
  resetCopied: () => void;
}

export const useCopy = create<CopiedStore>((set) => ({
  isCopied: null,
  setCopied: (link) => set({ isCopied: link }),
  resetCopied: () => set({ isCopied: null }),
}));
