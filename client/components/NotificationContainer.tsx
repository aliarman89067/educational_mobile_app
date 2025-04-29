import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { BlurView } from "expo-blur";
import { Dimensions } from "react-native";
import { useRequestReceivedStore } from "@/context/zustandStore";
import { fontFamily } from "@/constants/fonts";
import { colors } from "@/constants/colors";
import { close } from "@/constants/images";
import axios from "axios";
import { User_Type } from "@/utils/type";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userData: User_Type | null;
}

const { width, height } = Dimensions.get("window");

const NotificationContainer = ({ isOpen, setIsOpen, userData }: Props) => {
  const { requests, removeRequest } = useRequestReceivedStore();
  const [isDisabled, setIsDisabled] = useState(false);

  const getNotificationsLength = () => {
    const length = requests?.length;
    return length ?? 0;
  };
  const handleCancelRequest = async (friendId: string) => {
    try {
      setIsDisabled(true);
      await axios.put(`/user/cancel-request`, {
        friendId,
        userId: userData?.id,
      });
      removeRequest(friendId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDisabled(false);
    }
  };
  const handleAcceptRequest = async (friendId: string) => {
    try {
      setIsDisabled(true);
      await axios.put(`/user/accept-request`, {
        friendId,
        userId: userData?.id,
      });
      removeRequest(friendId);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDisabled(false);
    }
  };
  return (
    <BlurView
      experimentalBlurMethod="dimezisBlurView"
      intensity={25}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            {getNotificationsLength()}{" "}
            {getNotificationsLength() > 1 ? "Notifications" : "Notification"}
          </Text>
          <TouchableOpacity
            onPress={() => setIsOpen(false)}
            activeOpacity={0.7}
          >
            <Image
              source={close}
              alt="Close Icon"
              tintColor={colors.grayDark}
              style={styles.closeImg}
            />
          </TouchableOpacity>
        </View>
        {requests && requests.length > 0 && (
          <View style={{ width: "100%" }}>
            <FlatList
              data={requests}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ width: "100%", gap: 20 }}
              renderItem={({ item }) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardLeft}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      alt={`${item.fullName} image`}
                      style={styles.cardImage}
                    />
                    <View style={{ gap: 5 }}>
                      <Text style={styles.cardTitle}>{item.fullName}</Text>
                      <Text style={styles.cardSubTitle}>
                        New friend request.
                      </Text>
                    </View>
                  </View>
                  <View style={{ gap: 5 }}>
                    <TouchableOpacity
                      disabled={isDisabled}
                      onPress={() => handleAcceptRequest(item.id)}
                      activeOpacity={0.7}
                      style={[
                        styles.cardCta,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text style={styles.cardCtaText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={isDisabled}
                      onPress={() => handleCancelRequest(item.id)}
                      activeOpacity={0.7}
                      style={[
                        styles.cardCta,
                        { backgroundColor: colors.grayDark },
                      ]}
                    >
                      <Text style={styles.cardCtaText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </BlurView>
  );
};

export default NotificationContainer;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 100,
    marginHorizontal: -10,
  },
  contentContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  headerTitle: {
    fontFamily: fontFamily.Medium,
    fontSize: 18,
    color: colors.grayDark,
  },
  closeImg: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    resizeMode: "contain",
  },
  cardTitle: {
    fontFamily: fontFamily.Medium,
    fontSize: 17,
    color: colors.grayLight,
  },
  cardSubTitle: {
    fontFamily: fontFamily.Regular,
    fontSize: 13,
    color: colors.grayLight,
  },
  cardCta: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  cardCtaText: {
    fontFamily: fontFamily.Regular,
    color: "white",
    fontSize: 13,
  },
});
