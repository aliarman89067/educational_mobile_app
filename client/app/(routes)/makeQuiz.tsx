import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import BackButton from "@/components/backButton";
import { SelectDropdown, DropdownData } from "expo-select-dropdown";
import axios from "axios";
import { fontFamily } from "@/constants/fonts";
import LottieView from "lottie-react-native";
import FindingTimer from "@/components/findingTimer";
import { noOpponentFound } from "@/constants/images";
import { useSocket } from "@/context/SocketContext";
import { useSocketStore } from "@/context/zustandStore";
import { storage } from "@/utils";
import { User_Type } from "@/utils/type";
import SelectInput from "@/components/SelectInput";

const MakeQuiz = () => {
  const pathname = usePathname();
  const { socketIo } = useSocket();
  const { sessionId } = useSocketStore();
  const { isOnline } = useLocalSearchParams() as { isOnline: string };

  const [isInitialLoadingLoading, setIsInitialLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    value: string;
  } | null>({
    id: "1",
    value: "Topical",
  });
  const [dataCategory] = useState<{ id: string; value: string }[]>([
    { id: "1", value: "Topical" },
    { id: "2", value: "Yearly" },
  ]);
  const [selectedSubject, setSelectedSubject] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [dataSubjects, setDataSubjects] = useState<
    { id: string; value: string }[] | null
  >(null);
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [dataTopics, setDataTopics] = useState<
    { id: string; value: string }[] | null
  >(null);

  const [selectedYear, setSelectedYear] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [dataYears, setDataYears] = useState<
    { id: string; value: string }[] | null
  >(null);
  const [dataTime] = useState<{ id: string; value: string }[] | null>([
    {
      id: "no-limit",
      value: "No Limit",
    },
    {
      id: "30",
      value: "30 Seconds",
    },
    {
      id: "40",
      value: "40 Seconds",
    },
    {
      id: "50",
      value: "50 Seconds",
    },
    {
      id: "60",
      value: "60 Seconds",
    },
    {
      id: "120",
      value: "120 Seconds",
    },
    {
      id: "180",
      value: "180 Seconds",
    },
    {
      id: "240",
      value: "240 Seconds",
    },
    {
      id: "300",
      value: "300 Seconds",
    },
  ]);
  const [selectedTime, setSelectedTime] = useState<{
    id: string;
    value: string;
  } | null>({
    id: "30",
    value: "10 seconds",
  });
  const [dataLength] = useState<{ id: string; value: string }[] | null>([
    { id: "10", value: "10 Quiz" },
    { id: "20", value: "20 Quiz" },
    { id: "30", value: "30 Quiz" },
    { id: "40", value: "40 Quiz" },
    { id: "50", value: "50 Quiz" },
  ]);
  const [selectedLength, setSelectedLength] = useState<{
    id: string;
    value: string;
  } | null>({
    id: "10",
    value: "10 Quiz",
  });
  const [currentSelect, setCurrentSelect] = useState<
    "subject" | "category" | "topic" | "year" | "time" | "length" | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  // Online States
  const [isOnlineModal, setIsOnlineModal] = useState(false);
  const [errorFinding, setErrorFinding] = useState(false);
  const [isOpponentFinding, setIsOpponentFinding] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isOpponentFinded, setIsOpponentFinded] = useState(false);
  const [opponentData, setOpponentData] = useState<null | {
    fullName: string;
    imageUrl: string;
  }>(null);
  const [onlineRoomId, setOnlineRoomId] = useState("");
  const [userData, setUserData] = useState<User_Type | null>(null);

  useEffect(() => {
    const userDataString = storage.getString("current-user");
    if (!userDataString) {
      router.push("/(auth)");
      return;
    }
    setUserData(JSON.parse(userDataString));
    const loadQuiz = async () => {
      try {
        const { data } = await axios.get(
          `/quiz/get-all/${selectedCategory?.value}`
        );
        const formattedSubjectData = data.subjects.map((subject: any) => ({
          id: subject._id,
          value: subject.subject,
        }));
        setSelectedSubject({
          id: formattedSubjectData[0].id,
          value: formattedSubjectData[0].value,
        });
        setDataSubjects(formattedSubjectData);
        if (selectedCategory?.value === "Topical") {
          const topicsData = data.data[0].topics.map((topic: any) => ({
            id: topic._id,
            value: topic.topic,
          }));
          setDataTopics(topicsData);
          setSelectedTopic({
            id: topicsData[0].id,
            value: topicsData[0].value,
          });
          setSelectedYear(null);
          setDataYears(null);
        } else {
          const yearData = data.data[0].years.map((year: any) => ({
            id: year._id,
            value: year.year,
          }));
          setDataYears(yearData);
          setSelectedYear({
            id: yearData[0].id,
            value: yearData[0].value,
          });
          setSelectedTopic(null);
          setDataTopics(null);
        }
      } catch (error: any) {
        console.log({ ...error });
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadQuiz();
  }, [selectedCategory]);

  const handleSoloPlay = async () => {
    if (
      !selectedSubject ||
      (!selectedTopic && !selectedYear) ||
      !selectedLength ||
      (!dataYears && !dataTopics) ||
      !selectedTime
    ) {
      ToastAndroid.showWithGravity(
        "Please Select all Fields",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.post("/quiz/solo-player", {
        subjectId: selectedSubject.id,
        yearIdOrTopicId: selectedTopic?.id || selectedYear?.id,
        quizLimit: Number(selectedLength.id),
        quizType: dataYears ? "Yearly" : "Topical",
        seconds: selectedTime.id,
      });
      router.push({
        pathname: "/(routes)/soloRoom",
        params: { roomId: data.data },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOnlinePlay = () => {
    if (
      !selectedSubject ||
      !selectedSubject?.id ||
      (!selectedTopic && !selectedYear) ||
      !userData ||
      !userData.id ||
      !selectedTime ||
      !sessionId ||
      !selectedTime.id
    ) {
      ToastAndroid.showWithGravity(
        "Please Select all Fields!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    if (!userData || !userData.id) {
      ToastAndroid.showWithGravity(
        "Your not authenticated!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    try {
      setNotFound(false);
      setIsOnlineModal(true);
      setErrorFinding(false);
      setIsOpponentFinding(true);
      const onlineData = {
        subjectId: selectedSubject.id,
        yearIdOrTopicId: selectedTopic?.id ?? selectedYear?.id,
        quizLimit: Number(selectedLength?.id),
        quizType: selectedCategory?.value,
        isGuest: userData.isGuest,
        userId: userData.id,
        name: userData.fullName,
        imageUrl: userData.imageUrl,
        sessionId,
        seconds: selectedTime.id,
      };

      socketIo.emit("create-online-room", onlineData);
      socketIo.on("no-student-found", (data) => {
        setIsOpponentFinding(false);
        setErrorFinding(true);
        setNotFound(true);
      });

      const handleStudentFind = (data: any) => {
        const { roomId, opponent } = data;
        setOpponentData(opponent);
        setOnlineRoomId(roomId);
        setIsOpponentFinded(true);
        setIsOpponentFinding(false);
      };
      socketIo.on("student-find", handleStudentFind);
      socketIo.on("payload-error", () => {
        ToastAndroid.showWithGravity(
          "Something went wrong!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        setIsOpponentFinding(false);
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const handleOnlineCancel = () => {
    setIsOpponentFinding(false);
    setIsOnlineModal(false);
    setErrorFinding(false);
  };
  const handleNoOpponentFound = () => {
    setNotFound(true);
  };
  const handleOnlineRoomRoute = () => {
    setIsOpponentFinded(false);
    setIsOpponentFinding(false);
    setIsOnlineModal(false);
    setNotFound(false);
    router.push({ pathname: "/(routes)/onlineRoom", params: { onlineRoomId } });
  };
  const handleChangeCategory = async (category: string) => {
    const { data } = await axios.get(`/quiz/get-all/${category}`);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {isInitialLoadingLoading ? (
          <>
            <View style={[styles.loadingModal, { backgroundColor: "white" }]}>
              <View style={styles.loadingContent}>
                <ActivityIndicator color={colors.grayLight} size={40} />
                <Text style={[styles.loadingText, { color: colors.grayLight }]}>
                  Please Wait...
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {isLoading && (
              <View style={styles.loadingModal}>
                <View style={styles.loadingContent}>
                  <ActivityIndicator color="white" size={40} />
                  <Text style={styles.loadingText}>Please Wait...</Text>
                </View>
              </View>
            )}
            {isOnlineModal && (
              <>
                {isOpponentFinded ? (
                  <View style={styles.onlineContainer}>
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        gap: 15,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.grayDark,
                          fontSize: 28,
                          fontFamily: fontFamily.Bold,
                          textAlign: "center",
                        }}
                      >
                        Opponent Finded
                      </Text>
                      <Text
                        style={{
                          color: colors.grayDark,
                          fontSize: 18,
                          fontFamily: fontFamily.Regular,
                          textAlign: "center",
                        }}
                      >
                        Match Start in 5 Seconds
                      </Text>
                      <View style={{ alignItems: "center", gap: 10 }}>
                        <Image
                          source={{ uri: opponentData?.imageUrl }}
                          alt="Opponent image url"
                          resizeMode="contain"
                          style={{ width: 70, height: 70, borderRadius: 300 }}
                        />
                        <Text
                          style={{
                            color: colors.grayDark,
                            fontSize: 22,
                            fontFamily: fontFamily.Medium,
                            textAlign: "center",
                          }}
                        >
                          {opponentData?.fullName}
                        </Text>
                      </View>
                      <View style={{ marginTop: 50 }}>
                        <FindingTimer
                          time={5}
                          isStart={isOpponentFinded}
                          fn={handleOnlineRoomRoute}
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.onlineContainer}>
                    <TouchableOpacity
                      onPress={handleOnlineCancel}
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: "#ff4d6d",
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderRadius: 5,
                        marginRight: "auto",
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: fontFamily.Regular,
                          fontSize: 14,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    {notFound ? (
                      <View
                        style={{
                          flex: 1,
                          height: "100%",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 20,
                          gap: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.grayDark,
                            fontSize: 30,
                            fontFamily: fontFamily.Black,
                            textAlign: "center",
                            width: 300,
                          }}
                        >
                          No opponent found!
                        </Text>
                        <Image
                          source={noOpponentFound}
                          alt="No opponent Found Image"
                          resizeMode="contain"
                          style={{
                            width: 250,
                            height: 250,
                          }}
                        />
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            gap: 10,
                            marginTop: 6,
                          }}
                        >
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={handleOnlineCancel}
                            style={{
                              flex: 1,
                              width: "100%",
                              paddingVertical: 17,
                              borderRadius: 8,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: colors.grayDark,
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontFamily: fontFamily.Regular,
                                fontSize: 14,
                              }}
                            >
                              Back
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={handleOnlinePlay}
                            activeOpacity={0.7}
                            style={{
                              flex: 1,
                              width: "100%",
                              paddingVertical: 17,
                              borderRadius: 8,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: colors.primary,
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontFamily: fontFamily.Regular,
                                fontSize: 14,
                              }}
                            >
                              Search Again
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.onlineContent,
                          {
                            marginTop: 20,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontFamily: fontFamily.Bold,
                            color: colors.grayDark,
                            fontSize: 22,
                            textAlign: "center",
                          }}
                        >
                          Finding Opponent
                        </Text>
                        <View
                          style={{
                            transform: [{ translateY: -27 }],
                            alignItems: "center",
                          }}
                        >
                          <LottieView
                            autoPlay
                            loop
                            style={{
                              width: 300,
                              height: 300,
                            }}
                            source={require("../../assets/animations/searching.json")}
                          />
                        </View>
                        <Text
                          style={{
                            fontFamily: fontFamily.Medium,
                            color: colors.grayDark,
                            fontSize: 18,
                            textAlign: "center",
                            transform: [{ translateY: -80 }],
                          }}
                        >
                          Looking for a student who has selected{" "}
                          <Text style={{ fontFamily: fontFamily.Bold }}>
                            {selectedSubject?.value}
                          </Text>{" "}
                          and{" "}
                          <Text style={{ fontFamily: fontFamily.Bold }}>
                            {selectedTopic?.value ?? selectedYear?.value}
                          </Text>
                          .
                        </Text>
                        <FindingTimer time={15} isStart={isOpponentFinding} />
                      </View>
                    )}
                  </View>
                )}
              </>
            )}
            <View style={styles.contentContainer}>
              <BackButton />
              <View style={styles.optionsContainer}>
                <SelectInput
                  selectedState={selectedSubject}
                  setSelectedState={setSelectedSubject}
                  data={dataSubjects}
                  currentSelect={currentSelect}
                  setCurrentSelect={setCurrentSelect}
                  category="subject"
                />
                <SelectInput
                  selectedState={selectedCategory}
                  setSelectedState={setSelectedCategory}
                  data={dataCategory}
                  currentSelect={currentSelect}
                  setCurrentSelect={setCurrentSelect}
                  category="category"
                />
                {dataTopics && dataTopics.length > 0 && (
                  <SelectInput
                    selectedState={selectedTopic}
                    setSelectedState={setSelectedTopic}
                    data={dataTopics}
                    currentSelect={currentSelect}
                    setCurrentSelect={setCurrentSelect}
                    category="topic"
                  />
                )}
                {dataYears && dataYears.length > 0 && (
                  <SelectInput
                    selectedState={selectedYear}
                    setSelectedState={setSelectedYear}
                    data={dataYears}
                    currentSelect={currentSelect}
                    setCurrentSelect={setCurrentSelect}
                    category="year"
                  />
                )}
                <SelectInput
                  selectedState={selectedTime}
                  setSelectedState={setSelectedTime}
                  data={dataTime}
                  currentSelect={currentSelect}
                  setCurrentSelect={setCurrentSelect}
                  category="time"
                />
                <SelectInput
                  selectedState={selectedLength}
                  setSelectedState={setSelectedLength}
                  data={dataLength}
                  currentSelect={currentSelect}
                  setCurrentSelect={setCurrentSelect}
                  category="length"
                />
              </View>
              <TouchableOpacity
                onPress={
                  JSON.parse(isOnline) ? handleOnlinePlay : handleSoloPlay
                }
                activeOpacity={0.7}
                style={styles.playButton}
              >
                <Text style={styles.playText}>
                  {JSON.parse(isOnline) ? "Find Player" : "Play"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MakeQuiz;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: 10,
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
  optionsContainer: {
    flex: 1,
    width: "100%",
    gap: 10,
    marginTop: 30,
  },
  categoryContainer: {
    borderColor: colors.primary,
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  playButton: {
    backgroundColor: colors.primary,
    width: "100%",
    paddingVertical: 20,
    borderRadius: 10,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  playText: {
    color: "white",
    fontFamily: fontFamily.Medium,
    fontSize: 18,
  },
  onlineContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    zIndex: 100,
    paddingHorizontal: 10,
  },
  onlineContent: {
    alignItems: "center",
    gap: 10,
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
