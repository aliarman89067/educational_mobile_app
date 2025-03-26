import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { colors } from "@/constants/colors";

const BackButton = () => {
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Entypo name="chevron-left" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: colors.primary,
    width: 80,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
