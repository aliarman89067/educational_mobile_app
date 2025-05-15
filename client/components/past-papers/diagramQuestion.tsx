import {
  Animated,
  Dimensions,
  DimensionValue,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SketchCanvas } from "@sourcetoad/react-native-sketch-canvas";
import ViewShot, { captureRef } from "react-native-view-shot";
import { MiniCalculator } from "./MiniCalculator";
import { Image } from "react-native";
import { colors } from "@/constants/colors";
import {
  brush,
  calculator,
  chevronDown,
  close,
  pencil,
  redo,
  undo,
} from "@/constants/images";
import { fontFamily } from "@/constants/fonts";
import { useSketchCanvasStore } from "@/context/zustandStore";

interface DiagramQuestionProps {
  index: number;
  changeScroll: (value: boolean) => void;
  questionBeforeDiagram?: string;
  diagramSrc: any;
  questionAfterDiagram: string;
  scrollY: number;
  point1?: string;
  point2?: string;
  isPointOption1?: boolean;
  pointOption1Width?: DimensionValue;
  pointOption1Label?: string;
  isPointOption2?: boolean;
  pointOption2Width?: DimensionValue;
  pointOption2Label?: string;
  option1?: boolean;
  option1Label?: string;
  option1Width?: DimensionValue;
  diagramWidthPercentage?: DimensionValue;
}

const DiagramQuestion = ({
  index,
  changeScroll,
  questionBeforeDiagram,
  diagramSrc,
  questionAfterDiagram,
  scrollY,
  point1,
  point2,
  isPointOption1,
  pointOption1Width,
  pointOption1Label,
  isPointOption2,
  pointOption2Width,
  pointOption2Label,
  option1,
  option1Label,
  option1Width,
  diagramWidthPercentage,
}: DiagramQuestionProps) => {
  const RWanime = useRef(new Animated.Value(0)).current;
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [strokeColor, setStrokeColor] = useState("red");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [paths, setPaths] = useState<any[]>([]);
  const [imagePath, setImagePath] = useState("");
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const RNSketchRef = useRef<SketchCanvas>(null);
  const viewShotRef = useRef(null);

  const {
    start,
    status,
    data,
    end,
    index: sketchIndex,
  } = useSketchCanvasStore();

  const handleRWAnimeOpen = () => {
    changeScroll(false);
    console.log(paths);
    start({
      undoStackNodes: undoStack,
      redoStackNodes: redoStack,
      pathsNodes: paths,
      imagePathString: "",
      index,
    });
    // paths.forEach((path) => {
    //   RNSketchRef.current?.addPath(path);
    // });
    // Animated.timing(RWanime, {
    //   toValue: 1,
    //   duration: 300,
    //   easing: Easing.out(Easing.ease),
    //   useNativeDriver: false,
    // }).start();
  };

  useEffect(() => {
    if (status === "pending") {
      if (index.toString() === sketchIndex.toString()) {
        changeScroll(true);
        setImagePath(data.imagePathString);
        setPaths(data.pathsNodes);
        setUndoStack(data.undoStackNodes);
        setRedoStack(data.redoStackNodes);
        end();
      }
    }
  }, [status]);

  // const captureScreen = async () => {
  //   try {
  //     if (paths.length === 0 || !paths) return;
  //     const uri = await captureRef(viewShotRef, {
  //       format: "jpg",
  //       quality: 0.8,
  //     });
  //     setImagePath(uri);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleRWAnimeClose = () => {
  //   changeScroll(true);
  //   // RNSketchRef?.current?.clear();
  //   Animated.timing(RWanime, {
  //     toValue: 0,
  //     duration: 300,
  //     easing: Easing.out(Easing.ease),
  //     useNativeDriver: false,
  //   }).start();
  //   captureScreen();
  // };

  // const RWAnimeInter = RWanime.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["-100%", "0%"],
  // });

  const { width, height } = Dimensions.get("window");

  return (
    <>
      <View
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          // if (questionError && questionNumber === questionError.id) {
          //   viewRef.current?.scrollTo({ y, animated: true });
          // }
        }}
        style={{ flex: 1, width: "100%", height: "100%", position: "relative" }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            paddingHorizontal: 15,
            paddingTop: 15,
          }}
        >
          <View style={{ width: "100%", gap: 20 }}>
            {questionBeforeDiagram && (
              <View style={{ flexDirection: "row", gap: 7 }}>
                <Text
                  style={{
                    fontFamily: fontFamily.Bold,
                    color: colors.grayDark,
                    fontSize: 18,
                  }}
                >
                  1
                </Text>

                <Text
                  style={{
                    fontFamily: fontFamily.Medium,
                    color: colors.grayLight,
                    fontSize: 15,
                  }}
                >
                  {questionBeforeDiagram}
                </Text>
              </View>
            )}
            {diagramSrc && (
              <View style={{ gap: 2 }}>
                {!questionBeforeDiagram && (
                  <Text
                    style={{
                      fontFamily: fontFamily.Bold,
                      color: colors.grayDark,
                      fontSize: 18,
                    }}
                  >
                    1
                  </Text>
                )}
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={diagramSrc}
                    alt="Diagram"
                    resizeMode="contain"
                    style={{ width: diagramWidthPercentage }}
                  />
                </View>
              </View>
            )}
            {questionAfterDiagram && (
              <Text
                style={{
                  fontFamily: fontFamily.Medium,
                  color: colors.grayLight,
                  fontSize: 15,
                }}
              >
                {questionAfterDiagram}
              </Text>
            )}
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
              {imagePath ? (
                <Image
                  source={{ uri: imagePath }}
                  alt="Image"
                  resizeMode="contain"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Text
                  style={{
                    fontFamily: fontFamily.Bold,
                    fontSize: 20,
                    color: colors.grayLight,
                  }}
                >
                  R.W
                </Text>
              )}
            </TouchableOpacity>
            <View>
              {/* TODO */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: "auto",
                  marginTop: 40,
                  gap: 7,
                }}
              >
                {option1 && (
                  <>
                    <Text
                      style={{ fontFamily: fontFamily.Medium, fontSize: 13 }}
                    >
                      {option1Label}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        position: "relative",
                        borderStyle: "dashed",
                        borderColor: colors.grayLight,
                        borderWidth: 1,
                        width: option1Width,
                        marginVertical: 30,
                        marginLeft: "auto",
                      }}
                    >
                      <TextInput
                        //  value={answerValue1}
                        //  onChangeText={(value) =>
                        //    handleChangeText(value, "input1")
                        //  }
                        style={{
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          width: "100%",
                          fontFamily: fontFamily.Medium,
                          color: colors.grayLight,
                          fontSize: 15,
                        }}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
              {point1 && (
                <View
                  style={{
                    gap: 20,
                    width: "100%",
                    marginLeft: 25,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontFamily.Bold,
                        color: colors.grayDark,
                        fontSize: 18,
                      }}
                    >
                      (a)
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.Medium,
                        color: colors.grayLight,
                        fontSize: 15,
                        width: "90%",
                      }}
                    >
                      {point1}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: "auto",
                      marginTop: 20,
                      paddingRight: 30,
                      gap: 7,
                    }}
                  >
                    {isPointOption1 && (
                      <>
                        <Text
                          style={{
                            fontFamily: fontFamily.Medium,
                            fontSize: 13,
                          }}
                        >
                          {pointOption1Label}
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{
                            position: "relative",
                            borderStyle: "dashed",
                            borderColor: colors.grayLight,
                            borderWidth: 1,
                            width: pointOption1Width,
                          }}
                        >
                          <TextInput
                            //  value={answerValue1}
                            //  onChangeText={(value) =>
                            //    handleChangeText(value, "input1")
                            //  }
                            style={{
                              position: "absolute",
                              left: 0,
                              bottom: 0,
                              width: "100%",
                              fontFamily: fontFamily.Medium,
                              color: colors.grayLight,
                              fontSize: 15,
                            }}
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              )}
              {point2 && (
                <View
                  style={{
                    gap: 20,
                    width: "100%",
                    marginLeft: 25,
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontFamily.Bold,
                        color: colors.grayDark,
                        fontSize: 18,
                      }}
                    >
                      (a)
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.Medium,
                        color: colors.grayLight,
                        fontSize: 15,
                        width: "90%",
                      }}
                    >
                      {point2}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: "auto",
                      marginTop: 20,
                      paddingRight: 30,
                      gap: 7,
                    }}
                  >
                    {isPointOption2 && (
                      <>
                        <Text
                          style={{
                            fontFamily: fontFamily.Medium,
                            fontSize: 13,
                          }}
                        >
                          {pointOption2Label}
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{
                            position: "relative",
                            borderStyle: "dashed",
                            borderColor: colors.grayLight,
                            borderWidth: 1,
                            width: pointOption2Width,
                          }}
                        >
                          <TextInput
                            //  value={answerValue1}
                            //  onChangeText={(value) =>
                            //    handleChangeText(value, "input1")
                            //  }
                            style={{
                              position: "absolute",
                              left: 0,
                              bottom: 0,
                              width: "100%",
                              fontFamily: fontFamily.Medium,
                              color: colors.grayLight,
                              fontSize: 15,
                            }}
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: 2,
          backgroundColor: colors.grayLight,
        }}
      ></View>
    </>
  );
};

export default DiagramQuestion;

const styles = StyleSheet.create({});
