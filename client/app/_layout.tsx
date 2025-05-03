import React, { useEffect } from "react";
import { Slot, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import axios from "axios";
import { SocketProvider } from "@/context/SocketContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [loaded, error] = useFonts({
    "opensans-bold": require("@/assets/fonts/OpenSans-Bold.ttf"),
    "opensans-extrabold": require("@/assets/fonts/OpenSans-ExtraBold.ttf"),
    "opensans-light": require("@/assets/fonts/OpenSans-Light.ttf"),
    "opensans-medium": require("@/assets/fonts/OpenSans-Medium.ttf"),
    "opensans-regular": require("@/assets/fonts/OpenSans-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        "791454953921-46gv6gs1f5shlec7elrmiecb0gv47vpn.apps.googleusercontent.com",
      webClientId:
        "791454953921-mqv697l3v5ccgd3p1e5156mdp6jspcle.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  if (!loaded || error) return;

  axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

  return (
    <SocketProvider>
      <Slot />
    </SocketProvider>
  );
};

export default Layout;
