import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import Timer from "@/components/timer";

const SoloRoom = () => {
  const { roomId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<null | {
    _id: string;
    isAlive: boolean;
    seconds: string;
    subjectId: { _id: string; subject: string };
    yearId: { _id: string; year: string };
    topicId: { _id: string; topic: string };
    quizType: "Topical" | "Yearly";
    quizes: {
      _id: string;
      mcq: string;
      options: {
        _id: string;
        isCorrect: boolean;
        text: string;
      }[];
    }[];
  }>(null);

  useEffect(() => {
    if (!roomId) {
      router.back();
      return;
    }
    const loadRoomData = async () => {
      try {
        setData(null);
        setIsError(false);
        setIsLoading(true);
        const { data } = await axios.get(`/quiz/get/solo-room/${roomId}`);
        setData(data.data);
      } catch (err: any) {
        console.log(err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadRoomData();
  }, [roomId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading && !data && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size={40} />
          <Text style={styles.loadingText}>Please Wait...</Text>
        </View>
      )}
      {isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong!</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.errorButton}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isLoading && data && (
        <View style={styles.container}>
          <View style={styles.timerContainer}>
            {data.seconds !== "no-limit" ? (
              <Text style={styles.timeLeftText}>Time Left</Text>
            ) : (
              <Text style={styles.timeLeftText}>Time</Text>
            )}
            <Timer seconds={data.seconds} />
          </View>
          <View style={styles.contentContainer}>
            <View style={{ flex: 1, width: "100%" }}>
              <View style={styles.quizContainer}>
                <Text style={styles.quizText}>{data.quizes[0].mcq}</Text>
              </View>
              <View style={styles.optionsContainer}>
                {data.quizes[0].options.map((option, index) => (
                  <TouchableOpacity
                    style={styles.quizOption}
                    key={option._id}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.quizOptionText,
                        { fontSize: 14, fontFamily: fontFamily.light },
                      ]}
                    >
                      {String.fromCharCode(97 + index)}.
                    </Text>
                    <Text style={styles.quizOptionText}>{option.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.navigatorButtonsContainer}>
              <TouchableOpacity
                style={styles.navigatorButton}
                activeOpacity={0.7}
              >
                <Text style={styles.navigatorButtonText}>Prev</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigatorButton}
                activeOpacity={0.7}
              >
                <Text style={styles.navigatorButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SoloRoom;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 10,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingText: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: fontFamily.Regular,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#e5383b",
    fontFamily: fontFamily.Medium,
    fontSize: 16,
  },
  errorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 10,
  },
  errorButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: fontFamily.Regular,
  },
  timeLeftText: {
    color: colors.primary,
    fontFamily: fontFamily.Regular,
    fontSize: 15,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    flex: 1,
  },
  quizContainer: {
    width: "100%",
    minHeight: 100,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 20,
    justifyContent: "center",
  },
  quizText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: fontFamily.Medium,
  },
  optionsContainer: {
    flex: 1,
    width: "100%",
    gap: 5,
    marginTop: 20,
  },
  quizOption: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: colors.grayDark,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quizOptionText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fontFamily.Medium,
  },
  navigatorButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  navigatorButton: {
    backgroundColor: colors.grayDark,
    flex: 1,
    width: "100%",
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  navigatorButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: fontFamily.Regular,
  },
});
