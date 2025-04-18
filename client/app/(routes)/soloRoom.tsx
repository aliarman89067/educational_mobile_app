import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import axios from "axios";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import Timer from "@/components/timer";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { storage } from "@/utils";
import { User_Type } from "@/utils/type";

const SoloRoom = () => {
  const { roomId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [isLeaveModal, setIsLeaveModal] = useState(false);
  const [isInfoModal, setIsInfoModal] = useState(false);
  const [isLeaveError, setIsLeaveError] = useState(false);
  const [isLeaveLoading, setIsLeaveLoading] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [userData, setUserData] = useState<User_Type | null>(null);

  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const pathname = usePathname();

  const [selectedOptionIds, setSelectedOptionIds] = useState<
    | null
    | {
        _id: string;
        option: { _id: string; isCorrect: boolean; mcqId: string };
      }[]
  >(null);
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
        const userDataString = storage.getString("current-user");
        if (userDataString) {
          setUserData(JSON.parse(userDataString));
        } else {
          router.replace("/(auth)");
          return;
        }
        const { data: quizData } = await axios.get(
          `/quiz/get/solo-room/${roomId}`
        );
        console.log(quizData.data);
        setData(quizData.data);
      } catch (err: any) {
        console.log(err);
        router.replace("/(tabs)");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadRoomData();
  }, [roomId, router, pathname]);

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

  const handlePrev = () => {
    if (quizIndex > 0) {
      setQuizIndex(quizIndex - 1);
    }
  };

  const handleNext = () => {
    if (data && data?.quizes && data?.quizes.length > 0) {
      if (quizIndex < data.quizes.length - 1) {
        setQuizIndex(quizIndex + 1);
        setIsNextClicked(false);
      }
    }
  };

  const leaveSoloRoom = async () => {
    if (!roomId) return;
    try {
      setIsLeaveLoading(true);
      setIsLeaveError(false);
      await axios.put(`/quiz/leave/solo-room/${roomId}`);
      router.back();
    } catch (error) {
      console.log(error);
      setIsLeaveError(true);
    } finally {
      setIsLeaveLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!data) return;

    let completeTime: number;

    if (data.seconds === "no-limit") {
      const now = new Date();
      now.setHours(time.hours, time.minutes, time.seconds, 0);
      completeTime = now.getTime();
    } else {
      const now = new Date(Number(data.seconds) * 1000);

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
    const sortedQuizId = selectedOptionIds?.map((item) => ({
      _id: item.option.mcqId,
      isCorrect: item.option.isCorrect,
      selected: item.option._id,
    }));

    const mcqs = data.quizes.map((item) => item._id);

    try {
      const { data: responseData } = await axios.post(
        "/quiz/submit/solo-room",
        {
          roomId: roomId,
          type: "solo-room",
          mcqs,
          states: sortedQuizId ?? [],
          isGuest: userData?.isGuest,
          userId: userData?.id,
          time: completeTime,
        }
      );
      setIsTimeout(false);
      router.back();
      router.push({
        pathname: "/(routes)/soloResult",
        params: { historyId: responseData.data },
      });
    } catch (error) {
      console.log(error);
      ToastAndroid.showWithGravity(
        "Something went wrong!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      setIsTimeout(false);
    }
  };

  useEffect(() => {
    if (isTimeout) {
      handleSubmit();
    }
  }, [isTimeout]);

  const isLastQuiz =
    data &&
    data.quizes &&
    data.quizes.length &&
    quizIndex >= data.quizes.length - 1;

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
                        onPress={leaveSoloRoom}
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
                        {data.seconds === "no-limit" ? (
                          <>Unlimited Time</>
                        ) : (
                          <>{data.seconds} Seconds</>
                        )}
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
                        {data.quizes.length}
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
                        {data.quizType === "Topical" ? "Topic" : "Year"}
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
                        {data.quizType === "Topical" ? (
                          <>{data.topicId.topic}</>
                        ) : (
                          <>{data.yearId.year}</>
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
          <View style={styles.innerContainer}>
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
                {data.seconds !== "no-limit" ? (
                  <Text style={styles.timeLeftText}>Time Left</Text>
                ) : (
                  <Text style={styles.timeLeftText}>Time</Text>
                )}
                <Timer
                  seconds={data.seconds}
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
                    {data.quizes[quizIndex].mcq}
                  </Text>
                </View>
                <View style={styles.optionsContainer}>
                  {data.quizes[quizIndex].options.map((option, index) => {
                    const isMatched = handleIsMatched(
                      data.quizes[quizIndex]._id,
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
                            _id: data.quizes[quizIndex]._id,
                            option: {
                              _id: option._id,
                              isCorrect: option.isCorrect,
                              mcqId: data.quizes[quizIndex]._id,
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
                        <Text style={styles.quizOptionText}>{option.text}</Text>
                      </TouchableOpacity>
                    );
                  })}
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
