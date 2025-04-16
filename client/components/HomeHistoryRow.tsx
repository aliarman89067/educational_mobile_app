import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { historyRow } from "@/constants";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import CircleChart from "./CircleChart";
import { Shadow } from "react-native-shadow-2";

const HomeHistoryRow = () => {
  return (
    <View style={styles.container}>
      {historyRow.map((data, index) => (
        <Shadow distance={6} offset={[1, 1]} style={{ width: "100%" }}>
          <View key={index} style={styles.row}>
            <View style={styles.content}>
              <View style={{ marginBottom: 3 }}>
                {data.isOnline && (
                  <Text style={[styles.title, { color: data.statusColor }]}>
                    {data.isWin ? <>You Win</> : <>You Loose</>}
                  </Text>
                )}
                <Text style={styles.title}>{data.subject}</Text>
              </View>
              <View style={styles.flexRowCenter}>
                <Text style={styles.subTitle}>
                  {data.type === "topical" ? <>Topic</> : <>Year</>}
                </Text>
                <Text style={styles.subTitle}>
                  {data.type === "topical" ? (
                    <>{data.topicName}</>
                  ) : (
                    <>{data.year}</>
                  )}
                </Text>
              </View>
              <Text style={styles.subTitle}>{data.date}</Text>
            </View>
            <CircleChart
              size={80}
              percentage={data.performace}
              strokeWidth={6}
            />
          </View>
        </Shadow>
      ))}
    </View>
  );
};

export default HomeHistoryRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 7,
    backgroundColor: "white",
  },
  content: {
    gap: 2,
  },
  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  title: {
    color: colors.grayDark,
    fontFamily: fontFamily.Regular,
    fontSize: 16,
  },
  subTitle: {
    color: colors.grayLight,
    fontFamily: fontFamily.Regular,
    fontSize: 14,
  },
});
