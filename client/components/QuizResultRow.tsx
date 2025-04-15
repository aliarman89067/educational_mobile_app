import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

interface Props {
  item: {
    _id: string;
    mcq: string;
    selected: string;
    options: {
      text: string;
      isCorrect: boolean;
      _id: string;
    }[];
  };
  index: number;
}

const QuizResultRow = ({ index, item }: Props) => {
  //States
  const [isOptionShow, setIsOptionShow] = useState(false);

  const handleChangeOption = () => {
    setIsOptionShow(!isOptionShow);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleChangeOption}
        activeOpacity={0.5}
        style={styles.optionTriggerContainer}
      >
        <View style={styles.textContainer}>
          <Text style={styles.mcqText} numberOfLines={2} ellipsizeMode="tail">
            {index + 1}
            {")"} {item.mcq}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Entypo
            name="chevron-down"
            size={18}
            color="white"
            style={{
              transform: [{ rotate: isOptionShow ? "180deg" : "0deg" }],
            }}
          />
        </View>
      </TouchableOpacity>

      <View
        style={[
          styles.optionsContainer,
          {
            height: isOptionShow ? "auto" : 0,
            marginTop: isOptionShow ? 20 : 0,
          },
        ]}
      >
        {item.options.map((option) => (
          <View key={option._id} style={styles.optionContainer}>
            <View>
              <Text style={styles.optionText}>{option.text}</Text>
              {item.selected === option._id && (
                <Text style={styles.selectedText}>You selected.</Text>
              )}
            </View>

            <View
              style={[
                styles.statusBox,
                { backgroundColor: option.isCorrect ? "#22c55e" : "#ef4444" },
              ]}
            >
              <AntDesign name="close" size={16} color="white" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default QuizResultRow;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 18,
    borderRadius: 5,
    backgroundColor: colors.grayDark,
  },
  optionTriggerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  mcqText: {
    color: "white",
    fontSize: 14,
  },
  iconContainer: {
    width: 24, // Fixed width for icon container
    alignItems: "center",
    justifyContent: "center",
  },
  optionsContainer: {
    gap: 8,
    width: "100%",
    overflow: "hidden",
  },
  optionContainer: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    fontFamily: fontFamily.Medium,
    color: colors.grayDark,
    fontSize: 15,
  },
  selectedText: {
    fontFamily: fontFamily.Regular,
    color: colors.grayDark,
    fontSize: 12,
  },
  statusBox: {
    width: 22,
    height: 22,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
});
