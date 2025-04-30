import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useSocketStore } from "@/context/zustandStore";
import { useSocket } from "@/context/SocketContext";
import axios from "axios";
import { fontFamily } from "@/constants/fonts";
import { colors } from "@/constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Timer from "@/components/timer";
import asyncStorage from "@react-native-async-storage/async-storage";
import { User_Type } from "@/utils/type";

const FriendRoom = () => {
  const { roomId } = useLocalSearchParams();

  const pathname = usePathname();
  // States
  const [isError, setIsError] = useState(false);
  const [isLeaveModal, setIsLeaveModal] = useState(false);
  const [isInfoModal, setIsInfoModal] = useState(false);
  const [isLeaveError, setIsLeaveError] = useState(false);
  const [isLeaveLoading, setIsLeaveLoading] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isUserMessage, setIsUserMessage] = useState(false);
  const [opponentQuizIndex, setOpponentQuizIndex] = useState(0);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<null | {
    friendRoomData: {
      _id: string;
      seconds: string;
      quizType: "Topical" | "Yearly";
      quizes: {
        _id: string;
        mcq: string;
        options: { text: string; isCorrect: boolean; _id: string }[];
      }[];
      subjectId: {
        subject: string;
        _id: string;
      };
      topicId: {
        topic: string;
        _id: string;
      };
      yearId: {
        year: string;
        _id: string;
      };
      uniqueKey: string;
    };
    opponent: {
      clerkId: string;
      fullName: string;
      imageUrl: string;
    };
  }>(null);
  const { sessionId } = useSocketStore();
  const [quizIndex, setQuizIndex] = useState(0);
  // const [isBackPressed, setIsBackPressed] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [selectedOptionIds, setSelectedOptionIds] = useState<
    | null
    | {
        _id: string;
        option: { _id: string; isCorrect: boolean; mcqId: string };
      }[]
  >([]);
  const [isOpponentComplete, setIsOpponentComplete] = useState(false);
  const [opponentCompleteTime, setOpponentCompleteTime] = useState("");
  const [isOpponentResign, setIsOpponentResign] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [newOnlineResultId, setNewOnlineResultId] = useState("");
  // const [isLeaving, setIsLeaving] = useState(false);
  const [userData, setUserData] = useState<User_Type | null>(null);

  const { socketIo } = useSocket();

  useEffect(() => {
    let timeoutId: any;
    if (!roomId) {
      router.back();
      return;
    }

    // Load data function
    const loadData = async () => {
      try {
        const userDataString = await asyncStorage.getItem("current-user");
        if (!userDataString) {
          router.replace("/(auth)");
          return;
        }
        const userDataParse = JSON.parse(userDataString) as User_Type;

        setUserData(userDataParse);

        const isGuestString = JSON.stringify(userDataParse.isGuest);
        // TODO: Check this
        const { data } = await axios.get(
          `/quiz/get-friend-room/${roomId}/${userDataParse.id}/${sessionId}`
        );
        if (data.success) {
          console.log(data.data);
          setRemainingTime(data.data.remainingTime);
          setData(data.data);
          setIsUserMessage(true);
          timeoutId = setTimeout(() => {
            setIsUserMessage(false);
          }, 4000);
        } else {
          // Handles all errors by their type
          if (data.error === "room-expired") {
            console.log("Room Expired");
            router.back();
          }
          if (data.error === "server-error") {
            console.log("Server Error");
            router.back();
          }
          if (data.error === "opponent-left") {
            console.log("Opponent Left");
            router.back();
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    // Call loadData function
    loadData();

    const opponentCompleteListener = (data: any) => {
      if (data.isCompleted) {
        setIsOpponentComplete(true);
        const completeTime = new Date(data.time);
        setOpponentCompleteTime(
          `${completeTime.getHours()} : ${completeTime.getMinutes()} : ${completeTime.getSeconds()}`
        );
        setTimeout(() => {
          setIsOpponentComplete(false);
        }, 5000);
      }
    };
    const completeResponseListener = (data: any) => {
      router.replace({
        pathname: "/(routes)/friendResult",
        // TODO: Check this
        params: { friendResultId: data._id, roomId },
      });
    };

    socketIo.on("opponent-completed", opponentCompleteListener);
    socketIo.on("complete-response", completeResponseListener);

    return () => {
      socketIo.off("opponent-completed", opponentCompleteListener);
      socketIo.off("complete-response", completeResponseListener);
      clearTimeout(timeoutId);
    };
  }, [roomId, router, pathname]);

  useEffect(() => {
    if (!data) return;
    const completeResignListener = (data: any) => {
      setIsOpponentResign(true);
      setNewOnlineResultId(data._id);
      setTimeout(() => {
        setIsOpponentResign(false);
        router.replace({
          pathname: "/(routes)/friendResult",
          // TODO: Check this
          params: { friendResultId: data._id, roomId },
        });
      }, 5000);
    };
    socketIo.on("opponent-resign", resignResponseListener);
    socketIo.on("complete-resign-response", completeResignListener);
    socketIo.on("opponent-send-index", (data: any) => {
      setOpponentQuizIndex(data.index);
    });
    return () => {
      socketIo.off("opponent-resign", resignResponseListener);
      socketIo.off("complete-resign-response", completeResignListener);
    };
  }, [isLoading, data, time]);

  const getSubmitData = () => {
    // Time Taken Calculation
    let completeTime: number;

    if (data?.friendRoomData.seconds === "no-limit") {
      const now = new Date();
      now.setHours(time.hours, time.minutes, time.seconds, 0);
      completeTime = now.getTime();
    } else {
      const now = new Date(Number(data?.friendRoomData.seconds) * 1000);

      const future = new Date(
        time.hours * 60 * 60 * 1000 +
          time.minutes * 60 * 1000 +
          time.seconds * 1000
      );

      const diffInMilliseconds = Math.abs(future.getTime() - now.getTime());
      const diffInSeconds = diffInMilliseconds / 1000;

      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = Math.floor(diffInSeconds % 60);

      const mainDiff = new Date();
      mainDiff.setHours(hours, minutes, seconds, 0);
      completeTime = mainDiff.getTime();
    }

    // Get MCQ IDs and Sorted Quiz Options
    const mcqs = data?.friendRoomData?.quizes.map((item) => item._id);
    const sortedQuizId = selectedOptionIds?.map((item) => ({
      _id: item.option.mcqId,
      isCorrect: item.option.isCorrect,
      selected: item.option._id,
    }));

    return {
      // TODO: Check this
      roomId: roomId,
      userId: userData?.id,
      selectedStates: sortedQuizId,
      mcqs,
      completeTime,
    };
  };

  const handleResign = () => {
    const { completeTime, mcqs, roomId, selectedStates, userId } =
      getSubmitData();
    socketIo.emit("friend-resign-by-leave", {
      completeTime,
      mcqs,
      roomId,
      selectedStates,
      userId,
    });
    router.back();
  };

  const resignResponseListener = (responseData: any) => {
    console.log("Listening to resign message 1");
    if (responseData.isCompleted) {
      console.log("Listening to resign message 2");
      // Socket Logic
      // Time Taken Calculation
      let completeTime: number;
      if (data?.friendRoomData.seconds === "no-limit") {
        const now = new Date();
        now.setHours(time.hours, time.minutes, time.seconds, 0);
        completeTime = now.getTime();
      } else {
        console.log(data?.friendRoomData.seconds);
        console.log(time);
        const now = new Date(Number(data?.friendRoomData.seconds) * 1000);
        const future = new Date(
          time.hours * 60 * 60 * 1000 +
            time.minutes * 60 * 1000 +
            time.seconds * 1000
        );
        const diffInMilliseconds = Math.abs(future.getTime() - now.getTime());
        const diffInSeconds = diffInMilliseconds / 1000;
        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = Math.floor(diffInSeconds % 60);
        const mainDiff = new Date();
        mainDiff.setHours(hours, minutes, seconds, 0);
        completeTime = mainDiff.getTime();
      }
      // Get MCQ IDs and Sorted Quiz Options
      const mcqs = data?.friendRoomData?.quizes.map((item) => item._id);
      const sortedQuizId = selectedOptionIds?.map((item) => ({
        _id: item.option.mcqId,
        isCorrect: item.option.isCorrect,
        selected: item.option._id,
      }));
      // Emit submission data to the server
      socketIo.emit("friend-resign-submit", {
        // TODO: Check This
        roomId: roomId,
        userId: userData?.id,
        selectedStates: sortedQuizId,
        mcqs,
        completeTime,
      });
    }
  };

  const handleIsMatched = (_id: string, optionId: string): boolean => {
    if (!selectedOptionIds) return false;
    const checkQuizId = selectedOptionIds.find((item) => item._id === _id);
    if (checkQuizId) {
      const quizIndex = selectedOptionIds.indexOf(checkQuizId);
      if (quizIndex >= 0) {
        const isMatched = selectedOptionIds[quizIndex].option._id === optionId;
        if (isMatched) {
          return true;
        }
      }
    }
    return false;
  };

  const handleOptionChange = ({
    _id,
    option,
  }: {
    _id: string;
    option: { _id: string; isCorrect: boolean; mcqId: string };
  }) => {
    setSelectedOptionIds((prev) => {
      if (!prev) return [{ _id, option }];

      const updatedState = prev.map((item) => {
        if (item._id === _id) {
          return {
            ...item,
            option: {
              ...item.option,
              _id: option._id,
              isCorrect: option.isCorrect,
            },
          };
        }
        return item;
      });

      const isExist = prev.some((item) => item._id === _id);
      if (!isExist) {
        return [...updatedState, { _id, option }];
      }
      return updatedState;
    });
    setIsNextClicked(true);
  };

  const handleSubmit = () => {
    let timeoutId1: any;
    try {
      // Time Taken Calculation
      let completeTime: number;

      if (data?.friendRoomData.seconds === "no-limit") {
        const now = new Date();
        now.setHours(time.hours, time.minutes, time.seconds, 0);
        completeTime = now.getTime();
      } else {
        const now = new Date(Number(data?.friendRoomData.seconds) * 1000);

        const future = new Date(
          time.hours * 60 * 60 * 1000 +
            time.minutes * 60 * 1000 +
            time.seconds * 1000
        );

        const diffInMilliseconds = Math.abs(future.getTime() - now.getTime());
        const diffInSeconds = diffInMilliseconds / 1000;

        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = Math.floor(diffInSeconds % 60);

        const mainDiff = new Date();
        mainDiff.setHours(hours, minutes, seconds, 0);
        completeTime = mainDiff.getTime();
      }

      // Get MCQ IDs and Sorted Quiz Options
      const mcqs = data?.friendRoomData?.quizes.map((item) => item._id);
      const sortedQuizId = selectedOptionIds?.map((item) => ({
        _id: item.option.mcqId,
        isCorrect: item.option.isCorrect,
        selected: item.option._id,
      }));
      // Emit submission data to the server
      socketIo.emit("friend-submit", {
        // TODO: Check this
        roomId: roomId,
        userId: userData?.id,
        selectedStates: sortedQuizId,
        mcqs,
        completeTime,
      });

      // Handle submit error using socket listener with cleanup
      const handleSubmitError = (data: any) => {
        if (data.error === "payload-not-correct") {
          console.log("Payload is not correct for submission");
          ToastAndroid.showWithGravity(
            "Something went wrong!",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
        }
      };

      // Register socket event listeners

      socketIo.on("submit-error", handleSubmitError);

      // Cleanup socket listener after it triggers
      const cleanupSocketListener = () => {
        socketIo.off("submit-error", handleSubmitError);
        clearTimeout(timeoutId1);
      };
      setTimeout(cleanupSocketListener, 5000);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      ToastAndroid.showWithGravity(
        "An unexpected error occurred.",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
  };
  useEffect(() => {
    if (isTimeout) {
      handleSubmit();
    }
  }, [isTimeout]);

  const handleNext = () => {
    if (
      data &&
      data?.friendRoomData.quizes &&
      data?.friendRoomData.quizes.length > 0
    ) {
      if (quizIndex < data.friendRoomData.quizes.length - 1) {
        setQuizIndex(quizIndex + 1);
        socketIo.emit("opponent-quiz-index", {
          index: quizIndex + 1,
          // TODO: Check this
          roomId: roomId,
          userId: userData?.id,
        });
      }
    }
    setIsNextClicked(false);
  };

  const width = Dimensions.get("window").width;

  const getOpponentPer = () => {
    if (!data?.friendRoomData.quizes.length) return 0;

    const progressRatio =
      opponentQuizIndex / data?.friendRoomData.quizes.length;
    const offset = progressRatio * width;
    return offset - 30;
  };

  const isLastQuiz =
    data &&
    data.friendRoomData.quizes &&
    data.friendRoomData.quizes.length &&
    quizIndex >= data.friendRoomData.quizes.length - 1;

  const isNextDisabled =
    selectedOptionIds && selectedOptionIds[quizIndex] === null;

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
        <ScrollView style={{ flex: 1, height: "100%" }}>
          <View style={styles.container}>
            {/* Leave Modal */}
            {isLeaveModal && (
              <>
                <View style={styles.leaveModalContainer}>
                  {isLeaveLoading ? (
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <ActivityIndicator size={20} color="white" />
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 17,
                          fontFamily: fontFamily.Medium,
                        }}
                      >
                        Leaving...
                      </Text>
                    </View>
                  ) : (
                    <>
                      {isLeaveError && (
                        <Text
                          style={{
                            color: "#ff8fa3",
                            fontSize: 17,
                            fontFamily: fontFamily.Medium,
                            textAlign: "center",
                          }}
                        >
                          Something went wrong!
                        </Text>
                      )}
                      <Text style={styles.leaveModalTitle}>Are you sure?</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={handleResign}
                          style={styles.leaveModalButton}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.leaveModalButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setIsLeaveModal(false)}
                          style={styles.stayModalButton}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.stayModalButtonText}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </>
            )}
            {/* Info Modal */}
            {isInfoModal && (
              <View style={styles.leaveModalContainer}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    flex: 1,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsInfoModal(false)}
                    style={{
                      backgroundColor: "white",
                      paddingVertical: 13,
                      paddingHorizontal: 20,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      marginLeft: "auto",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 14,
                        fontFamily: fontFamily.Bold,
                      }}
                    >
                      Close
                    </Text>
                    <AntDesign name="close" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      padding: 10,
                      borderRadius: 10,
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.grayDark,
                          borderRadius: 5,
                          width: 100,
                          paddingVertical: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 15,
                            fontFamily: fontFamily.Regular,
                          }}
                        >
                          Time
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: colors.grayDark,
                          borderRadius: 5,
                          width: 170,
                          paddingVertical: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 15,
                            fontFamily: fontFamily.Medium,
                          }}
                        >
                          <>{data.friendRoomData.seconds} Seconds</>
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.grayDark,
                          borderRadius: 5,
                          width: 100,
                          paddingVertical: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 15,
                            fontFamily: fontFamily.Regular,
                          }}
                        >
                          Quiz
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: colors.grayDark,
                          borderRadius: 5,
                          width: 170,
                          paddingVertical: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 15,
                            fontFamily: fontFamily.Medium,
                          }}
                        >
                          {data.friendRoomData.quizes.length}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.grayDark,
                          borderRadius: 5,
                          width: 100,
                          paddingVertical: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 15,
                            fontFamily: fontFamily.Regular,
                          }}
                        >
                          {data.friendRoomData.quizType === "Topical"
                            ? "Topic"
                            : "Year"}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: colors.grayDark,
                          borderRadius: 5,
                          width: 170,
                          paddingVertical: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 15,
                            fontFamily: fontFamily.Medium,
                          }}
                        >
                          {data.friendRoomData.quizType === "Topical" ? (
                            <>{data.friendRoomData.topicId.topic}</>
                          ) : (
                            <>{data.friendRoomData.yearId.year}</>
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
            {!isOpponentComplete && !isOpponentResign && (
              <View
                style={{
                  width: width,
                  paddingHorizontal: 18,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 4,
                    borderRadius: 50,
                    backgroundColor: colors.primary,
                    position: "relative",
                    marginTop: 20,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 100,
                      backgroundColor: colors.grayDark,
                      position: "absolute",
                      top: -20,
                      left: getOpponentPer(),
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{ uri: data.opponent.imageUrl }}
                      alt="Opponent image url"
                      resizeMode="contain"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 100,
                      }}
                    />
                  </View>
                </View>
              </View>
            )}
            <View style={styles.innerContainer}>
              {isOpponentResign && (
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    marginBottom: 10,
                    gap: 5,
                    borderRadius: 5,
                    elevation: 2,
                  }}
                >
                  <Image
                    source={{ uri: data.opponent.imageUrl }}
                    alt="Opponent image"
                    resizeMode="contain"
                    style={{ width: 35, height: 35, borderRadius: 100 }}
                  />
                  <Text
                    style={{
                      color: colors.grayDark,
                      fontFamily: fontFamily.Bold,
                      fontSize: 15,
                    }}
                  >
                    {data.opponent.fullName}
                  </Text>
                  <Text
                    style={{
                      color: colors.grayDark,
                      fontFamily: fontFamily.Regular,
                      fontSize: 15,
                    }}
                  >
                    Resign the quiz
                  </Text>
                </View>
              )}
              {isOpponentComplete && (
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    marginBottom: 10,
                    gap: 5,
                    borderRadius: 5,
                    elevation: 2,
                  }}
                >
                  <Image
                    source={{ uri: data.opponent.imageUrl }}
                    alt="Opponent image"
                    resizeMode="contain"
                    style={{ width: 35, height: 35, borderRadius: 100 }}
                  />
                  <Text
                    style={{
                      color: colors.grayDark,
                      fontFamily: fontFamily.Bold,
                      fontSize: 15,
                    }}
                  >
                    {data.opponent.fullName}
                  </Text>
                  <Text
                    style={{
                      color: colors.grayDark,
                      fontFamily: fontFamily.Regular,
                      fontSize: 15,
                    }}
                  >
                    completed in {opponentCompleteTime}
                  </Text>
                </View>
              )}
              <View style={styles.headerContainer}>
                <TouchableOpacity
                  onPress={() => setIsLeaveModal(true)}
                  style={styles.leaveButton}
                  activeOpacity={0.7}
                >
                  <AntDesign name="arrowleft" size={15} color="white" />
                  <Text style={styles.leaveButtonText}>Leave</Text>
                </TouchableOpacity>

                <View style={styles.timerContainer}>
                  <Text style={styles.timeLeftText}>Time Left</Text>
                  <Timer
                    seconds={data.friendRoomData.seconds}
                    time={time}
                    setTime={setTime}
                    setIsTimeout={setIsTimeout}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setIsInfoModal(true)}
                  style={styles.infoButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.leaveButtonText}>Info</Text>
                  <Entypo name="menu" size={15} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.contentContainer}>
                <View style={{ flex: 1, width: "100%" }}>
                  <View style={styles.quizContainer}>
                    <Text style={styles.quizText}>
                      {data.friendRoomData.quizes[quizIndex].mcq}
                    </Text>
                  </View>
                  <View style={styles.optionsContainer}>
                    {data.friendRoomData.quizes[quizIndex].options.map(
                      (option, index) => {
                        const isMatched = handleIsMatched(
                          data.friendRoomData.quizes[quizIndex]._id,
                          option._id
                        );
                        return (
                          <TouchableOpacity
                            style={[
                              styles.quizOption,
                              {
                                backgroundColor: isMatched
                                  ? colors.primary
                                  : colors.grayDark,
                              },
                            ]}
                            key={option._id}
                            activeOpacity={0.7}
                            onPress={() =>
                              handleOptionChange({
                                _id: data.friendRoomData.quizes[quizIndex]._id,
                                option: {
                                  _id: option._id,
                                  isCorrect: option.isCorrect,
                                  mcqId:
                                    data.friendRoomData.quizes[quizIndex]._id,
                                },
                              })
                            }
                          >
                            <Text
                              style={[
                                styles.quizOptionText,
                                { fontSize: 14, fontFamily: fontFamily.light },
                              ]}
                            >
                              {String.fromCharCode(97 + index)}.
                            </Text>
                            <Text style={styles.quizOptionText}>
                              {option.text}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>
                </View>
                <View style={styles.navigatorButtonsContainer}>
                  <TouchableOpacity
                    onPress={isLastQuiz ? handleSubmit : handleNext}
                    style={[styles.navigatorButton]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.navigatorButtonText}>Skip</Text>
                  </TouchableOpacity>
                  {isLastQuiz ? (
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={[
                        styles.navigatorButton,
                        {
                          backgroundColor: colors.primary,
                          opacity: isNextClicked ? 1 : 0.7,
                        },
                      ]}
                      activeOpacity={0.7}
                      disabled={!isNextClicked}
                    >
                      <Text style={styles.navigatorButtonText}>Submit</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={handleNext}
                      style={[
                        styles.navigatorButton,
                        { opacity: isNextClicked ? 1 : 0.7 },
                      ]}
                      activeOpacity={0.7}
                      disabled={!isNextClicked}
                    >
                      <Text style={styles.navigatorButtonText}>Next</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default FriendRoom;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    position: "relative",
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 10,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  leaveButton: {
    position: "absolute",
    left: 10,
    top: 5,
    backgroundColor: colors.grayDark,
    width: 90,
    paddingVertical: 12,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  infoButton: {
    position: "absolute",
    right: 10,
    top: 5,
    backgroundColor: colors.grayDark,
    width: 90,
    paddingVertical: 12,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  leaveButtonText: {
    color: "white",
    fontSize: 12,
    fontFamily: fontFamily.Regular,
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
    marginVertical: 20,
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
  leaveModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  leaveModalTitle: {
    color: "white",
    fontSize: 18,
    fontFamily: fontFamily.Bold,
  },
  leaveModalButton: {
    backgroundColor: "#ff8fa3",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
  },
  leaveModalButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: fontFamily.Bold,
  },
  stayModalButton: {
    backgroundColor: "#95d5b2",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
  },
  stayModalButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: fontFamily.Bold,
  },
});
