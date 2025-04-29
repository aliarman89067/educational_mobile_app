import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import { bell, logoImage } from "@/constants/images";
import asyncStorage from "@react-native-async-storage/async-storage";
import { User_Type } from "@/utils/type";
import { router } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRequestReceivedStore } from "@/context/zustandStore";
import axios from "axios";
import NotificationContainer from "./NotificationContainer";

const Navbar = () => {
  const [data, setData] = useState<User_Type | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { requests, resetRequests, addRequests } = useRequestReceivedStore();
  const [isAnime, setIsAnime] = useState(false);
  const bellAnime = useRef(new Animated.Value(0)).current;
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { width, height } = Dimensions.get("window");

  const handleStartAnimation = (type: string) => {
    bellAnime.setValue(0);
    if (type === "start") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bellAnime, {
            toValue: 1,
            duration: 600,
            easing: Easing.elastic(2),
            useNativeDriver: true,
          }),
          Animated.timing(bellAnime, {
            toValue: 2,
            duration: 600,
            easing: Easing.elastic(2),
            useNativeDriver: true,
          }),
          Animated.timing(bellAnime, {
            toValue: 3,
            duration: 600,
            easing: Easing.elastic(2),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    if (type === "stop") {
      Animated.timing(bellAnime, {
        toValue: 0,
        duration: 600,
        easing: Easing.elastic(2),
        useNativeDriver: true,
      }).start();
    }
  };

  const bellAnimeInter = bellAnime.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ["0deg", "30deg", "-30deg", "0deg"],
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await asyncStorage.getItem("current-user");
        if (userData) {
          const userDataParse = JSON.parse(userData);
          setData(userDataParse);
          getUserRequests(userDataParse);
        } else {
          router.replace("/(auth)");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const getUserRequests = async (userDataParse: User_Type) => {
    try {
      if (!userDataParse?.isGuest) {
        const { data: responseData } = await axios.post(
          `/user/received-request`,
          {
            userId: userDataParse?.id,
          }
        );
        resetRequests();
        if (responseData.length > 0) {
          addRequests(responseData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = async () => {
    if (data) {
      if (data.isGuest) {
        await asyncStorage.removeItem("current-user");
        resetRequests();
        router.replace("/(auth)");
      } else {
        GoogleSignin.signOut();
        await asyncStorage.removeItem("current-user");
        resetRequests();
        router.replace("/(auth)");
      }
    }
  };

  const requestLength = () => {
    if (requests && requests.length > 0) {
      handleStartAnimation("start");
      return { isNoti: true, count: requests.length };
    }
    handleStartAnimation("stop");
    return { isNoti: false, count: 0 };
  };
  return (
    <View style={styles.container}>
      {isNotificationOpen && (
        <NotificationContainer
          isOpen={isNotificationOpen}
          setIsOpen={setIsNotificationOpen}
          userData={data}
        />
      )}
      <View style={{ width: 60 }}>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
          <Image
            source={{ uri: data?.imageUrl }}
            alt={`${data?.fullName} profile image`}
            style={styles.profileImg}
          />
        </TouchableOpacity>
        <Text style={styles.nameText}>
          {data?.fullName.substring(0, 5)}
          {data?.fullName.length && data?.fullName.length > 5 && "..."}
        </Text>
      </View>
      <Image source={logoImage} style={styles.logoImg} />
      <View style={{ width: 60 }}>
        <TouchableOpacity
          onPress={() => setIsNotificationOpen(true)}
          activeOpacity={0.7}
          style={styles.bellBox}
        >
          <Animated.Image
            source={bell}
            alt="Notification bell image"
            style={[
              styles.bellImg,
              { transform: [{ rotate: bellAnimeInter }] },
            ]}
          />
          {requestLength().isNoti && (
            <View style={styles.notificationCircle}>
              <Text style={styles.notificationNumberText}>
                {requestLength().count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    position: "relative",
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
    top: 3,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 20,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationNumberText: {
    fontSize: 11,
    color: "white",
    fontFamily: fontFamily.Medium,
  },
});
