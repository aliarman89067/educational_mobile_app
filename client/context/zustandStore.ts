import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import asyncStorage from "@react-native-async-storage/async-storage";

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

interface RequestType {
  fullName: string;
  emailAddress: string;
  imageUrl: string;
  id: string;
  sessionId: string;
}

interface UseRequestReceivedStore {
  requests: RequestType[] | null;
  addRequest: (data: RequestType) => void;
  addRequests: (data: RequestType[]) => void;
  removeRequest: (id: string) => void;
  resetRequests: () => void;
}

export const useRequestReceivedStore = create<UseRequestReceivedStore>()(
  persist(
    (set, get) => ({
      requests: null,
      addRequest: (data) => {
        const currentData = get().requests ?? [];
        set({ requests: [...currentData, data] });
      },
      addRequests: (data) => {
        set({ requests: data });
      },
      removeRequest: (id) => {
        const request = get().requests;
        if (!request || request.length === 0) return;
        const filteredRequest = request.filter((req) => req.id !== id);
        set({ requests: filteredRequest });
      },
      resetRequests: () => {
        set({ requests: null });
      },
    }),
    {
      name: "request-received",
      storage: createJSONStorage(() => asyncStorage),
    }
  )
);
// Try Async Storage rather than sessionStorage
