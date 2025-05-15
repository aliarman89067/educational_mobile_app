import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import Navbar from "@/components/navbar";
import ScreenAssetsAnimation from "@/components/ScreenAssetsAnimation";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";

const Papers = () => {
  const buttonAnime1 = useRef(new Animated.Value(0)).current;

  const handleButton1Change = () => {
    Animated.timing(buttonAnime1, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease(10),
      useNativeDriver: true,
    }).start();
  };
  const buttonAnime1Inter = buttonAnime1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200],
  });

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 10, alignItems: "center" }}>
        <Navbar />
      </View>
      <View style={styles.contentContainer}>
        <ScreenAssetsAnimation />
        <View style={styles.buttonBox}>
          <TouchableOpacity
            onPress={handleButton1Change}
            activeOpacity={0.7}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Yearly</Text>
            <Animated.View
              style={[
                styles.buttonOverlay,
                { transform: [{ translateY: buttonAnime1Inter }] },
              ]}
            ></Animated.View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.button}>
            <Text style={styles.buttonText}>Topical</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Papers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  buttonBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  button: {
    position: "relative",
    backgroundColor: colors.purple,
    width: "100%",
    height: 70,
    borderRadius: 15,
    opacity: 0.9,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  buttonOverlay: {
    position: "absolute",
    width: "100%",
    height: 600,
    borderRadius: 1000,
    left: 0,
    top: 75,
    backgroundColor: "white",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontFamily: fontFamily.Bold,
    textAlign: "center",
  },
});
