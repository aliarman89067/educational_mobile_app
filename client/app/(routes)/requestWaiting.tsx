import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import FindingTimer from "@/components/findingTimer";
import axios from "axios";
import { useSocket } from "@/context/SocketContext";

const RequestWaiting = () => {
  const {
    roomId,
    subject,
    type,
    topicOrYear,
    friendSessionId,
    friendId,
    name,
    imageUrl,
    length,
    seconds,
  } = useLocalSearchParams();

  const { socketIo } = useSocket();

  useEffect(() => {
    const handleCancelCompleted = () => {
      router.replace({ pathname: "/makeQuiz", params: { type: "friend" } });
    };

    socketIo.on("cancel-quiz-completed", handleCancelCompleted);
    return () => {
      socketIo.off("cancel-quiz-completed", handleCancelCompleted);
    };
  }, []);

  const handleDisabledRoom = async () => {
    try {
      await axios.put("/quiz/disabled-friend-room", {
        roomId,
      });
    } catch (error) {
      console.log(error);
    } finally {
      router.back();
    }
  };

  const handleCancelRequest = () => {
    socketIo.emit("cancel-quiz-request", {
      roomId: roomId,
      friendId: friendId,
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl as string }}
        alt={`${name} image`}
        style={styles.image}
      />
      <Text style={styles.nameText}>{name}</Text>
      <View style={styles.timerContainer}>
        <FindingTimer time={15} isStart={true} fn={handleDisabledRoom} />
      </View>
      <TouchableOpacity
        onPress={handleCancelRequest}
        activeOpacity={0.7}
        style={styles.cancelButton}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RequestWaiting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 300,
    resizeMode: "contain",
  },
  nameText: {
    color: colors.grayDark,
    fontFamily: fontFamily.Bold,
    fontSize: 18,
    marginVertical: 10,
  },
  timerContainer: {
    marginTop: 50,
  },
  cancelButton: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#e5383b",
  },
  cancelText: {
    color: "white",
    fontFamily: fontFamily.Regular,
    fontSize: 15,
  },
});
