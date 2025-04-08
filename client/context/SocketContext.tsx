import { createContext, ReactNode, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useSocketStore } from "./zustandStore";

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

    const handleConnect = () => {
      addSessionId(socketIo.id);
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
