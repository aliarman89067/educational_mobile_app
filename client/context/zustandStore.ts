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

interface UseRequestQuizData {
  roomId: string;
  subject: string;
  type: string;
  topicOrYear: string;
  friendSessionId: string;
  friendId: string;
  name: string;
  imageUrl: string;
  length: number;
  seconds: number;
}

interface UseRequestQuizReceivedStore {
  data: UseRequestQuizData | null;
  addData: (values: UseRequestQuizData) => void;
  removeData: () => void;
}

export const useRequestQuizReceivedStore = create<UseRequestQuizReceivedStore>(
  (set, get) => ({
    data: null,
    addData: (data) => {
      set({ data });
    },
    removeData: () => {
      set({ data: null });
    },
  })
);

interface UseSketchCanvasPayload {
  undoStackNodes: any[];
  redoStackNodes: any[];
  pathsNodes: any[];
  imagePathString: string;
}

interface UseSketchCanvasProps {
  data: UseSketchCanvasPayload;
  status: "start" | "pending" | "end";
  start: (value: UseSketchCanvasPayload & { index: number }) => void;
  pending: (value: UseSketchCanvasPayload) => void;
  end: () => void;
  index: number;
}

export const useSketchCanvasStore = create<UseSketchCanvasProps>(
  (set, get) => ({
    data: {
      undoStackNodes: [],
      redoStackNodes: [],
      pathsNodes: [],
      imagePathString: "",
    },
    index: 0,
    status: "end",
    start: (data) => {
      set({
        status: "start",
        data: {
          undoStackNodes: data.undoStackNodes,
          redoStackNodes: data.redoStackNodes,
          pathsNodes: data.pathsNodes,
          imagePathString: data.imagePathString,
        },
        index: data.index,
      });
    },
    pending: (data) => {
      set({
        status: "pending",
        data: {
          undoStackNodes: data.undoStackNodes,
          redoStackNodes: data.redoStackNodes,
          pathsNodes: data.pathsNodes,
          imagePathString: data.imagePathString,
        },
      });
    },
    end: () => {
      set({
        status: "end",
        data: {
          undoStackNodes: [],
          redoStackNodes: [],
          pathsNodes: [],
          imagePathString: "",
        },
        index: 0,
      });
    },
  })
);
