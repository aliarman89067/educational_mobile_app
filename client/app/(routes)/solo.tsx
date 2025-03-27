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
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import BackButton from "@/components/backButton";
import { SelectDropdown, DropdownData } from "expo-select-dropdown";
import axios from "axios";
import { fontFamily } from "@/constants/fonts";

const Solo = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    DropdownData<string, string>
  >({
    key: "1",
    value: "Topical",
  });
  const [dataCategory] = useState<DropdownData<string, string>[]>([
    { key: "1", value: "Topical" },
    { key: "2", value: "Yearly" },
  ]);
  const [selectedSubject, setSelectedSubject] = useState<DropdownData<
    string,
    string
  > | null>({ key: "2", value: "Math" });
  const [dataSubjects] = useState<DropdownData<string, string>[]>([
    { key: "1", value: "All" },
    { key: "2", value: "Math" },
    { key: "3", value: "Science" },
    { key: "4", value: "Physics" },
    { key: "5", value: "Chemistry" },
    { key: "6", value: "Biology" },
    { key: "7", value: "Computer" },
    { key: "8", value: "Algebra" },
  ]);
  const [selectedTopic, setSelectedTopic] = useState<DropdownData<
    string,
    string
  > | null>(null);
  const [dataTopics, setDataTopics] = useState<
    DropdownData<string, string>[] | null
  >(null);

  const [selectedYear, setSelectedYear] = useState<DropdownData<
    string,
    string
  > | null>(null);
  const [dataYears, setDataYears] = useState<
    DropdownData<string, string>[] | null
  >(null);
  const [dataTime] = useState<DropdownData<string, string>[]>([
    { key: "no-limit", value: "No Limit" },
    { key: "10", value: "10 seconds" },
    { key: "20", value: "20 seconds" },
    { key: "30", value: "30 seconds" },
    { key: "40", value: "40 seconds" },
    { key: "50", value: "50 seconds" },
    { key: "60", value: "1 minute" },
    { key: "120", value: "2 minutes" },
    { key: "180", value: "3 minutes" },
    { key: "240", value: "4 minutes" },
    { key: "300", value: "5 minutes" },
  ]);
  const [selectedTime, setSelectedTime] = useState<
    DropdownData<string, string>
  >({
    key: "30",
    value: "10 seconds",
  });
  const [dataLength] = useState<DropdownData<string, string>[]>([
    { key: "10", value: "10 Quiz" },
    { key: "20", value: "20 Quiz" },
    { key: "30", value: "30 Quiz" },
    { key: "40", value: "40 Quiz" },
    { key: "50", value: "50 Quiz" },
  ]);
  const [selectedLength, setSelectedLength] = useState<
    DropdownData<string, string>
  >({
    key: "10",
    value: "10 Quiz",
  });
  const [subjectId, setSubjectId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const { data } = await axios.get(
          `/quiz/get-all/${selectedCategory.value}`
        );
        if (selectedCategory.value === "Topical") {
          const topicsData: any = data.data[0].topics.map((topic: any) => ({
            key: topic._id,
            value: topic.topic,
          }));
          setSubjectId(data.data[0]._id);
          setDataTopics(topicsData);
          setSelectedTopic({
            key: topicsData[0].key,
            value: topicsData[0].value,
          });
          setSelectedYear(null);
          setDataYears(null);
        } else {
          const yearData: any = data.data[0].years.map((year: any) => ({
            key: year._id,
            value: year.year,
          }));
          setSubjectId(data.data[0]._id);
          setDataYears(yearData);
          setSelectedYear({
            key: yearData[0].key,
            value: yearData[0].value,
          });
          setSelectedTopic(null);
          setDataTopics(null);
        }
      } catch (error: any) {
        console.log({ ...error });
      }
    };
    loadQuiz();
  }, [selectedCategory]);

  const handlePlay = async () => {
    if (
      !selectedSubject ||
      (!selectedTopic && !selectedYear) ||
      !selectedLength ||
      (!dataYears && !dataTopics) ||
      !selectedTime ||
      !subjectId
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
        subjectId: subjectId,
        yearIdOrTopicId: selectedTopic?.key || selectedYear?.key,
        quizLimit: Number(selectedLength.key),
        quizType: dataYears ? "Yearly" : "Topical",
        seconds: selectedTime.key,
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.loadingModal}>
            <View style={styles.loadingContent}>
              <ActivityIndicator color="white" size={40} />
              <Text style={styles.loadingText}>Please Wait...</Text>
            </View>
          </View>
        )}
        <View style={styles.contentContainer}>
          <BackButton />
          <View style={styles.optionsContainer}>
            <View style={styles.categoryContainer}>
              <SelectDropdown
                data={dataSubjects}
                placeholder={"Select Subject"}
                selected={selectedSubject}
                setSelected={setSelectedSubject}
                searchOptions={{ cursorColor: "transparent" }}
                searchBoxStyles={{ borderColor: "transparent" }}
                dropdownStyles={{
                  borderColor: "transparent",
                  backgroundColor: "#fff",
                  zIndex: 10,
                }}
              />
            </View>
            <View style={styles.categoryContainer}>
              <SelectDropdown
                data={dataCategory}
                placeholder={"Select Category"}
                selected={selectedCategory}
                setSelected={setSelectedCategory}
                searchOptions={{ cursorColor: "transparent" }}
                searchBoxStyles={{ borderColor: "transparent" }}
                dropdownStyles={{
                  borderColor: "transparent",
                  backgroundColor: "#fff",
                  zIndex: 8,
                }}
              />
            </View>
            {dataTopics && dataTopics.length > 0 && (
              <View style={styles.categoryContainer}>
                <SelectDropdown
                  data={dataTopics}
                  placeholder={"Select Topic"}
                  selected={selectedTopic}
                  setSelected={({ key, value }) => {
                    setSelectedTopic({ key, value });
                    setSelectedYear(null);
                  }}
                  searchOptions={{ cursorColor: "transparent" }}
                  searchBoxStyles={{ borderColor: "transparent" }}
                  dropdownStyles={{
                    borderColor: "transparent",
                    backgroundColor: "#fff",
                    zIndex: 8,
                  }}
                />
              </View>
            )}
            {dataYears && dataYears.length > 0 && (
              <View style={styles.categoryContainer}>
                <SelectDropdown
                  data={dataYears}
                  placeholder={"Select Year"}
                  selected={selectedYear}
                  setSelected={({ key, value }) => {
                    setSelectedYear({ key, value });
                    setSelectedTopic(null);
                  }}
                  searchOptions={{ cursorColor: "transparent" }}
                  searchBoxStyles={{ borderColor: "transparent" }}
                  dropdownStyles={{
                    borderColor: "transparent",
                    backgroundColor: "#fff",
                    zIndex: 8,
                  }}
                />
              </View>
            )}
            <View style={styles.categoryContainer}>
              <SelectDropdown
                data={dataTime}
                placeholder={"Select Time"}
                selected={selectedTime}
                setSelected={setSelectedTime}
                searchOptions={{ cursorColor: "transparent" }}
                searchBoxStyles={{ borderColor: "transparent" }}
                dropdownStyles={{
                  borderColor: "transparent",
                  backgroundColor: "#fff",
                  zIndex: 8,
                }}
              />
            </View>
            <View style={styles.categoryContainer}>
              <SelectDropdown
                data={dataLength}
                placeholder={"Select Limit"}
                selected={selectedLength}
                setSelected={setSelectedLength}
                searchOptions={{ cursorColor: "transparent" }}
                searchBoxStyles={{ borderColor: "transparent" }}
                dropdownStyles={{
                  borderColor: "transparent",
                  backgroundColor: "#fff",
                  zIndex: 8,
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={handlePlay}
            activeOpacity={0.7}
            style={styles.playButton}
          >
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Solo;

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
});
