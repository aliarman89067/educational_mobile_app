import { createContext, ReactNode, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useSocketStore } from "./zustandStore";

interface Props {
  socketIo: Socket;
}

const SocketContext = createContext<Props | undefined>(undefined);

let socketInstance: Socket | null = null;

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketIo = socketInstance || io(process.env.EXPO_PUBLIC_API_BASE_URL);
  const { addSessionId } = useSocketStore();

  useEffect(() => {
    socketIo.on("connect", () => {
      addSessionId(socketIo.id);
    });
    return () => {
      socketIo.off("connect");
    };
  }, []);

  if (!socketInstance) {
    socketInstance = socketIo;
  }

  return (
    <SocketContext.Provider value={{ socketIo }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): Props => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Context must be wrapped within provider");
  }
  return context;
};
