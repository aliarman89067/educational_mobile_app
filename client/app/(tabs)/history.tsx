import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { router, usePathname } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";

type DataType = {
  soloQuizes: {
    roomId: string;
    subjectId: string;
    subjectName: string;
    topicId?: string;
    topicName?: string;
    yearId?: string;
    yearName?: string;
    date: string;
    quizType: "Topical" | "Yearly";
  }[];
  onlineQuizes: {
    roomId: string;
    subjectId: string;
    subjectName: string;
    topicId?: string;
    topicName?: string;
    yearId?: string;
    yearName?: string;
    date: string;
    quizType: "Topical" | "Yearly";
    resignation: string;
  }[];
};

const History = () => {
  const [data, setData] = useState<DataType | null>(null);

  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user || !user.id) return;

    const loadHistory = async () => {
      try {
        const { data: historyData } = await axios.get(
          `/history/all/${user.id}`
        );
        setData(historyData);
      } catch (error) {
        console.log(error);
        router.push("/(tabs)");
      }
    };
    loadHistory();
  }, [router, pathname, user, isLoaded]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <Navbar />
      </View>
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
