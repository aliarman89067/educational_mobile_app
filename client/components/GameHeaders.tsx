import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  joinFriendHeader,
  onlineHeader,
  soloHeader,
  surprise,
} from "@/constants/images";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import { router } from "expo-router";

const GameHeaders = () => {
  const handlePlay = (type: "solo" | "online" | "friend") => {
    router.push({
      pathname: "/(routes)/makeQuiz",
      params: { type },
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={onlineHeader}
          alt="Online Header Image"
          style={styles.headerImg}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handlePlay("online")}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Play Online</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { position: "relative" }]}
            activeOpacity={0.7}
          >
            <Image
              source={surprise}
              alt="Surprise text Image"
              style={styles.surpriseImg}
            />
            <Text style={styles.buttonText}>Play Random</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.header}>
        <Image
          source={joinFriendHeader}
          alt="Join Friend Image"
          style={styles.headerImg}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handlePlay("friend")}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Request Friend</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.header}>
        <Image
          source={soloHeader}
          alt="Solo Header Image"
          style={styles.headerImg}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handlePlay("solo")}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Play Solo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { position: "relative" }]}
            activeOpacity={0.7}
          >
            <Image
              source={surprise}
              alt="Surprise text Image"
              style={styles.surpriseImg}
            />
            <Text style={styles.buttonText}>Play Random</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GameHeaders;

const styles = StyleSheet.create({
  container: {
    gap: 20,
    width: "100%",
    flex: 1,
  },
  header: {
    gap: 3,
    width: "100%",
  },
  headerImg: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  button: {
    backgroundColor: colors.purple,
    width: 155,
    paddingVertical: 16,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontFamily: fontFamily.Medium,
  },
  surpriseImg: {
    position: "absolute",
    top: -30,
    right: -25,
    width: 90,
    height: 60,
    resizeMode: "contain",
  },
});
