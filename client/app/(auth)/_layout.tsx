import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, router, Slot, usePathname } from "expo-router";
import { storage } from "@/utils";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";

const AuthLayout = () => {
  // const { isSignedIn, isLoaded } = useAuth();
  // if (!isLoaded) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  // if (isSignedIn) {
  //   return <Redirect href="/(tabs)" />;
  // }
  // return <Slot />;

  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = storage.getString("current-user");
    if (currentUser) {
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 0);
    }
    setIsLoading(false);
  }, [pathname, router, storage]);
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <ActivityIndicator size={25} color={colors.purple} />
        <Text
          style={{
            color: colors.purple,
            fontSize: 17,
            fontFamily: fontFamily.Medium,
          }}
        >
          Loading
        </Text>
      </View>
    );
  }
  return <Slot />;
};

export default AuthLayout;

const styles = StyleSheet.create({});
