import { Image, StyleSheet, Text, ToastAndroid, View } from "react-native";
import { router, Tabs } from "expo-router";
import {
  friendsImage,
  historyImage,
  homeImage,
  profileImage,
} from "@/constants/images";
import { colors } from "@/constants/colors";
import { useEffect, useState } from "react";
import asyncStorage from "@react-native-async-storage/async-storage";
import { useSocket } from "@/context/SocketContext";
import { useRequestReceivedStore } from "@/context/zustandStore";

interface TabBarIconProps {
  focused: boolean;
  icon: HTMLImageElement;
  label?: string;
}

const TabBarIcon = ({ focused, icon, label }: TabBarIconProps) => {
  return (
    <View style={styles.tabBarIconContainer}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={focused ? colors.primary : colors.grayDark}
        style={{ width: 22, height: 22 }}
      />
      <Text
        style={[
          styles.tabBarIconLabel,
          { color: focused ? colors.primary : colors.grayDark },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await asyncStorage.getItem("current-user");

      if (!currentUser) {
        setTimeout(() => {
          router.replace("/(auth)");
        }, 0);
      }
    };
    loadUser();
  }, []);
  const { socketIo } = useSocket();
  const { addRequest, removeRequest, requests } = useRequestReceivedStore();
  useEffect(() => {
    // resetRequests();
    const handleFriendAdded = () => {};
    const handleRequestReceived = (data: any) => {
      const { fullName, emailAddress, imageUrl, id, sessionId, status } = data;
      console.log(fullName, emailAddress, imageUrl, id, sessionId, status);
      if (fullName && emailAddress && imageUrl && id && sessionId) {
        if (status === "added") {
          addRequest({
            fullName,
            emailAddress,
            imageUrl,
            id,
            sessionId,
          });
        } else {
          removeRequest(id);
        }
      } else {
        ToastAndroid.showWithGravity(
          "Received wrong request data",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    };
    const handlePayloadError = () => {
      ToastAndroid.showWithGravity(
        "Please send correct Data",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    };
    socketIo.on("friend-added", handleFriendAdded);
    socketIo.on("friend-payload-error", handlePayloadError);
    socketIo.on("request-received", handleRequestReceived);
    return () => {
      socketIo.off("friend-added", handleFriendAdded);
      socketIo.off("friend-payload-error", handlePayloadError);
      socketIo.off("request-received", handleRequestReceived);
    };
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarContainer,
      }}
    >
      <Tabs.Screen
        key={1}
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} label="Home" icon={homeImage} />
          ),
        }}
      />
      <Tabs.Screen
        key={2}
        name="history"
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} label="History" icon={historyImage} />
          ),
        }}
      />
      <Tabs.Screen
        key={3}
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} label="Profile" icon={profileImage} />
          ),
        }}
      />
      <Tabs.Screen
        key={4}
        name="friends"
        options={{
          tabBarLabel: "Friends",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} label="Friends" icon={friendsImage} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: "transparent",
    shadowColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    borderTopColor: "transparent",
    borderTopWidth: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 55,
  },
  tabBarIconContainer: {
    alignItems: "center",
    marginTop: -10,
  },
  tabBarIconLabel: {
    fontSize: 12,
    width: "100%",
  },
});
