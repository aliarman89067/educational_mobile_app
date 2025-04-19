import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import { chevronDown } from "@/constants/images";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";

interface SelectInputProps {
  data: { id: string; value: string }[] | null;
  setSelectedState: Dispatch<
    SetStateAction<{ id: string; value: string } | null>
  >;
  selectedState: { id: string; value: string } | null;
  setCurrentSelect: Dispatch<
    SetStateAction<
      "subject" | "category" | "topic" | "year" | "time" | "length" | null
    >
  >;
  currentSelect:
    | "subject"
    | "category"
    | "topic"
    | "year"
    | "time"
    | "length"
    | null;
  category: "subject" | "category" | "topic" | "year" | "time" | "length";
}

const SelectInput = ({
  data,
  setSelectedState,
  selectedState,
  currentSelect,
  setCurrentSelect,
  category,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const heightAnime = useRef(new Animated.Value(0)).current;
  const chevronAnime = useRef(new Animated.Value(0)).current;

  const handleHeight = () => {
    Animated.parallel([
      Animated.timing(heightAnime, {
        duration: 200,
        toValue: isOpen ? 0 : 1,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(chevronAnime, {
        duration: 200,
        toValue: isOpen ? 0 : 1,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
    setIsOpen(!isOpen);
  };
  const handleCloseHeight = () => {
    Animated.parallel([
      Animated.timing(heightAnime, {
        duration: 200,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(chevronAnime, {
        duration: 200,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
    setIsOpen(false);
  };

  const heightAnimeInter = heightAnime.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });
  const chevronAnimeInter = chevronAnime.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handlePress = () => {
    handleHeight();
    setCurrentSelect(category);
  };

  const handleSelect = ({ id, value }: { id: string; value: string }) => {
    setSelectedState({ id, value });
    handleHeight();
  };

  useEffect(() => {
    if (currentSelect) {
      if (currentSelect !== category) {
        handleCloseHeight();
      }
    }
  }, [currentSelect]);

  return (
    <View style={styles.input}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.targetButton}
      >
        <Text style={styles.selectedText}>
          {selectedState ? selectedState.value : ""}
        </Text>
        <Animated.Image
          source={chevronDown}
          alt="Chevron Down"
          style={[
            styles.chevronDownImg,
            { transform: [{ rotate: chevronAnimeInter }] },
          ]}
        />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.optionsContainer,
          {
            height: heightAnimeInter,
            padding: isOpen ? 5 : 0,
            borderColor: isOpen ? colors.purple : "transparent",
          },
        ]}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 15 }} />}
          keyExtractor={(item) => item.id.toString()}
          data={data ?? []}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect({ id: item.id, value: item.value })}
              activeOpacity={0.7}
              style={styles.option}
            >
              <Text>{item.value}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
      </Animated.View>
    </View>
  );
};

export default SelectInput;

const styles = StyleSheet.create({
  input: {
    position: "relative",
    width: "100%",
    height: 45,
    borderWidth: 2,
    borderColor: colors.purple,
    borderStyle: "solid",
    borderRadius: 5,
    backgroundColor: "white",
  },
  targetButton: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedText: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: colors.grayLight,
    marginHorizontal: 10,
  },
  optionsContainer: {
    position: "absolute",
    top: 45,
    left: 0,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: "solid",
    overflow: "hidden",
    gap: 4,
    zIndex: 100,
  },
  option: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 6,
    borderStyle: "solid",
    flexDirection: "row",
    alignItems: "center",
  },
  chevronDownImg: {
    width: 15,
    height: 15,
    resizeMode: "contain",
    marginRight: 10,
  },
});
