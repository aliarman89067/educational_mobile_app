import { history } from "@/constants";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import CircleChart from "./CircleChart";
import HomeHistoryStatistics from "./homeHistoryStatistics";
import HomeHistoryRow from "./HomeHistoryRow";

const HomeHistory = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>History</Text>
      <View style={styles.contentContainer}>
        <View style={styles.historyCardsContainer}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Image
                source={history[0].icon}
                alt="Solo History Icon"
                style={styles.cardIconImg}
              />
              <Text style={styles.cardTitle}>{history[0].title}</Text>
              <Text style={styles.cardMatches}>
                {history[0].matches} Matches
              </Text>
              <View style={styles.separatorLine}></View>
              <Text style={styles.cardPerformance}>Performance</Text>
              <CircleChart
                percentage={history[0].performance}
                size={70}
                strokeWidth={5}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center",
              flex: 1,
              gap: 10,
              width: "100%",
            }}
          >
            {history.slice(1, 3).map((data, index) => (
              <View key={index} style={[styles.card, { width: 160 }]}>
                <View style={styles.cardContent}>
                  <Image
                    source={data.icon}
                    alt="Solo History Icon"
                    style={styles.cardIconImg}
                  />
                  <Text style={styles.cardTitle}>{data.title}</Text>
                  <Text style={styles.cardMatches}>{data.matches} Matches</Text>
                  <View style={styles.separatorLine}></View>
                  <Text style={styles.cardPerformance}>Performance</Text>
                  <CircleChart
                    percentage={data.performance}
                    size={70}
                    strokeWidth={5}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
        <HomeHistoryStatistics />
        <HomeHistoryRow />
      </View>
    </View>
  );
};

export default HomeHistory;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 30,
  },
  heading: {
    fontSize: 18,
    fontFamily: fontFamily.Medium,
    color: colors.grayDark,
  },
  contentContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
    marginTop: 10,
  },
  historyCardsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  card: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    gap: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconImg: {
    width: 55,
    height: 55,
    borderRadius: 200,
    textAlign: "center",
    resizeMode: "contain",
  },
  cardTitle: {
    color: colors.grayDark,
    fontSize: 17,
    fontFamily: fontFamily.Medium,
  },
  cardMatches: {
    color: colors.grayLight,
    fontSize: 14,
    fontFamily: fontFamily.Regular,
  },
  cardPerformance: {
    color: colors.grayLight,
    fontSize: 13,
    fontFamily: fontFamily.Regular,
  },
  separatorLine: {
    width: 70,
    height: 1,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    marginVertical: 2,
  },
});
