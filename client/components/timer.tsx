import { StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";

interface Props {
  seconds: string | undefined;
  time: { hours: number; minutes: number; seconds: number };
  setTime: Dispatch<
    SetStateAction<{ hours: number; minutes: number; seconds: number }>
  >;
  setIsTimeout: Dispatch<SetStateAction<boolean>>;
}

const Timer = ({ seconds, time, setTime, setIsTimeout }: Props) => {
  let id: any;
  useEffect(() => {
    if (seconds === "no-limit") {
      id = setInterval(() => {
        handleNormalTimer();
      }, 1000);
    } else {
      let totalSeconds = Number(seconds);
      id = setInterval(() => {
        totalSeconds--;
        handleLimitTimer(totalSeconds);
      }, 1000);
    }
    return () => clearInterval(id);
  }, [seconds]);

  const handleLimitTimer = (seconds: number) => {
    if (seconds >= 0) {
      let hours = Math.floor(seconds / 3600);
      seconds %= 3600;
      let minutes = Math.floor(seconds / 60);
      seconds %= 60;
      let remainingSeconds = seconds;
      setTime({ hours, minutes, seconds: remainingSeconds });
    } else {
      setIsTimeout(true);
      clearTimeout(id);
    }
  };

  const handleNormalTimer = () => {
    setTime((prevTime) => {
      let { hours, minutes, seconds } = prevTime;
      seconds += 1;

      if (seconds === 60) {
        seconds = 0;
        minutes += 1;
      }

      if (minutes === 60) {
        minutes = 0;
        hours += 1;
      }

      return { hours, minutes, seconds };
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {time.hours}:{time.minutes}:{time.seconds}
      </Text>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  timerText: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fontFamily.Medium,
  },
});
