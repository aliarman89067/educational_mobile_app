import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { googleImage, notFound, search } from "@/constants/images";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import { Friend_Type, User_Type } from "@/utils/type";
import asyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";
import { BlurView } from "expo-blur";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useSocket } from "@/context/SocketContext";
import {
  useRequestReceivedStore,
  useSocketStore,
} from "@/context/zustandStore";

const friends = () => {
  const [input, setInput] = useState("");
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userData, setUserData] = useState<User_Type | null>(null);
  const [friendsData, setFriendsData] = useState<Friend_Type[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestError, setIsGuestError] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleErrorMessage, setGoogleErrorMessage] = useState("");

  const { socketIo } = useSocket();
  const { sessionId } = useSocketStore();

  useEffect(() => {
    // resetRequests();
    const loadUser = async () => {
      try {
        setIsUserLoading(true);
        const userDataString = await asyncStorage.getItem("current-user");
        if (userDataString) {
          setUserData(JSON.parse(userDataString));
        } else {
          router.replace("/(auth)");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsUserLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const handleUpdateFriendsState = (data: any) => {
      const { userId, status, friendId } = data;
      console.log(userId, status, friendId);
      setFriendsData((prevData) => {
        if (!prevData) return prevData;
        return prevData.map((friend) => {
          if (friend._id === friendId) {
            if (status === "added") {
              return {
                ...friend,
                requestsRecieved: [...friend.requestsRecieved, userId],
              };
            } else {
              return {
                ...friend,
                requestsRecieved: friend.requestsRecieved.filter(
                  (item) => item !== userId
                ),
              };
            }
          } else {
            return friend;
          }
        });
      });
    };
    socketIo.on("update-friend-state", handleUpdateFriendsState);
    return () => {
      socketIo.off("update-friend-state", handleUpdateFriendsState);
    };
  }, []);

  const searchUser = async () => {
    if (!input) return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/user/${input}/${userData?.id}`);
      setFriendsData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (friendId: string, friendSessionId: string) => {
    if (userData) {
      if (userData.isGuest) {
        setIsGuestError(true);
        return;
      }
      if (!userData.id || !friendId || !friendSessionId) {
        ToastAndroid.showWithGravity(
          "Payload is not correct!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        return;
      }
      const data = {
        userId: userData.id,
        friendId,
        friendSessionId,
      };
      socketIo.emit("add-friend", data);
    }
  };

  if (isUserLoading) {
    return (
      <View style={[styles.loadingModal, { backgroundColor: "white" }]}>
        <View style={styles.loadingContent}>
          <ActivityIndicator color={colors.grayLight} size={40} />
          <Text style={[styles.loadingText, { color: colors.grayLight }]}>
            Please Wait...
          </Text>
        </View>
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={[styles.loadingModal, { backgroundColor: "white" }]}>
        <View style={styles.loadingContent}>
          <ActivityIndicator color={colors.grayLight} size={40} />
          <Text style={[styles.loadingText, { color: colors.grayLight }]}>
            Searching...
          </Text>
        </View>
      </View>
    );
  }

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
        setUserData(storageData);
        setIsGuestError(false);
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
    <View
      style={[
        styles.container,
        { paddingHorizontal: 0, paddingVertical: 0, position: "relative" },
      ]}
    >
      {isGuestError && (
        <BlurView
          intensity={35}
          experimentalBlurMethod="dimezisBlurView"
          style={styles.blurViewContainer}
        >
          <View style={styles.blurViewContent}>
            <View style={{ alignItems: "center", gap: 20, width: "100%" }}>
              <Text style={styles.blurViewTitle}>Login to add Friend.</Text>
              <TouchableOpacity
                disabled={isGoogleLoading}
                onPress={handleGoogleLogin}
                activeOpacity={0.7}
                style={styles.blurViewCta}
              >
                <Image
                  source={googleImage}
                  alt="Google Image"
                  resizeMode="contain"
                  style={{ width: 34, height: 34 }}
                />
                <Text
                  style={{
                    fontFamily: fontFamily.Bold,
                    fontSize: 20,
                    color: colors.grayDark,
                  }}
                >
                  {isGoogleLoading ? "Please Wait..." : "Google"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      )}
      <View style={styles.container}>
        <Navbar />
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={searchUser}
            activeOpacity={0.7}
            style={styles.searchButton}
          >
            <Image
              source={search}
              alt="Search Icon"
              resizeMode="contain"
              style={styles.searchImg}
            />
          </TouchableOpacity>
        </View>
        {friendsData && friendsData.length > 0 && (
          <FlatList
            contentContainerStyle={{ marginTop: 20, gap: 6 }}
            data={friendsData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View key={item._id} style={styles.friendRow}>
                <Image
                  source={{ uri: item.imageUrl }}
                  alt="Image Url"
                  resizeMode="cover"
                  style={styles.friendImg}
                />
                <View style={styles.friendInfoBox}>
                  <Text style={styles.friendName}>
                    {item.fullName.substring(0, 10)}
                    {item.fullName.length > 10 && "..."}
                  </Text>
                  <Text style={styles.friendRanking}>2000 Ranking</Text>
                </View>
                {userData && item.requestsRecieved.includes(userData?.id) ? (
                  <TouchableOpacity
                    onPress={() => handleAddFriend(item._id, item.sessionId)}
                    activeOpacity={0.7}
                    style={[
                      styles.addFriendButton,
                      { backgroundColor: "#ff4d6d" },
                    ]}
                  >
                    <Text style={styles.addFriendText}>Cancel</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleAddFriend(item._id, item.sessionId)}
                    activeOpacity={0.7}
                    style={styles.addFriendButton}
                  >
                    <Text style={styles.addFriendText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
        {friendsData && friendsData.length === 0 && (
          <View style={styles.notFoundContainer}>
            <Image
              source={notFound}
              alt="Not found Image"
              style={styles.notFoundImg}
            />
            <Text style={styles.notFoundText}>No results found.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default friends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    gap: 2,
  },
  input: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
    height: 50,
    borderStyle: "solid",
    borderColor: colors.grayLight,
    borderWidth: 1,
    fontFamily: fontFamily.Medium,
    fontSize: 14,
    color: colors.grayDark,
    borderRadius: 7,
  },
  searchButton: {
    height: 50,
    width: 50,
    borderStyle: "solid",
    borderColor: colors.grayLight,
    borderWidth: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  searchImg: {
    width: 25,
  },
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
  friendRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 22,
    borderRadius: 10,
    backgroundColor: "white",
    borderColor: "#e9ecef",
    borderStyle: "solid",
    borderWidth: 1,
  },
  friendImg: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  friendInfoBox: {
    gap: 2,
  },
  friendName: {
    color: colors.grayDark,
    fontSize: 15,
    fontFamily: fontFamily.Medium,
  },
  friendRanking: {
    color: colors.grayLight,
    fontSize: 13,
    fontFamily: fontFamily.Regular,
  },
  addFriendButton: {
    backgroundColor: colors.purple,
    height: 50,
    width: 85,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
  addFriendText: {
    color: "white",
    fontFamily: fontFamily.Regular,
    fontSize: 12,
  },
  notFoundContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundImg: {
    width: 300,
    height: 300,
    objectFit: "contain",
  },
  notFoundText: {
    color: colors.grayLight,
    fontFamily: fontFamily.Medium,
    fontSize: 15,
  },
  blurViewContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 100,
  },
  blurViewContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  blurViewTitle: {
    fontFamily: fontFamily.Regular,
    fontSize: 22,
    color: "white",
  },
  blurViewCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "white",
    borderRadius: 6,
    width: 300,
    paddingVertical: 20,
  },
});
