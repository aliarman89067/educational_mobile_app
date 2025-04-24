import { createContext, ReactNode, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useSocketStore } from "./zustandStore";
import asyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface Props {
  socketIo: Socket;
}

const SocketContext = createContext<Props | undefined>(undefined);

let socketInstance: Socket | null = null;

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { addSessionId } = useSocketStore();

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(process.env.EXPO_PUBLIC_API_BASE_URL, {
        transports: ["websocket"],
      });
    }

    const socketIo = socketInstance;

    const handleConnect = async () => {
      const userDataString = await asyncStorage.getItem("current-user");

      addSessionId(socketIo.id);
      if (userDataString) {
        const userDataParse = JSON.parse(userDataString);
        await axios.put("/user/updateSession", {
          sessionId: socketIo.id,
          userId: userDataParse.id,
        });
      }
    };

    socketIo.on("connect", handleConnect);

    return () => {
      socketIo.off("connect", handleConnect);
    };
  }, []);

  if (!socketInstance) return null;

  return (
    <SocketContext.Provider value={{ socketIo: socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Context must be wrapped within provider");
  }

  return context;
};
