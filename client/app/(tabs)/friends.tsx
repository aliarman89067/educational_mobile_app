import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { router, usePathname } from "expo-router";

const Friends = () => {
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/user/all-users/${user?.id}`);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user, pathname, router]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View style={[styles.loadingModal, { backgroundColor: "white" }]}>
          <View style={styles.loadingContent}>
            <ActivityIndicator color={colors.grayLight} size={40} />
            <Text style={[styles.loadingText, { color: colors.grayLight }]}>
              Please Wait...
            </Text>
          </View>
        </View>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default Friends;

const styles = StyleSheet.create({
  loadingModal: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "rgba(0,0,0,.6)",
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fontFamily.Regular,
  },
});
