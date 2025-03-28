import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const SoloResult = () => {
  const { historyId } = useLocalSearchParams();
  return (
    <View>
      <Text>{historyId}</Text>
    </View>
  );
};

export default SoloResult;

const styles = StyleSheet.create({});
