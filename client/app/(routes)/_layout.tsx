import { useSocket } from "@/context/SocketContext";
import { router, Slot } from "expo-router";
import { useEffect } from "react";

const RoutesLayout = () => {
  const { socketIo } = useSocket();
  useEffect(() => {
    const handleQuizRequestSended = (data: any) => {
      router.push({
        pathname: "/(routes)/requestWaiting",
        params: { ...data },
      });
    };
    socketIo.on("quiz-request-sended", handleQuizRequestSended);
    return () => {
      socketIo.off("quiz-request-sended", handleQuizRequestSended);
    };
  }, []);
  return <Slot />;
};

export default RoutesLayout;
