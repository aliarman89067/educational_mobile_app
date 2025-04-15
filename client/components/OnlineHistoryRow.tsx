import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, usePathname } from "expo-router";
import { fontFamily } from "@/constants/fonts";
import { colors } from "@/constants/colors";
import CircleChart from "./CircleChart";
import { useUser } from "@clerk/clerk-expo";

type QuizIdAndValueType = {
  _id: string;
  isCorrect: string;
  selected: string;
};

interface Data {
  data: {
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
  };
}

const OnlineHistoryRow = ({ data }: Data) => {
  const pathname = usePathname();
  const [isWinner, setIsWinner] = useState(false);
  const [isDuo, setIsDuo] = useState(false);
  const { user } = useUser();

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

  useEffect(() => {
    if (!data.quizIdAndValue || !data.opponentQuizIdAndValue) return;
    const myCorrectAnswer = data.quizIdAndValue.filter(
      (item: any) => item.isCorrect
    ).length;
    const opponentCorrectAnswer = data.opponentQuizIdAndValue.filter(
      (item: any) => item.isCorrect
    ).length;
    if (myCorrectAnswer > opponentCorrectAnswer) {
      setIsWinner(true);
    } else if (myCorrectAnswer < opponentCorrectAnswer) {
      setIsWinner(false);
    } else if (myCorrectAnswer === opponentCorrectAnswer) {
      setIsDuo(true);
    }
  }, [data, pathname, router]);

  const checkResign = () => {
    if (data.resignation && user) {
      if (data.resignation === user.id) {
        return "true";
      } else {
        return "false";
      }
    } else {
      return "no-resign";
    }
  };
  return (
    <TouchableOpacity
      key={data.roomId}
      onPress={() =>
        router.push({
          pathname: "/(routes)/onlineResult",
          params: { onlineResultId: data.historyId, onlineRoomId: data.roomId },
        })
      }
      activeOpacity={0.7}
      style={styles.quizRowBox}
    >
      <View>
        {checkResign() === "no-resign" && (
          <View>
            <Text
              style={{
                color: colors.grayDark,
                fontFamily: fontFamily.Bold,
                fontSize: 15,
                marginBottom: 5,
              }}
            >
              <Text style={{ color: "#2dc653" }}>
                {isWinner && !isDuo && <>You Win!</>}
              </Text>
              <Text style={{ color: "#ff4d6d" }}>
                {!isWinner && !isDuo && <>You Loose!</>}
              </Text>

              {!isWinner && isDuo && <>Its a Duo!</>}
            </Text>
          </View>
        )}
        {checkResign() === "false" && (
          <View style={{ alignItems: "center", marginTop: 15 }}>
            <Text
              style={{
                color: "#2dc653",
                fontFamily: fontFamily.Bold,
                fontSize: 15,
                marginBottom: 5,
              }}
            >
              You Win By Resignation
            </Text>
          </View>
        )}
        {checkResign() === "true" && (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                color: "#ff4d6d",
                fontFamily: fontFamily.Bold,
                fontSize: 15,
                marginBottom: 5,
              }}
            >
              You Loose By Resignation
            </Text>
          </View>
        )}
        <Text style={styles.subtitleText}>{data.subjectName}</Text>
        {data.quizType === "Topical" ? (
          <View style={styles.typeContainer}>
            <Text style={[styles.subtitleText, { fontSize: 15 }]}>Topic</Text>
            <Text style={[styles.subtitleText, { fontSize: 15 }]}>
              {data.topicName}
            </Text>
          </View>
        ) : (
          <View style={styles.typeContainer}>
            <Text style={[styles.subtitleText, { fontSize: 15 }]}>Year</Text>
            <Text style={[styles.subtitleText, { fontSize: 15 }]}>
              {data.yearName}
            </Text>
          </View>
        )}
        <Text style={[styles.subtitleText, { marginTop: 3, fontSize: 14 }]}>
          {getDate(data.date)}
        </Text>
      </View>
      <View>
        <View>
          <CircleChart
            percentage={getPercentage(data.quizIdAndValue, data.mcqLength)}
            strokeWidth={6}
            size={80}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OnlineHistoryRow;

const styles = StyleSheet.create({
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
});
