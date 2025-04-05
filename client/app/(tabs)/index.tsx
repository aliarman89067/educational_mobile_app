import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import {
  joinQuizImage,
  joinQuizSideImage,
  onlineQuizImage,
  onlineQuizSideImage,
  soloQuizImage,
  soloQuizSideImage,
} from "@/constants/images";
import { router } from "expo-router";
import Navbar from "@/components/navbar";

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <Navbar />
        <ScrollView>
          <View style={styles.bodyContainer}>
            <Text style={styles.playText}>Let&apos;s Play</Text>
            <View style={styles.contentContainer}>
              <LinearGradient
                style={styles.box}
                colors={["#ff4d6d", "#ff758f"]}
                start={{ x: 0, y: 0 }}
              >
                <View style={styles.boxContent}>
                  <Text style={styles.boxTitle}>Online Quiz</Text>
                  <View style={styles.boxImageContainer}>
                    <Image
                      source={onlineQuizImage}
                      alt="Online quiz image"
                      style={styles.boxImage}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(routes)/makeQuiz",
                        params: { isOnline: "true" },
                      })
                    }
                    style={styles.boxPlayButton}
                  >
                    <Text style={styles.boxPlayText}>Play</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={onlineQuizSideImage}
                  alt="Parachut Image"
                  style={styles.boxSideImage}
                />
              </LinearGradient>
              <LinearGradient
                style={styles.box}
                colors={["#0096c7", "#12c0d8"]}
                start={{ x: 0, y: 0 }}
              >
                <View style={styles.boxContent}>
                  <Text style={styles.boxTitle}>Solo Quiz</Text>
                  <View style={styles.boxImageContainer}>
                    <Image
                      source={soloQuizImage}
                      alt="Solo quiz image"
                      style={styles.boxImage}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(routes)/makeQuiz",
                        params: { isOnline: "false" },
                      })
                    }
                    style={styles.boxPlayButton}
                  >
                    <Text style={styles.boxPlayText}>Play</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={soloQuizSideImage}
                  alt="Joystick Image"
                  style={styles.boxSideImage}
                />
              </LinearGradient>
              <LinearGradient
                style={styles.box}
                colors={["#9d4edd", "#c77dff"]}
                start={{ x: 0, y: 0 }}
              >
                <View style={styles.boxContent}>
                  <Text style={styles.boxTitle}>Join Friend</Text>
                  <View style={styles.boxImageContainer}>
                    <Image
                      source={joinQuizImage}
                      alt="Solo quiz image"
                      style={styles.boxImage}
                    />
                  </View>
                  <TouchableOpacity style={styles.boxPlayButton}>
                    <Text style={styles.boxPlayText}>Play</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={joinQuizSideImage}
                  alt="Join Game Image"
                  style={styles.boxSideImage}
                />
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bodyContainer: {
    gap: 5,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  contentContainer: {
    gap: 30,
    width: "100%",
    height: "100%",
    flex: 1,
    marginTop: 20,
  },
  playText: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fontFamily.Bold,
  },
  box: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  boxContent: {
    gap: 4,
  },
  boxTitle: {
    color: "#fff",
    fontFamily: fontFamily.Bold,
    fontSize: 16,
  },
  boxImageContainer: {
    height: 50,
    width: 100,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  boxImage: {
    height: 50,
    width: 80,
    resizeMode: "contain",
  },
  boxPlayButton: {
    paddingVertical: 15,
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  boxPlayText: {
    color: "#333",
    fontSize: 16,
    fontFamily: fontFamily.Medium,
  },
  boxSideImage: {
    width: "50%",
    resizeMode: "contain",
    transform: [{ translateY: -20 }],
  },
});
