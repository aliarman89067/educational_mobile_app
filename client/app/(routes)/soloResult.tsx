import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import axios from "axios";
import CircleChart from "@/components/CircleChart";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import QuizResultRow from "@/components/QuizResultRow";
import BackButton from "@/components/backButton";

const SoloResult = () => {
  const { historyId } = useLocalSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // States
  const [data, setData] = useState<null | {
    _id: string;
    time: number;
    mcqs: {
      _id: string;
      mcq: string;
      options: {
        text: string;
        isCorrect: boolean;
        _id: string;
      }[];
    }[];
    quizIdAndValue: { _id: string; isCorrect: boolean; selected: string }[];
    roomType: string;
    soloRoom: {
      _id: string;
      subjectId: { _id: string; subject: string };
      yearId: { _id: string; year: number };
      topicId: { _id: string; topic: string };
    };
  }>(null);
  const [percentage, setPercentage] = useState(0);
  const [analytics, setAnalytics] = useState({
    total: 0,
    correct: 0,
    wrong: 0,
  });
  const [correctQuiz, setCorrectQuiz] = useState<
    | null
    | {
        _id: string;
        mcq: string;
        selected: string;
        options: { text: string; isCorrect: boolean; _id: string }[];
      }[]
  >(null);
  const [wrongQuiz, setWrongQuiz] = useState<
    | null
    | {
        _id: string;
        mcq: string;
        selected: string;
        options: { text: string; isCorrect: boolean; _id: string }[];
      }[]
  >(null);
  const [incompleteQuiz, setIncompleteQuiz] = useState<
    | null
    | {
        _id: string;
        mcq: string;
        selected: string;
        options: { text: string; isCorrect: boolean; _id: string }[];
      }[]
  >(null);
  const [historyType, setHistoryType] = useState<
    "correct" | "wrong" | "incomplete"
  >("correct");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data: resultData } = await axios.get(
          `/quiz/get-solo-result/${historyId}`
        );
        setData(resultData.data);
        handleDataStates(resultData.data);
      } catch (error) {
        console.log(error);
        router.back();
      }
    };
    loadHistory();
  }, [router, pathname]);

  const handleDataStates = (data: any) => {
    const correctAnswer = data.quizIdAndValue.filter(
      (item: any) => item.isCorrect
    );
    const wrongtAnswer = data.quizIdAndValue.filter(
      (item: any) => !item.isCorrect
    );
    const per = (correctAnswer.length / data.mcqs.length) * 100;
    setPercentage(Math.floor(per));
    setAnalytics({
      total: data.mcqs.length,
      correct: correctAnswer.length,
      wrong: wrongtAnswer.length,
    });
    const correctQuiz = [];
    for (let i = 0; i < correctAnswer.length; i++) {
      for (let k = 0; k < data.mcqs.length; k++) {
        if (correctAnswer[i]._id === data.mcqs[k]._id) {
          correctQuiz.push({
            ...data.mcqs[k],
            selected: correctAnswer[i].selected,
          });
        }
      }
    }
    const wrongQuiz = [];
    for (let i = 0; i < wrongtAnswer.length; i++) {
      for (let k = 0; k < data.mcqs.length; k++) {
        if (wrongtAnswer[i]._id === data.mcqs[k]._id) {
          wrongQuiz.push({
            ...data.mcqs[k],
            selected: wrongtAnswer[i].selected,
          });
        }
      }
    }

    let incompleteQuiz = [];
    for (let i = 0; i < data?.mcqs.length; i++) {
      const isExist = data.quizIdAndValue.find(
        (item: any) => item._id === data?.mcqs[i]._id
      );
      if (!isExist) {
        incompleteQuiz.push(data?.mcqs[i]);
      }
    }

    setCorrectQuiz(correctQuiz);
    setWrongQuiz(wrongQuiz);
    setIncompleteQuiz(incompleteQuiz);
  };

  const handleMessage = () => {
    if (percentage <= 10) {
      return "No problem! Keep practicing, you’ll get there!";
    }
    if (percentage <= 20) {
      return "Great effort, but there's room for improvement. Try again!";
    }
    if (percentage <= 30) {
      return "You're doing well, but a little more practice will make all the difference!";
    }
    if (percentage <= 40) {
      return "Almost there! Keep going, you can do it!";
    }
    if (percentage <= 50) {
      return "Great job! You're on the right track!";
    }
    if (percentage <= 60) {
      return "Marvellous! Keep up the good work!";
    }
    if (percentage <= 70) {
      return "Excellent! You’re getting stronger with every try!";
    }
    if (percentage <= 80) {
      return "Fantastic! Your hard work is really paying off!";
    }
    if (percentage <= 90) {
      return "Incredible! You're on fire!";
    }
    if (percentage > 90) {
      return "Awesome! You're becoming a pro at this!";
    }
  };

  const getCompleteTime = () => {
    if (!data?.time) return;
    const completeTime = new Date(data.time);
    return (
      <Text style={[styles.titleText, { color: colors.grayDark }]}>
        {completeTime.getHours() +
          ":" +
          completeTime.getMinutes() +
          ":" +
          completeTime.getSeconds()}
      </Text>
    );
  };
  const changeHistoryType = (type: "correct" | "wrong" | "incomplete") => {
    setHistoryType(type);
  };

  const handleReplay = async () => {
    try {
      if (!data?.soloRoom._id) {
        ToastAndroid.showWithGravity(
          "Something went wrong try again later!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
      const { data: responseData } = await axios.put(
        "/quiz/reactive-solo-room",
        {
          soloRoomId: data?.soloRoom._id,
          historyId
        }
      );
      router.replace({
        pathname: "/(routes)/soloRoom",
        params: { roomId: responseData.data },
      });
    } catch (error) {
      console.log(error);
      ToastAndroid.showWithGravity(
        "Something went wrong try again later!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <BackButton />
          <View style={styles.chartContainer}>
            <CircleChart percentage={percentage} strokeWidth={18} size={200} />
          </View>
          <Text style={styles.courageMessageText}>{handleMessage()}</Text>
          <View style={styles.analyticBoxes}>
            <View
              style={[styles.analyticBox, { backgroundColor: colors.grayDark }]}
            >
              <Text style={styles.subTitleText}>Incomplete</Text>
              <Text style={[styles.titleText, { fontSize: 23 }]}>
                {incompleteQuiz?.length ?? 0}
              </Text>
            </View>
            <View
              style={[
                styles.analyticBox,
                {
                  backgroundColor: colors.grayDark,
                  transform: [{ translateY: -8 }],
                },
              ]}
            >
              <Text style={styles.subTitleText}>Correct</Text>
              <Text style={[styles.titleText, { fontSize: 23 }]}>
                {correctQuiz?.length ?? 0}
              </Text>
            </View>
            <View
              style={[styles.analyticBox, { backgroundColor: colors.grayDark }]}
            >
              <Text style={styles.subTitleText}>Wrong</Text>
              <Text style={[styles.titleText, { fontSize: 23 }]}>
                {wrongQuiz?.length ?? 0}
              </Text>
            </View>
          </View>
          <View style={[styles.timeContainer, { marginTop: 15 }]}>
            <Text style={[styles.subTitleText, { color: colors.grayDark }]}>
              Complete in
            </Text>
            {getCompleteTime()}
          </View>
          <TouchableOpacity
            onPress={handleReplay}
            activeOpacity={0.7}
            style={styles.replayButton}
          >
            <Text style={styles.subTitleText}>Replay</Text>
          </TouchableOpacity>
          <View style={styles.historyButtonContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => changeHistoryType("correct")}
              style={[
                styles.historyButton,
                {
                  backgroundColor:
                    historyType === "correct"
                      ? colors.primary
                      : colors.grayDark,
                },
              ]}
            >
              <Text
                style={[styles.subTitleText, { color: "white", fontSize: 14 }]}
              >
                Correct
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => changeHistoryType("wrong")}
              activeOpacity={0.7}
              style={[
                styles.historyButton,
                {
                  backgroundColor:
                    historyType === "wrong" ? colors.primary : colors.grayDark,
                },
              ]}
            >
              <Text
                style={[styles.subTitleText, { color: "white", fontSize: 14 }]}
              >
                Wrong
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => changeHistoryType("incomplete")}
              activeOpacity={0.7}
              style={[
                styles.historyButton,
                {
                  backgroundColor:
                    historyType === "incomplete"
                      ? colors.primary
                      : colors.grayDark,
                },
              ]}
            >
              <Text
                style={[styles.subTitleText, { color: "white", fontSize: 14 }]}
              >
                Incomplete
              </Text>
            </TouchableOpacity>
          </View>
          {/* Correct Answer */}
          {historyType === "correct" && (
            <View
              style={[styles.historyContainer, { backgroundColor: "#bbf7d0" }]}
            >
              <Text
                style={[
                  styles.subTitleText,
                  { color: colors.grayDark, fontSize: 14 },
                ]}
              >
                {correctQuiz?.length} Correct Answer
              </Text>
              {correctQuiz?.map((quiz, index) => (
                <QuizResultRow key={quiz._id} item={quiz} index={index} />
              ))}
            </View>
          )}
          {historyType === "wrong" && (
            <View
              style={[styles.historyContainer, { backgroundColor: "#fecaca" }]}
            >
              <Text
                style={[
                  styles.subTitleText,
                  { color: colors.grayDark, fontSize: 14, marginBottom: 10 },
                ]}
              >
                {wrongQuiz?.length} Wrong Answer
              </Text>
              {wrongQuiz?.map((quiz, index) => (
                <QuizResultRow key={quiz._id} item={quiz} index={index} />
              ))}
            </View>
          )}
          {historyType === "incomplete" && (
            <View
              style={[styles.historyContainer, { backgroundColor: "#594e5b" }]}
            >
              <Text
                style={[styles.subTitleText, { color: "white", fontSize: 14 }]}
              >
                {incompleteQuiz?.length} Incomplete Answer
              </Text>
              {incompleteQuiz?.map((quiz, index) => (
                <QuizResultRow key={quiz._id} item={quiz} index={index} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SoloResult;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  chartContainer: {
    alignItems: "center",
    width: "100%",
  },
  courageMessageText: {
    color: colors.grayDark,
    fontSize: 18,
    fontFamily: fontFamily.Medium,
    textAlign: "center",
    marginTop: 10,
  },
  analyticBoxes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
    width: "100%",
    marginTop: 20,
  },
  analyticBox: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 90,
    flex: 1,
    gap: 5,
  },
  titleText: {
    color: "white",
    fontFamily: fontFamily.Bold,
    fontSize: 18,
  },
  subTitleText: {
    color: "white",
    fontFamily: fontFamily.Medium,
    fontSize: 16,
  },
  timeContainer: {
    alignItems: "center",
    gap: 2,
    marginTop: 5,
  },
  replayButton: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    width: 120,
    height: 50,
    marginHorizontal: "auto",
    marginVertical: 15,
  },
  historyButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    width: "100%",
    marginTop: 10,
  },
  historyButton: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    flex: 1,
    gap: 5,
  },
  historyContainer: {
    width: "100%",
    borderRadius: 15,
    padding: 8,
    marginVertical: 10,
    paddingVertical: 20,
    gap: 7,
  },
});
