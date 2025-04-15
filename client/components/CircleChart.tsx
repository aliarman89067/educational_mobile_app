import { colors } from "@/constants/colors";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircleChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const CircleChart: React.FC<CircleChartProps> = ({
  percentage,
  size = 150,
  strokeWidth = 15,
}) => {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Calculate the radius and circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (normalizedPercentage / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Percentage text in center */}
      <View style={styles.textContainer}>
        <Text style={[styles.text, { fontSize: size * 0.25 }]}>
          {normalizedPercentage}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.grayDark,
    fontWeight: "bold",
  },
});

export default CircleChart;
