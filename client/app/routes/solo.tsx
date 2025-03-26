import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import BackButton from "@/components/backButton";
import { SelectDropdown, DropdownData } from "expo-select-dropdown";
import axios from "axios";

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
  > | null>({
    key: "2",
    value: "Math",
  });
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

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const { data } = await axios.get(
          `/quiz/get-all/${selectedCategory.value}`
        );
        console.log("Data", data);
      } catch (error: any) {
        console.log({ ...error });
      }
    };
    loadQuiz();
  }, [selectedCategory]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Solo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 10,
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
});
