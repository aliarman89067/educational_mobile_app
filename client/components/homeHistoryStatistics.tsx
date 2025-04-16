import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import { historyStatistics } from "@/constants";
import CircleChart from "./CircleChart";

const HomeHistoryStatistics = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let&apos;s look at overall statistics</Text>
      <View style={styles.gridContainer}>
        {historyStatistics.map((data, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.subjectText}>{data.subject}</Text>
            <CircleChart
              percentage={data.performance}
              size={50}
              strokeWidth={5}
            />
            <Text style={[styles.statusText, { color: data.statusColor }]}>
              {data.status}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HomeHistoryStatistics;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginVertical: 20,
    width: "100%",
  },
  title: {
    color: colors.grayLight,
    fontFamily: fontFamily.Regular,
    fontSize: 17,
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "white",
    paddingVertical: 10,
    width: 100,
    borderRadius: 10,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  subjectText: {
    color: colors.grayLight,
    fontSize: 16,
    fontFamily: fontFamily.Regular,
  },
  statusText: {
    fontSize: 13,
    fontFamily: fontFamily.Medium,
  },
});
