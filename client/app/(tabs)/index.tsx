import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Ad from "@/components/ad";
import GameHeaders from "@/components/GameHeaders";
import HomeFriends from "@/components/homeFriends";
import HomeHistory from "@/components/homeHistory";

const Home = () => {
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Ad />
        <GameHeaders />
        <HomeFriends />
        <HomeHistory />
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
