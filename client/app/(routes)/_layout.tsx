import { useSocket } from "@/context/SocketContext";
import { router, Slot } from "expo-router";
import { useEffect } from "react";

const RoutesLayout = () => {
  const { socketIo } = useSocket();
  useEffect(() => {
    const handleQuizRequestSended = (data: any) => {
      router.replace({
        pathname: "/(routes)/requestWaiting",
        params: { ...data },
      });
    };

    const handleAcceptedRedirect = (data: any) => {
      router.replace({
        pathname: "/(routes)/FriendRoom",
        params: { roomId: data.roomId },
      });
    };

    socketIo.on("quiz-request-sended", handleQuizRequestSended);
    socketIo.on("request-accept-room-redirect", handleAcceptedRedirect);
    return () => {
      socketIo.off("quiz-request-sended", handleQuizRequestSended);
      socketIo.off("request-accept-room-redirect", handleAcceptedRedirect);
    };
  }, []);
  return <Slot />;
};

export default RoutesLayout;
