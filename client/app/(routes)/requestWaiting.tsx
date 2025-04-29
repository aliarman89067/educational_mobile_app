import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import FindingTimer from "@/components/findingTimer";
import axios from "axios";

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
});
