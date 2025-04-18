import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useSocket } from "@/context/SocketContext";
import axios from "axios";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import CircleChart from "@/components/CircleChart";
import LottieReact from "lottie-react-native";
import QuizResultRow from "@/components/QuizResultRow";
import BackButton from "@/components/backButton";
import clockAnimation from "../../assets/animations/clock.json";
import successAnimation from "../../assets/animations/success.json";
import AntDesign from "@expo/vector-icons/AntDesign";
import { User_Type } from "@/utils/type";
import { storage } from "@/utils";

type DataTypes = {
  _id: string;
  time: number;
  roomId: {
    quizType: string;
    subjectId: {
      _id: string;
      subject: string;
    };
    topicId: {
      _id: string;
      topic: string;
    };
    yearId: {
      _id: string;
      year: number;
    };
  };
  mcqs: {
    _id: string;
    mcq: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
  quizIdAndValue: {
    _id: string;
    isCorrect: boolean;
    selected: string;
    roomId: string;
    roomType: string;
    time: string;
    user: string;
  }[];
};
const OnlineResult = () => {
  const { onlineResultId: resultId, onlineRoomId: roomId } =
    useLocalSearchParams();
  const [isPending, setIsPending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [opponentUser, setOpponentUser] = useState<null | {
    _id: string;
    fullName: string;
    imageUrl: string;
    clerkId: string;
  }>(null);
  const [remainingTime, setRemainingTime] = useState<null | Date>(null);
  const [myData, setMyData] = useState<null | DataTypes>(null);
  const [opponentData, setOpponentData] = useState<null | DataTypes>(null);
  const [currentTab, setCurrentTab] = useState<
    "your-result" | "opponent-result"
  >("your-result");
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
  const [percentage, setPercentage] = useState(0);
  const [analytics, setAnalytics] = useState({
    total: 0,
    correct: 0,
    wrong: 0,
  });
  const [tabs, setTabs] = useState<"correct" | "wrong" | "incomplete">(
    "correct"
  );
  const [isWinner, setIsWinner] = useState(false);
  const [isDuo, setIsDuo] = useState(false);
  const [isWinAnimation, setIsWinAnimation] = useState(true);
  const [smallScreenTabs, setSmallScreenTabs] = useState<
    "correct" | "wrong-incomplete"
  >("correct");
  const [resignation, setResignation] = useState("");
  const [rematchLoading, setRematchLoading] = useState(false);
  const [isRematchFound, setIsRematchFound] = useState<
    "loading" | "finded" | "cancelled"
  >("loading");
  const [isGetRematchRequest, setIsGetRematchRequest] = useState(false);
  const [userData, setUserData] = useState<User_Type | null>(null);
  const { socketIo } = useSocket();

  useEffect(() => {
    if (!resultId) {
      router.back();
      return;
    }
    const userDataString = storage.getString("current-user");
    if (!userDataString) {
      router.replace("/(auth)");
      return;
    }
    const userDataParse = JSON.parse(userDataString) as User_Type;
    const isGuest = JSON.stringify(userDataParse.isGuest);
    setUserData(userDataParse);
    const loadData = async () => {
      try {
        const { data } = await axios.get(
          `/quiz/get-online-history/${resultId}/${roomId}/${isGuest}`
        );
        if (data.success) {
          if (data.isPending) {
            setIsPending(true);
            setOpponentUser(data.data.opponentUser);
            const timeTaken = new Date(data.data.time.timeTaken);
            timeTaken.setSeconds(
              Number(data.data.time.fullTime) - timeTaken.getSeconds()
            );
            setRemainingTime(timeTaken);
            if (data.data.myData) {
              setMyData(data.data.myData);
            }
          } else {
            setResignation(data.data.resignation);
            setIsPending(false);
            setOpponentUser(data.data.opponentUser);
            if (data.data.myHistory) {
              setMyData(data.data.myHistory);
            }
            if (data.data.opponentHistory) {
              setOpponentData(data.data.opponentHistory);
            }
          }
        } else {
          router.back();
        }
      } catch (error) {
        console.error(error);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    socketIo.emit("get-online-history", { resultId, roomId });

    const handleHistoryData = (data: any) => {
      if (data) {
        setIsPending(false);
        setOpponentData(data);
      }
    };

    const handleHistoryError = (data: any) => {
      if (data.error === "payload-error" || data.error === "not-found") {
        console.log("Something went wrong!");
        // toast.error("Something went wrong, please try again later!");
      }
    };

    socketIo.on("get-online-history-data", handleHistoryData);
    socketIo.on("get-online-history-error", handleHistoryError);

    return () => {
      socketIo.off("get-online-history-data", handleHistoryData);
      socketIo.off("get-online-history-error", handleHistoryError);
    };
  }, [resultId, roomId, router]);

  useEffect(() => {
    if (!myData && !opponentData) return;
    if (currentTab === "your-result" && myData) {
      handleDataStates(myData);
    } else if (currentTab === "opponent-result" && opponentData) {
      handleDataStates(opponentData);
    }
  }, [currentTab, myData, opponentData]);

  useEffect(() => {
    if (!myData || !opponentData) return;
    const myCorrectAnswer = myData.quizIdAndValue.filter(
      (item: any) => item.isCorrect
    ).length;
    const opponentCorrectAnswer = opponentData.quizIdAndValue.filter(
      (item: any) => item.isCorrect
    ).length;
    if (myCorrectAnswer > opponentCorrectAnswer) {
      setIsWinner(true);
    } else if (myCorrectAnswer < opponentCorrectAnswer) {
      setIsWinner(false);
    } else if (myCorrectAnswer === opponentCorrectAnswer) {
      setIsDuo(true);
    }
  }, [myData, opponentData]);

  const checkResign = () => {
    if (resignation) {
      if (resignation === userData?.id) {
        return "true";
      } else {
        return "false";
      }
    } else {
      return "no-resign";
    }
  };
  const remainingTimer = () => {
    if (!remainingTime) return;
    let time = new Date(remainingTime);
    if (
      time.getSeconds() === 0 &&
      time.getMinutes() === 0 &&
      time.getHours() === 0
    ) {
      setIsPending(false);
      return;
    }

    const interval = setInterval(() => {
      time.setSeconds(time.getSeconds() - 1);
      if (
        time.getSeconds() === 0 &&
        time.getMinutes() === 0 &&
        time.getHours() === 0
      ) {
        setRemainingTime(time);
        clearInterval(interval);
        return;
      }

      setRemainingTime(time);
    }, 1000);
    return `${String(time.getHours()).padStart(2, "0")} : ${String(
      time.getMinutes()
    ).padStart(2, "0")} : ${String(time.getSeconds()).padStart(2, "0")}`;
  };

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

  const getCompleteTime = () => {
    if (!myData?.time && !opponentData?.time) return;
    let completeTime: any;
    if (currentTab === "your-result") {
      completeTime = new Date(myData?.time as number);
    }
    if (currentTab === "opponent-result") {
      completeTime = new Date(opponentData?.time as number);
    }
    return `${completeTime.getHours()} : ${completeTime.getMinutes()} : ${completeTime.getSeconds()}`;
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              gap: 10,
            }}
          >
            <ActivityIndicator color={colors.primary} size={40} />
            <Text style={styles.loadingText}>Please Wait...</Text>
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            height: "100%",
            position: "relative",
          }}
        >
          <BackButton />

          <View style={[styles.switchButtonContainer]}>
            <TouchableOpacity
              onPress={() => setCurrentTab("your-result")}
              activeOpacity={0.7}
              style={[
                styles.switchButton,
                {
                  backgroundColor:
                    currentTab === "your-result"
                      ? colors.primary
                      : colors.grayDark,
                },
              ]}
            >
              <Text style={styles.subTitleText}>Your Result</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentTab("opponent-result")}
              activeOpacity={0.7}
              style={[
                styles.switchButton,
                {
                  backgroundColor:
                    currentTab === "your-result"
                      ? colors.grayDark
                      : colors.primary,
                },
              ]}
            >
              <Text style={styles.subTitleText}>Opponent Result</Text>
            </TouchableOpacity>
          </View>
          {/* My Data */}
          {currentTab === "your-result" && (
            <>
              {isPending ? (
                <Text
                  style={{
                    color: colors.grayDark,
                    fontFamily: fontFamily.Bold,
                    fontSize: 20,
                    textAlign: "center",
                    marginTop: 15,
                  }}
                >
                  Result pending
                </Text>
              ) : (
                <>
                  {checkResign() === "no-resign" && (
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          color: colors.grayDark,
                          fontFamily: fontFamily.Bold,
                          fontSize: 20,
                          textAlign: "center",
                          marginTop: 15,
                        }}
                      >
                        {isWinner && !isDuo && <>You Win!</>}
                        {!isWinner && !isDuo && <>You Loose!</>}
                        {!isWinner && isDuo && <>Its a Duo!</>}
                      </Text>
                    </View>
                  )}
                  {checkResign() === "false" && (
                    <View style={{ alignItems: "center", marginTop: 15 }}>
                      <Text
                        style={{
                          color: colors.grayDark,
                          fontFamily: fontFamily.Bold,
                          fontSize: 20,
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
                          color: colors.grayDark,
                          fontFamily: fontFamily.Bold,
                          fontSize: 20,
                        }}
                      >
                        You Loose By Resignation
                      </Text>
                    </View>
                  )}
                </>
              )}
              <View style={styles.chartContainer}>
                <CircleChart
                  percentage={percentage}
                  strokeWidth={18}
                  size={200}
                />
              </View>
              <View style={styles.analyticBoxes}>
                <View
                  style={[
                    styles.analyticBox,
                    { backgroundColor: colors.grayDark },
                  ]}
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
                  style={[
                    styles.analyticBox,
                    { backgroundColor: colors.grayDark },
                  ]}
                >
                  <Text style={styles.subTitleText}>Wrong</Text>
                  <Text style={[styles.titleText, { fontSize: 23 }]}>
                    {wrongQuiz?.length ?? 0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 10,
                  width: "100%",
                  height: "100%",
                  flex: 1,
                  zIndex: 100,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {checkResign() === "no-resign" &&
                  isWinner &&
                  isWinAnimation && (
                    <LottieReact
                      source={successAnimation}
                      autoPlay
                      style={{ width: "100%", height: 400 }}
                      loop={false}
                      hardwareAccelerationAndroid={true}
                      onAnimationFinish={() => setIsWinAnimation(false)}
                    />
                  )}
                {checkResign() === "false" && isWinAnimation && (
                  <LottieReact
                    source={successAnimation}
                    autoPlay
                    style={{ width: "100%", height: "100%" }}
                    loop={false}
                    hardwareAccelerationAndroid={true}
                    onAnimationFinish={() => setIsWinAnimation(false)}
                  />
                )}
              </View>
              <View style={{ gap: 6, alignItems: "center", marginTop: 7 }}>
                <View style={styles.historyButtonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setTabs("correct")}
                    style={[
                      styles.historyButton,
                      {
                        backgroundColor:
                          tabs === "correct" ? colors.primary : colors.grayDark,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.subTitleText,
                        { color: "white", fontSize: 14 },
                      ]}
                    >
                      Correct
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setTabs("wrong")}
                    activeOpacity={0.7}
                    style={[
                      styles.historyButton,
                      {
                        backgroundColor:
                          tabs === "wrong" ? colors.primary : colors.grayDark,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.subTitleText,
                        { color: "white", fontSize: 14 },
                      ]}
                    >
                      Wrong
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setTabs("incomplete")}
                    activeOpacity={0.7}
                    style={[
                      styles.historyButton,
                      {
                        backgroundColor:
                          tabs === "incomplete"
                            ? colors.primary
                            : colors.grayDark,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.subTitleText,
                        { color: "white", fontSize: 14 },
                      ]}
                    >
                      Incomplete
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Correct Answer */}
                {tabs === "correct" && (
                  <View
                    style={[
                      styles.historyContainer,
                      { backgroundColor: "#bbf7d0" },
                    ]}
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
                {tabs === "wrong" && (
                  <View
                    style={[
                      styles.historyContainer,
                      { backgroundColor: "#fecaca" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.subTitleText,
                        {
                          color: colors.grayDark,
                          fontSize: 14,
                          marginBottom: 10,
                        },
                      ]}
                    >
                      {wrongQuiz?.length} Wrong Answer
                    </Text>
                    {wrongQuiz?.map((quiz, index) => (
                      <QuizResultRow key={quiz._id} item={quiz} index={index} />
                    ))}
                  </View>
                )}
                {tabs === "incomplete" && (
                  <View
                    style={[
                      styles.historyContainer,
                      { backgroundColor: "#594e5b" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.subTitleText,
                        { color: "white", fontSize: 14 },
                      ]}
                    >
                      {incompleteQuiz?.length} Incomplete Answer
                    </Text>
                    {incompleteQuiz?.map((quiz, index) => (
                      <QuizResultRow key={quiz._id} item={quiz} index={index} />
                    ))}
                  </View>
                )}
              </View>
            </>
          )}
          {/* Opponent Data */}
          {currentTab === "opponent-result" && (
            <>
              {isPending && !opponentData && (
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    marginTop: 16,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      gap: 8,
                      alignItems: "center",
                      backgroundColor: "white",
                      shadowColor: "#000",
                      shadowOffset: { width: 3, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 20,
                      maxWidth: "100%",
                      width: "100%",
                      paddingHorizontal: 12,
                      paddingVertical: 24,
                      borderRadius: 8,
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        width: 200,
                        height: 130,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      <LottieReact
                        source={clockAnimation}
                        autoPlay
                        loop
                        style={{ width: "100%", height: "100%" }}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: fontFamily.Bold,
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: 36,
                      }}
                    >
                      Result Pending
                    </Text>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fontFamily.Regular,
                            color: "#737373",
                            fontSize: 16,
                          }}
                        >
                          Time Left
                        </Text>
                        <AntDesign
                          name="clockcircleo"
                          size={20}
                          color="#737373"
                        />
                      </View>
                      <Text
                        style={{
                          fontFamily: "OpenSans",
                          color: "#6D28D9",
                          fontWeight: "600",
                          fontSize: 18,
                        }}
                      >
                        {remainingTimer()}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        gap: 4,
                        alignItems: "center",
                        marginTop: 16,
                      }}
                    >
                      <Image
                        source={{ uri: opponentUser?.imageUrl }}
                        style={{ width: 48, height: 48, borderRadius: 24 }}
                      />
                      <Text
                        style={{
                          fontFamily: "OpenSans",
                          fontWeight: "600",
                          color: "#9CA3AF",
                          textAlign: "center",
                        }}
                      >
                        {opponentUser?.fullName}
                        {"\n"}
                        <Text
                          style={{ fontWeight: "normal", color: "#9CA3AF" }}
                        >
                          is still playing.
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              {!isPending && opponentData && (
                <>
                  <>
                    {checkResign() === "no-resign" && (
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            color: colors.grayDark,
                            fontFamily: fontFamily.Bold,
                            fontSize: 20,
                            textAlign: "center",
                            marginTop: 15,
                          }}
                        >
                          {isWinner && !isDuo && <>Loose!</>}
                          {!isWinner && !isDuo && <>Win!</>}
                          {!isWinner && isDuo && <>Its a Duo!</>}
                        </Text>
                      </View>
                    )}
                    {checkResign() === "false" && (
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            color: colors.grayDark,
                            fontFamily: fontFamily.Bold,
                            fontSize: 20,
                          }}
                        >
                          Loose By Resignation
                        </Text>
                      </View>
                    )}
                    {checkResign() === "true" && (
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            color: colors.grayDark,
                            fontFamily: fontFamily.Bold,
                            fontSize: 20,
                          }}
                        >
                          Win By Resignation
                        </Text>
                      </View>
                    )}
                  </>
                  <View style={styles.chartContainer}>
                    <CircleChart
                      percentage={percentage}
                      strokeWidth={18}
                      size={200}
                    />
                  </View>
                  <View style={styles.analyticBoxes}>
                    <View
                      style={[
                        styles.analyticBox,
                        { backgroundColor: colors.grayDark },
                      ]}
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
                      style={[
                        styles.analyticBox,
                        { backgroundColor: colors.grayDark },
                      ]}
                    >
                      <Text style={styles.subTitleText}>Wrong</Text>
                      <Text style={[styles.titleText, { fontSize: 23 }]}>
                        {wrongQuiz?.length ?? 0}
                      </Text>
                    </View>
                  </View>
                  <View style={{ gap: 6, alignItems: "center", marginTop: 7 }}>
                    <View style={styles.historyButtonContainer}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setTabs("correct")}
                        style={[
                          styles.historyButton,
                          {
                            backgroundColor:
                              tabs === "correct"
                                ? colors.primary
                                : colors.grayDark,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subTitleText,
                            { color: "white", fontSize: 14 },
                          ]}
                        >
                          Correct
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setTabs("wrong")}
                        activeOpacity={0.7}
                        style={[
                          styles.historyButton,
                          {
                            backgroundColor:
                              tabs === "wrong"
                                ? colors.primary
                                : colors.grayDark,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subTitleText,
                            { color: "white", fontSize: 14 },
                          ]}
                        >
                          Wrong
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setTabs("incomplete")}
                        activeOpacity={0.7}
                        style={[
                          styles.historyButton,
                          {
                            backgroundColor:
                              tabs === "incomplete"
                                ? colors.primary
                                : colors.grayDark,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subTitleText,
                            { color: "white", fontSize: 14 },
                          ]}
                        >
                          Incomplete
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {/* Correct Answer */}
                    {tabs === "correct" && (
                      <View
                        style={[
                          styles.historyContainer,
                          { backgroundColor: "#bbf7d0" },
                        ]}
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
                          <QuizResultRow
                            key={quiz._id}
                            item={quiz}
                            index={index}
                          />
                        ))}
                      </View>
                    )}
                    {tabs === "wrong" && (
                      <View
                        style={[
                          styles.historyContainer,
                          { backgroundColor: "#fecaca" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subTitleText,
                            {
                              color: colors.grayDark,
                              fontSize: 14,
                              marginBottom: 10,
                            },
                          ]}
                        >
                          {wrongQuiz?.length} Wrong Answer
                        </Text>
                        {wrongQuiz?.map((quiz, index) => (
                          <QuizResultRow
                            key={quiz._id}
                            item={quiz}
                            index={index}
                          />
                        ))}
                      </View>
                    )}
                    {tabs === "incomplete" && (
                      <View
                        style={[
                          styles.historyContainer,
                          { backgroundColor: "#594e5b" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subTitleText,
                            { color: "white", fontSize: 14 },
                          ]}
                        >
                          {incompleteQuiz?.length} Incomplete Answer
                        </Text>
                        {incompleteQuiz?.map((quiz, index) => (
                          <QuizResultRow
                            key={quiz._id}
                            item={quiz}
                            index={index}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default OnlineResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
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
  switchButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
    marginTop: 15,
  },
  switchButton: {
    backgroundColor: colors.primary,
    width: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
  },
  subTitleText: {
    color: "white",
    fontFamily: fontFamily.Medium,
    fontSize: 14,
  },
  chartContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
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
});
