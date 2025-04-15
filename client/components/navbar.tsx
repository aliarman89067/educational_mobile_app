import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as Linking from "expo-linking";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import { bell, logoImage, starFill } from "@/constants/images";
import { router } from "expo-router";

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/profile")}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: user?.imageUrl }}
          alt={`${user?.fullName} profile image`}
          style={styles.profileImg}
        />
      </TouchableOpacity>
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
    width: 40,
    height: 40,
    borderRadius: 8,
    resizeMode: "cover",
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
