import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import bellAnimation from "@/assets/animations/bell.json";
import { fontFamily } from "@/constants/fonts";
import { colors } from "@/constants/colors";
import { useRequestQuizReceivedStore } from "@/context/zustandStore";
import axios from "axios";

const QuizRequestNotificantion = () => {
  const { data, removeData } = useRequestQuizReceivedStore();

  const [time, setTime] = useState(14);
  const getSeconds = () => {
    if (!data) return 0;
    if (data.seconds > 60) {
      return Math.floor(data.seconds / 60) + " min";
    } else {
      return data.seconds + " sec";
    }
  };
  let intervalId: any;
  useEffect(() => {
    // removeData();
    intervalId = setInterval(async () => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (time < 1) {
      const handleDisabledRoom = async () => {
        try {
          clearInterval(intervalId);
          await axios.put("/quiz/disabled-friend-room", {
            roomId: data?.roomId,
          });
        } catch (error) {
          console.log(error);
        } finally {
          removeData();
        }
      };
      handleDisabledRoom();
    }
  }, [time]);

  return (
    <>
      {data && (
        <View style={styles.quizNotificationContainer}>
          <View style={styles.quizNotificationContent}>
            <View
              style={{ alignItems: "center", transform: [{ translateY: -4 }] }}
            >
              {/* <LottieView
                source={bellAnimation}
                loop
                autoPlay
                style={{ width: 40, height: 35 }}
              /> */}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Image
                  source={{
                    uri: data.imageUrl,
                  }}
                  alt={`${data.name} image`}
                  style={styles.requestProfileImage}
                />
                <View>
                  <Text style={styles.requestProfileText}>{data.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.grayLight,
                        fontFamily: fontFamily.Regular,
                        fontSize: 13,
                      }}
                    >
                      Subject
                    </Text>
                    <Text
                      style={{
                        color: colors.grayLight,
                        fontFamily: fontFamily.Bold,
                        fontSize: 14,
                      }}
                    >
                      {data.subject}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.grayLight,
                        fontFamily: fontFamily.Regular,
                        fontSize: 13,
                      }}
                    >
                      {data.type === "Yearly" ? "Year" : "Topic"}
                    </Text>
                    <Text
                      style={{
                        color: colors.grayLight,
                        fontFamily: fontFamily.Bold,
                        fontSize: 14,
                      }}
                    >
                      {data.topicOrYear}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.grayLight,
                        fontFamily: fontFamily.Regular,
                        fontSize: 13,
                      }}
                    >
                      Quizes
                    </Text>
                    <Text
                      style={{
                        color: colors.grayLight,
                        fontFamily: fontFamily.Bold,
                        fontSize: 14,
                      }}
                    >
                      {data.length}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.grayLight,
                        fontFamily: fontFamily.Regular,
                        fontSize: 13,
                      }}
                    >
                      Timing
                    </Text>
                    <Text
                      style={{
                        color: colors.grayLight,
                        fontFamily: fontFamily.Bold,
                        fontSize: 14,
                      }}
                    >
                      {getSeconds()}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 100,
                  backgroundColor: colors.purple,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fontFamily.Bold,
                    fontSize: 14,
                  }}
                >
                  {time}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
                gap: 10,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: colors.purple,
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fontFamily.Medium,
                    fontSize: 14,
                  }}
                >
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: colors.grayDark,
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fontFamily.Medium,
                    fontSize: 14,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default QuizRequestNotificantion;

const styles = StyleSheet.create({
  quizNotificationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 200,
    paddingHorizontal: 10,
    marginTop: 10,
    width: "100%",
  },
  quizNotificationContent: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    width: "100%",
    borderColor: colors.grayDark,
    borderStyle: "solid",
    borderWidth: 6,
  },
  requestProfileImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 100,
  },
  requestProfileText: {
    color: colors.grayLight,
    fontFamily: fontFamily.Medium,
    fontSize: 16,
  },
});
