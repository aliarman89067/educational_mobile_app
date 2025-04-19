import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useCallback } from "react";
import {
  authBgImage,
  googleImage,
  logoImage,
  userGuest,
} from "@/constants/images";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import axios from "axios";
import { storage } from "@/utils";
import { router } from "expo-router";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

const AuthPage = () => {
  const onGuestPress = async () => {
    const { data } = await axios.post("/guest/");
    console.log(data);
    const storageData = {
      id: data._id,
      isGuest: true,
      count: data.count,
      createdAt: data.createdAt,
      imageUrl: data.imageUrl,
      fullName: data.fullName,
    };
    storage.set("current-user", JSON.stringify(storageData));
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={logoImage}
          alt="Auth background Image"
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={authBgImage}
          alt="Auth background Image"
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.authContainer}>
        <TouchableOpacity
          onPress={onGuestPress}
          activeOpacity={0.7}
          style={styles.googleButton}
        >
          <Text style={styles.googleText}>Start as Guest</Text>
          <Image
            source={userGuest}
            style={styles.googleImage}
            alt="Google Icon Image"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthPage;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  logo: {
    width: 130,
    resizeMode: "contain",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    transform: [{ translateY: 60 }],
  },
  image: {
    height: "100%",
  },
  authContainer: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 180,
    gap: 10,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  googleButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#fff",
    borderRadius: 400,
    width: "80%",
    height: 70,
  },
  googleText: {
    fontSize: 16,
    fontFamily: fontFamily.Medium,
  },
  googleImage: {
    width: 25,
  },
});
