import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import asyncStorage from "@react-native-async-storage/async-storage";
import { Friend_Type, User_Type } from "@/utils/type";
import axios from "axios";
import { fontFamily } from "@/constants/fonts";
import { colors } from "@/constants/colors";
import { notFound } from "@/constants/images";
import { useSocket } from "@/context/SocketContext";

const SelectFriend = () => {
  const { roomId } = useLocalSearchParams();

  //   States
  const [userData, setUserData] = useState<User_Type | null>(null);
  const [friendData, setFriendData] = useState<Friend_Type[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { socketIo } = useSocket();

  useEffect(() => {
    const loadFriendAndUser = async () => {
      try {
        setIsLoading(true);
        const userDataString = await asyncStorage.getItem("current-user");
        if (!userDataString) {
          router.replace("/(auth)");
          return;
        }
        const userDataParse = JSON.parse(userDataString);
        setUserData(userDataParse);
        const { data: friendData } = await axios.post(
          `/user/get-friends/${userDataParse.id}`
        );
        setFriendData(friendData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFriendAndUser();
  }, []);

  const handleSendRequest = async (friendId: string) => {
    try {
      const data = {
        roomId,
        friendId,
        userId: userData?.id,
      };
      socketIo.emit("send-quiz-request", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {friendData && friendData.length > 0 && (
        <View style={styles.contentContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>
                  Your Friends ({friendData?.length})
                </Text>
                <Text style={styles.headerSubtitle}>
                  Select the friend you want to play with.
                </Text>
              </View>
            }
            contentContainerStyle={{ marginTop: 0, gap: 6 }}
            data={friendData}
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

                <TouchableOpacity
                  onPress={() => handleSendRequest(item._id)}
                  activeOpacity={0.7}
                  style={[styles.addFriendButton]}
                >
                  <Text style={styles.addFriendText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
      {friendData && friendData.length === 0 && (
        <View style={styles.emptyContainer}>
          <Image source={notFound} alt="Not Found" style={styles.emptyImage} />
          <Text style={styles.emptyText}>You have no friend!</Text>
        </View>
      )}
      {!friendData ||
        (isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.purple} size={20} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ))}
    </View>
  );
};

export default SelectFriend;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  emptyContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  emptyImage: {
    resizeMode: "contain",
    width: 300,
  },
  emptyText: {
    fontFamily: fontFamily.Medium,
    fontSize: 17,
    color: colors.grayLight,
  },
  loadingContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  loadingText: {
    fontSize: 12,
    color: colors.grayLight,
    fontFamily: fontFamily.Regular,
  },
  contentContainer: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
  headerBox: {
    gap: 4,
    marginTop: 10,
    marginBottom: 15,
  },
  headerTitle: {
    color: colors.grayDark,
    fontSize: 15,
    fontFamily: fontFamily.Medium,
  },
  headerSubtitle: {
    color: colors.grayLight,
    fontSize: 15,
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
    width: 120,
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
});
