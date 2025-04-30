import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const FriendResult = () => {
  const { friendResultId, roomId } = useLocalSearchParams();
  return (
    <View>
      <Text>{friendResultId}</Text>
      <Text>{roomId}</Text>
    </View>
  );
};

export default FriendResult;

const styles = StyleSheet.create({});
