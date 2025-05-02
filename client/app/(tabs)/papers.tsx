import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import {
  brush,
  chevronDown,
  close,
  pencil,
  redo,
  undo,
} from "@/constants/images";
import { SketchCanvas } from "@sourcetoad/react-native-sketch-canvas";

const Papers = () => {
  const RWanime = useRef(new Animated.Value(0)).current;
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [strokeColor, setStrokeColor] = useState("red");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  const RNSketchRef = useRef<SketchCanvas>(null);

  const handleRWAnimeOpen = () => {
    Animated.timing(RWanime, {
      toValue: 1,
      duration: 300, // Slightly longer duration
      easing: Easing.out(Easing.ease), // Smoother easing
      useNativeDriver: false, // Try with native driver
    }).start();
  };

  const handleRWAnimeClose = () => {
    Animated.timing(RWanime, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const RWAnimeInter = RWanime.interpolate({
    inputRange: [0, 1],
    outputRange: ["-100%", "0%"],
  });

  // Called when user finishes a stroke
  const handleStrokeEnd = (path: any) => {
    setUndoStack((prev) => [...prev, path]);
    setRedoStack([]); // Clear redo when a new stroke is added
  };

  // Undo
  const handleUndo = () => {
    if (!RNSketchRef.current || undoStack.length === 0) return;
    const newUndoStack = [...undoStack];
    const lastPath = newUndoStack.pop();
    setUndoStack(newUndoStack);
    setRedoStack((prev) => [...prev, lastPath]);
    RNSketchRef.current?.undo();
  };

  // Redo
  const handleRedo = () => {
    if (!RNSketchRef.current || redoStack.length === 0) return;
    const newRedoStack = [...redoStack];
    const pathToRedo = newRedoStack.pop();
    setRedoStack(newRedoStack);
    setUndoStack((prev) => [...prev, pathToRedo]);

    // Redraw the stroke manually
    RNSketchRef.current?.addPath(pathToRedo);
  };

  return (
    <View
      style={{ flex: 1, width: "100%", height: "100%", position: "relative" }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: RWAnimeInter,
          backgroundColor: "white",
          zIndex: 10,
          // Add these to ensure smooth animation:
          overflow: "hidden",
          transform: [
            {
              translateX: RWanime.interpolate({
                inputRange: [0, 1],
                outputRange: [-Dimensions.get("window").width, 0],
              }),
            },
          ],
        }}
      >
        {/* Header */}
        <View style={{ gap: 20, paddingHorizontal: 20, paddingVertical: 10 }}>
          <TouchableOpacity onPress={handleRWAnimeClose} activeOpacity={0.7}>
            <Image
              source={close}
              alt="Close"
              resizeMode="contain"
              tintColor={colors.grayLight}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          {/* Question */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text
              style={{
                fontFamily: fontFamily.Bold,
                color: colors.grayDark,
                fontSize: 18,
              }}
            >
              1
            </Text>
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontFamily: fontFamily.Medium,
                  color: colors.grayLight,
                  fontSize: 15,
                }}
              >
                Jacob is 10 years 8 months old. Amy is 15 months younger than
                Jacob.
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.Medium,
                  color: colors.grayLight,
                  fontSize: 15,
                }}
              >
                Find how old Amy is.
              </Text>
            </View>
          </View>
          {/* Tools */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignContent: "center", gap: 15 }}
            >
              {/* Colors */}
              <View style={{ flexDirection: "column", gap: 5 }}>
                <TouchableOpacity
                  onPress={() => setIsColorOpen(!isColorOpen)}
                  activeOpacity={0.7}
                  style={{
                    position: "relative",
                    width: 53,
                    height: 40,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 3,
                    borderRadius: 5,
                    borderStyle: "solid",
                    borderColor: colors.grayLight,
                    borderWidth: 1,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 5,
                      backgroundColor: strokeColor,
                    }}
                  ></View>
                  <Image
                    source={chevronDown}
                    alt="Chevron Down"
                    resizeMode="contain"
                    style={{ width: 10, height: 10 }}
                  />
                </TouchableOpacity>
                {isColorOpen && (
                  <View
                    style={{
                      position: "relative",
                      width: 53,
                      backgroundColor: "white",
                      alignItems: "center",
                      paddingVertical: 10,
                      borderRadius: 5,
                      elevation: 5,
                      gap: 10,
                      zIndex: 100,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setStrokeColor("red");
                        setIsColorOpen(false);
                      }}
                      activeOpacity={0.7}
                      style={{
                        position: "relative",
                        zIndex: 100,
                        width: 32,
                        height: 32,
                        borderRadius: 5,
                        backgroundColor: "red",
                      }}
                    ></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setStrokeColor("yellow");
                        setIsColorOpen(false);
                      }}
                      activeOpacity={0.7}
                      style={{
                        position: "relative",
                        zIndex: 100,
                        width: 32,
                        height: 32,
                        borderRadius: 5,
                        backgroundColor: "yellow",
                      }}
                    ></TouchableOpacity>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={() => setStrokeWidth(4)}
                activeOpacity={0.7}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                  borderStyle: "solid",
                  borderColor: colors.grayLight,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    strokeWidth === 4 ? colors.grayLight : "white",
                }}
              >
                <Image
                  source={pencil}
                  alt="Pencil"
                  resizeMode="contain"
                  tintColor={strokeWidth === 4 ? "white" : colors.purple}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStrokeWidth(8)}
                activeOpacity={0.7}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                  borderStyle: "solid",
                  borderColor: colors.grayLight,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    strokeWidth === 8 ? colors.grayLight : "white",
                }}
              >
                <Image
                  source={brush}
                  alt="Brush"
                  resizeMode="contain"
                  tintColor={strokeWidth === 8 ? "white" : colors.purple}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{ flexDirection: "row", alignContent: "center", gap: 15 }}
            >
              <TouchableOpacity
                onPress={handleUndo}
                activeOpacity={0.7}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                  borderStyle: "solid",
                  borderColor: colors.grayLight,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={undo}
                  alt="Undo"
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRedo}
                activeOpacity={0.7}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                  borderStyle: "solid",
                  borderColor: colors.grayLight,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={redo}
                  alt="Redo"
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, zIndex: 0 }}>
          <SketchCanvas
            style={{ flex: 1 }}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            ref={RNSketchRef}
            onStrokeEnd={handleStrokeEnd}
          />
        </View>
      </Animated.View>
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          paddingHorizontal: 15,
          paddingTop: 15,
        }}
      >
        {/* Question 1 */}
        <View style={{ width: "100%", gap: 20 }}>
          {/* Question */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text
              style={{
                fontFamily: fontFamily.Bold,
                color: colors.grayDark,
                fontSize: 18,
              }}
            >
              1
            </Text>
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontFamily: fontFamily.Medium,
                  color: colors.grayLight,
                  fontSize: 15,
                }}
              >
                Jacob is 10 years 8 months old. Amy is 15 months younger than
                Jacob.
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.Medium,
                  color: colors.grayLight,
                  fontSize: 15,
                }}
              >
                Find how old Amy is.
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={handleRWAnimeOpen}
              activeOpacity={0.7}
              style={{
                width: "50%",
                height: 120,
                borderRadius: 10,
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: colors.grayLight,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.Bold,
                  fontSize: 20,
                  color: colors.grayLight,
                }}
              >
                R.W
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: "auto",
                marginVertical: 35,
                gap: 7,
              }}
            >
              <View
                style={{
                  borderStyle: "dashed",
                  borderColor: colors.grayLight,
                  borderWidth: 1,
                  width: "30%",
                }}
              ></View>
              <Text style={{ fontFamily: fontFamily.Medium, fontSize: 13 }}>
                Years
              </Text>
              <View
                style={{
                  borderStyle: "dashed",
                  borderColor: colors.grayLight,
                  borderWidth: 1,
                  width: "30%",
                }}
              ></View>
              <Text style={{ fontFamily: fontFamily.Medium, fontSize: 13 }}>
                Months
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{ width: "100%", height: 20, backgroundColor: colors.grayDark }}
      ></View>
    </View>
  );
};

export default Papers;

const styles = StyleSheet.create({});
