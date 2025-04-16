import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { router, usePathname } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import CircleChart from "@/components/CircleChart";
import OnlineHistoryRow from "@/components/OnlineHistoryRow";

type QuizIdAndValueType = {
  _id: string;
  isCorrect: string;
  selected: string;
};

type DataType = {
  soloQuizes: {
    roomId: string;
    historyId: string;
    subjectId: string;
    subjectName: string;
    topicId?: string;
    topicName?: string;
    yearId?: string;
    yearName?: string;
    date: string;
    quizType: "Topical" | "Yearly";
    quizIdAndValue: QuizIdAndValueType[];
    mcqLength: number;
  }[];
  onlineQuizes: {
    roomId: string;
    historyId: string;
    subjectId: string;
    subjectName: string;
    topicId?: string;
    topicName?: string;
    yearId?: string;
    yearName?: string;
    date: string;
    quizType: "Topical" | "Yearly";
    quizIdAndValue: QuizIdAndValueType[];
    opponentQuizIdAndValue: QuizIdAndValueType[];
    resignation: string;
    mcqLength: number;
  }[];
};

const History = () => {
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user || !user.id) return;
    setData(null);
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const { data: historyData } = await axios.get(
          `/history/all/${user.id}`
        );
        setData(historyData);
      } catch (error) {
        console.log(error);
        router.push("/(tabs)");
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [router, pathname, user, isLoaded]);

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
        <ScrollView>
          <View style={styles.mainContainer}>
            <Navbar />
            {data && data.soloQuizes.length > 0 && (
              <SoloQuizesContainer data={data.soloQuizes} />
            )}
            {data && data.onlineQuizes.length > 0 && (
              <OnlineQuizesContainer data={data.onlineQuizes} />
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default History;

const SoloQuizesContainer = ({ data }: { data: DataType["soloQuizes"] }) => {
  const [isShow, setIsShow] = useState(false);

  const getDate = (date: string) => {
    const newDate = new Date(date);
    const day = String(newDate.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[newDate.getMonth()];
    const year = newDate.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const getPercentage = (
    quizIdAndValue: QuizIdAndValueType[],
    mcqLength: number
  ) => {
    const correctAnswer = quizIdAndValue.filter((item) => item.isCorrect);

    const per = (correctAnswer.length / mcqLength) * 100;
    return per;
  };

  return (
    <View style={styles.quizContainer}>
      <TouchableOpacity
        onPress={() => setIsShow(!isShow)}
        activeOpacity={0.7}
        style={styles.quizTypeHeadingContainer}
      >
        <Text style={styles.quizTypeHeadingText}>
          {data.length} Solo Quizes History
        </Text>
        <Entypo name="chevron-small-down" size={22} color={colors.grayDark} />
      </TouchableOpacity>
      {isShow && (
        <View style={styles.quizesRowContainer}>
          {data.map((quiz) => (
            <TouchableOpacity
              key={quiz.historyId}
              onPress={() =>
                router.push({
                  pathname: "/(routes)/soloResult",
                  params: { historyId: quiz.historyId },
                })
              }
              activeOpacity={0.7}
              style={styles.quizRowBox}
            >
              <View>
                <Text style={styles.subtitleText}>{quiz.subjectName}</Text>
                {quiz.quizType === "Topical" ? (
                  <View style={styles.typeContainer}>
                    <Text style={[styles.subtitleText, { fontSize: 15 }]}>
                      Topic
                    </Text>
                    <Text style={[styles.subtitleText, { fontSize: 15 }]}>
                      {quiz.topicName}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.typeContainer}>
                    <Text style={[styles.subtitleText, { fontSize: 15 }]}>
                      Year
                    </Text>
                    <Text style={[styles.subtitleText, { fontSize: 15 }]}>
                      {quiz.yearName}
                    </Text>
                  </View>
                )}
                <Text
                  style={[styles.subtitleText, { marginTop: 3, fontSize: 14 }]}
                >
                  {getDate(quiz.date)}
                </Text>
              </View>
              <View>
                <View>
                  <CircleChart
                    percentage={getPercentage(
                      quiz.quizIdAndValue,
                      quiz.mcqLength
                    )}
                    strokeWidth={6}
                    size={80}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const OnlineQuizesContainer = ({
  data,
}: {
  data: DataType["onlineQuizes"];
}) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <View style={styles.quizContainer}>
      <TouchableOpacity
        onPress={() => setIsShow(!isShow)}
        activeOpacity={0.7}
        style={styles.quizTypeHeadingContainer}
      >
        <Text style={styles.quizTypeHeadingText}>
          {data.length} Online Quizes History
        </Text>
        <Entypo name="chevron-small-down" size={22} color={colors.grayDark} />
      </TouchableOpacity>
      {isShow && (
        <View style={styles.quizesRowContainer}>
          {data.map((quiz) => (
            <OnlineHistoryRow key={quiz.roomId} data={quiz} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
  quizContainer: {
    marginVertical: 15,
  },
  quizTypeHeadingContainer: {
    backgroundColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quizTypeHeadingText: {
    color: colors.grayDark,
    fontFamily: fontFamily.Medium,
    fontSize: 14,
  },
  quizesRowContainer: {
    gap: 8,
    width: "100%",
    marginTop: 13,
  },
  quizRowBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    alignItems: "center",
    elevation: 3,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subtitleText: {
    fontFamily: fontFamily.Medium,
    fontSize: 16,
    color: colors.grayDark,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 3,
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
});
