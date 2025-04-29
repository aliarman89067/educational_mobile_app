import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";

interface Props {
  time: number;
  isStart: boolean;
  fn?: () => void;
}

const FindingTimer = ({ time, isStart, fn }: Props) => {
  const translateAnime = useRef(new Animated.Value(-time * 50)).current;
  const [elapsedTime, setElapsedTime] = useState(time);
  const interval = useRef<any>(null);

  useEffect(() => {
    if (isStart) {
      interval.current = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev <= time && prev > 0) {
            animateTimer(prev - 1);
            return prev - 1;
          }
          clearInterval(interval.current);
          if (fn) {
            fn();
          }
          return prev;
        });
      }, 1000);
    }

    return () => clearInterval(interval.current);
  }, [isStart]);

  const animateTimer = (newTime: number) => {
    Animated.timing(translateAnime, {
      toValue: newTime * -50,
      duration: 300,
      delay: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View style={styles.numberContainer}>
        <Animated.View style={{ transform: [{ translateY: translateAnime }] }}>
          {Array.from({ length: time + 1 }).map((_, index) => (
            <View key={index} style={styles.numberItem}>
              <Text style={styles.numberText}>{index}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

export default FindingTimer;

const styles = StyleSheet.create({
  numberContainer: {
    position: "absolute",
    bottom: 10,
    width: 50,
    height: 50,
    overflow: "hidden",
  },
  numberItem: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: colors.grayDark,
    fontFamily: fontFamily.Bold,
    fontSize: 40,
  },
});
