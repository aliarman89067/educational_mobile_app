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
import Ad from "@/components/ad";
import GameHeaders from "@/components/GameHeaders";
import HomeFriends from "@/components/homeFriends";

const Home = () => {
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Ad />
        <GameHeaders />
        <HomeFriends />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
});
