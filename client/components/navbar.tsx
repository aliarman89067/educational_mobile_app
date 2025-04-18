import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as Linking from "expo-linking";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import { bell, logoImage } from "@/constants/images";
import { storage } from "@/utils";
import { User_Type } from "@/utils/type";
import { router } from "expo-router";

const Navbar = () => {
  const [data, setData] = useState<User_Type | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = storage.getString("current-user");
    if (userData) {
      setData(JSON.parse(userData!!));
    } else {
      router.replace("/(auth)");
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    storage.delete("current-user");
    router.replace("/(auth)");
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
          <Image
            source={{ uri: data?.imageUrl }}
            alt={`${data?.name} profile image`}
            style={styles.profileImg}
          />
        </TouchableOpacity>
        <Text style={styles.nameText}>{data?.name}</Text>
      </View>
      <Image source={logoImage} style={styles.logoImg} />
      <TouchableOpacity activeOpacity={0.7} style={styles.bellBox}>
        <Image
          source={bell}
          alt="Notification bell images"
          style={styles.bellImg}
        />
        <View style={styles.notificationCircle}>
          <Text style={styles.notificationNumberText}>1</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  profileImg: {
    width: 35,
    height: 35,
    borderRadius: 12,
    resizeMode: "cover",
  },
  nameText: {
    fontFamily: fontFamily.Medium,
    fontSize: 13,
    color: colors.grayLight,
  },
  logoImg: {
    width: 140,
    height: 60,
    resizeMode: "contain",
  },
  bellBox: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    position: "relative",
    elevation: 3,
    borderRadius: 10,
  },
  bellImg: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    backgroundColor: "white",
  },
  notificationCircle: {
    position: "absolute",
    top: 7,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 20,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationNumberText: {
    fontSize: 10,
    color: "white",
    fontFamily: fontFamily.Medium,
  },
});
