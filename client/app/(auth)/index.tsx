import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import {
  authBgImage,
  googleImage,
  logoImage,
  userGuest,
} from "@/constants/images";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import axios from "axios";
import asyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useSocketStore } from "@/context/zustandStore";

const AuthPage = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleErrorMessage, setGoogleErrorMessage] = useState("");
  const { sessionId } = useSocketStore();

  const onGuestPress = async () => {
    try {
      const { data } = await axios.post("/guest/");

      const storageData = {
        id: data._id,
        isGuest: true,
        count: data.count,
        createdAt: data.createdAt,
        imageUrl: data.imageUrl,
        fullName: data.fullName,
      };
      await asyncStorage.setItem("current-user", JSON.stringify(storageData));
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleErrorMessage("");
      setIsGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const {
          name: fullName,
          email: emailAddress,
          photo: imageUrl,
        } = response.data.user;
        const { data } = await axios.post("/user/", {
          fullName,
          emailAddress,
          imageUrl,
          sessionId,
        });

        const storageData = {
          id: data._id,
          isGuest: false,
          createdAt: data.createdAt,
          imageUrl: data.imageUrl,
          fullName: data.fullName,
        };
        await asyncStorage.setItem("current-user", JSON.stringify(storageData));
        router.replace("/(tabs)");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            setGoogleErrorMessage("Google Sign-in is already in progress!");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setGoogleErrorMessage(
              "Google Play services are not available or are outdated!"
            );
            break;
          default:
            setGoogleErrorMessage("An error occurred. Please try again later!");
        }
      } else {
        setGoogleErrorMessage("An error occurred. Please try again later!");
      }
    } finally {
      setIsGoogleLoading(false);
    }
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
        <View style={{ width: "100%", gap: 2, alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleGoogleLogin}
            activeOpacity={0.7}
            style={styles.googleButton}
          >
            <Text style={styles.googleText}>Login with Google</Text>
            <Image
              source={googleImage}
              style={styles.googleImage}
              alt="Google Icon Image"
              resizeMode="contain"
            />
          </TouchableOpacity>
          {googleErrorMessage && (
            <Text style={styles.errorText}>{googleErrorMessage}</Text>
          )}
        </View>
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
    height: 200,
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
  errorText: {
    fontSize: 13,
    fontFamily: fontFamily.Regular,
    color: "#ff8fa3",
  },
});
