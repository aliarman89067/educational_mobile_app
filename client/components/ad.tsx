import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors } from "@/constants/colors";
import { bag, close } from "@/constants/images";
import { fontFamily } from "@/constants/fonts";

const Ad = () => {
  const [showAd, setShowAd] = useState(true);
  return (
    <>
      {showAd && (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setShowAd(false)}
            activeOpacity={0.7}
            style={styles.closeBox}
          >
            <Image source={close} alt="Close Icon" style={styles.closeImg} />
          </TouchableOpacity>
          <Image source={bag} alt="Bag Image" style={styles.bagImg} />
          <View>
            <Text style={styles.title}>Try Premium</Text>
            <Text style={styles.titleSubtitle}>Play your best chess!</Text>
          </View>
        </View>
      )}
    </>
  );
};

export default Ad;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginVertical: 25,
    position: "relative",
    paddingVertical: 16,
  },
  closeBox: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.grayLight,
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  closeImg: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  bagImg: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontFamily: fontFamily.Medium,
    color: "white",
  },
  titleSubtitle: {
    fontSize: 16,
    fontFamily: fontFamily.light,
    color: "white",
  },
});
