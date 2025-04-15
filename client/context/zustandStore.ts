import { create } from "zustand";

interface UseSocketStore {
  sessionId: string | undefined;
  addSessionId: (value: string | undefined) => void;
}

export const useSocketStore = create<UseSocketStore>((set, get) => ({
  sessionId: "",
  addSessionId: (id) => {
    set({ sessionId: id });
  },
}));
