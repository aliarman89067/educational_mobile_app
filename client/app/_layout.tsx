import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import axios from "axios";
import { SocketProvider } from "@/context/SocketContext";

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

  if (!loaded || error) return;

  axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;
  return (
    <SocketProvider>
      <ClerkProvider tokenCache={tokenCache}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(routes)" />
        </Stack>
      </ClerkProvider>
    </SocketProvider>
  );
};

export default Layout;
