import {
  Animated,
  Dimensions,
  DimensionValue,
  Easing,
  Image,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import {
  brush,
  calculator,
  chevronDown,
  close,
  pencil,
  redo,
  undo,
} from "@/constants/images";
import { SketchCanvas } from "@sourcetoad/react-native-sketch-canvas";
import ViewShot, { captureRef } from "react-native-view-shot";
import { MiniCalculator } from "./MiniCalculator";

interface TextQuestionProps {
  changeScroll: (value: boolean) => void;
  scrollY: number;
  questionNumber: number;
  questionPart1?: string;
  questionPart2?: string;
  questionPart3?: string;
  questionPart4?: string;
  questionPart5?: string;
  isDiagram?: boolean;
  diagram?: any;
  isOption1?: boolean;
  option1Width?: DimensionValue;
  option1Label?: string;
  isOption2?: boolean;
  option2Width?: DimensionValue;
  option2Label?: string;
  correctAns1: any;
  correctAns2?: any;
  doubleSideOption1?: {
    leftSide: {
      isUpon: boolean;
      firstValue: string;
      secondValue: string;
    };
    optionWidth: DimensionValue;
    correctAns: string;
    rightSide: {
      isUpon: boolean;
      firstValue: string;
      secondValue: string;
    };
  };
  doubleSideOption2?: {
    leftSide: {
      isUpon: boolean;
      firstValue: string;
      secondValue: string;
    };
    optionWidth: DimensionValue;
    correctAns: string;
    rightSide: {
      isUpon: boolean;
      firstValue: string;
      secondValue: string;
    };
  };
  doubleSideOption3?: {
    leftSide: {
      isUpon: boolean;
      firstValue: string;
      secondValue: string;
    };
    optionWidth: DimensionValue;
    correctAns: string;
    rightSide: {
      isUpon: boolean;
      firstValue: string;
      secondValue: string;
    };
  };
  setStates: Dispatch<
    SetStateAction<
      | null
      | {
          id: number;
          input1: string;
          input2: string | undefined;
          correct1: string;
          correct2: string | undefined;
        }[]
    >
  >;
  questionError: null | {
    id: number;
    message: string;
  };
  setQuestionError: Dispatch<
    SetStateAction<null | {
      id: number;
      message: string;
    }>
  >;
  viewRef: RefObject<ScrollView>;
}

const TextQuestion = ({
  changeScroll,
  scrollY,
  questionNumber,
  questionPart1,
  questionPart2,
  questionPart3,
  questionPart4,
  questionPart5,
  isDiagram,
  diagram,
  isOption1,
  option1Width,
  option1Label,
  isOption2,
  option2Width,
  option2Label,
  correctAns1,
  correctAns2,
  setStates,
  questionError,
  setQuestionError,
  viewRef,
  doubleSideOption1,
  doubleSideOption2,
  doubleSideOption3,
}: TextQuestionProps) => {
  const RWanime = useRef(new Animated.Value(0)).current;
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [strokeColor, setStrokeColor] = useState("red");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [paths, setPaths] = useState<any[]>([]);
  const [imagePath, setImagePath] = useState("");
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [answerValue1, setAnswerValue1] = useState("");
  const [answerValue2, setAnswerValue2] = useState("");
  const [result1, setResult1] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [result2, setResult2] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const RNSketchRef = useRef<SketchCanvas>(null);
  const viewShotRef = useRef(null);

  const handleRWAnimeOpen = () => {
    changeScroll(false);
    paths.forEach((path) => {
      RNSketchRef.current?.addPath(path);
    });
    Animated.timing(RWanime, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const captureScreen = async () => {
    try {
      if (paths.length === 0 || !paths) return;
      const uri = await captureRef(viewShotRef, {
        format: "jpg",
        quality: 0.8,
      });
      setImagePath(uri);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRWAnimeClose = () => {
    changeScroll(true);
    // RNSketchRef?.current?.clear();
    Animated.timing(RWanime, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
    captureScreen();
  };

  const RWAnimeInter = RWanime.interpolate({
    inputRange: [0, 1],
    outputRange: ["-100%", "0%"],
  });

  // Called when user finishes a stroke
  const handleStrokeEnd = (path: any) => {
    setPaths([...paths, path]);
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

    const updatedPaths = [...paths].filter((p) => p.path !== lastPath.path);
    setPaths(updatedPaths);

    RNSketchRef.current?.clear();
    updatedPaths.forEach((path) => {
      RNSketchRef.current?.addPath(path);
    });
  };

  // Redo
  const handleRedo = () => {
    if (!RNSketchRef.current || redoStack.length === 0) return;

    const newRedoStack = [...redoStack];
    const pathToRedo = newRedoStack.pop();
    setRedoStack(newRedoStack);
    setUndoStack((prev) => [...prev, pathToRedo]);

    const updatedPaths = [...paths, pathToRedo];
    setPaths(updatedPaths);

    RNSketchRef.current?.addPath(pathToRedo);
  };
  const { width, height } = Dimensions.get("window");

  const handleSubmit = () => {
    let isAnswer1IsCorrect = false;
    setQuestionError(null);
    if (answerValue1) {
      const isNumber = Number(correctAns1);
      if (isNumber) {
        const isFloat = Number(correctAns1) % 1 !== 0;
        if (isFloat) {
          const correctAnsInNumber = Number(correctAns1);
          const correctInputInNumber = Number(answerValue1);
          isAnswer1IsCorrect =
            Math.trunc(correctAnsInNumber) == Math.trunc(correctInputInNumber);
        } else {
          isAnswer1IsCorrect = correctAns1 == answerValue1;
        }
      } else {
        isAnswer1IsCorrect = correctAns1 == answerValue1;
      }
    }
    if (correctAns1 && !correctAns2) {
      if (isAnswer1IsCorrect) {
        setResult1({
          success: true,
          message: `Your answer is correct`,
        });
      } else {
        setResult1({
          success: false,
          message: `Your answer is wrong \n correct answer is ${correctAns1}`,
        });
      }
    } else if (correctAns1 && correctAns2) {
      if (!isAnswer1IsCorrect && answerValue2 == correctAns2) {
        setResult1({
          success: false,
          message: `Your answer is wrong \n correct answer is ${correctAns1}`,
        });
        setResult2({
          success: true,
          message: `Your answer is correct`,
        });
      } else if (isAnswer1IsCorrect && answerValue2 != correctAns2) {
        setResult1({
          success: true,
          message: `Your answer is correct`,
        });
        setResult2({
          success: false,
          message: `Your answer is wrong \n correct answer is ${correctAns2}`,
        });
      } else if (!isAnswer1IsCorrect && answerValue2 != correctAns2) {
        setResult1({
          success: false,
          message: `Your answer is wrong \n correct answer is ${correctAns1}`,
        });
        setResult2({
          success: false,
          message: `Your answer is wrong \n correct answer is ${correctAns2}`,
        });
      } else {
        setResult1({
          success: true,
          message: `Your answer is correct`,
        });
        setResult2({
          success: true,
          message: `Your answer is correct`,
        });
      }
    }
  };

  const getCheckVisibality = (): ViewStyle => {
    if (correctAns1 && !correctAns2) {
      if (answerValue1) {
        return {
          opacity: 1,
          pointerEvents: "auto",
          userSelect: "auto",
          backgroundColor: "#74c69d",
        };
      } else {
        return {
          opacity: 0.5,
          pointerEvents: "none",
          userSelect: "none",
          backgroundColor: "#6c757d",
        };
      }
    } else if (correctAns1 && correctAns2) {
      if (answerValue1 && answerValue2) {
        return {
          opacity: 1,
          pointerEvents: "auto",
          userSelect: "auto",
          backgroundColor: "#74c69d",
        };
      } else {
        return {
          opacity: 0.5,
          pointerEvents: "none",
          userSelect: "none",
          backgroundColor: "#6c757d",
        };
      }
    }
    return {
      opacity: 0.5,
      pointerEvents: "none",
      userSelect: "none",
      backgroundColor: "#6c757d",
    };
  };

  const handleChangeText = (value: string, type: "input1" | "input2") => {
    setQuestionError(null);
    if (type === "input1") {
      setAnswerValue1(value);
      setStates((prevState) =>
        (prevState || []).map((question) => {
          if (question.id == questionNumber) {
            return {
              ...question,
              input1: value,
            };
          } else {
            return question;
          }
        })
      );
    } else if (type === "input2") {
      setAnswerValue2(value);
      setStates((prevState) =>
        (prevState || []).map((question) => {
          if (question.id == questionNumber) {
            return {
              ...question,
              input2: value,
            };
          } else {
            return question;
          }
        })
      );
    }
  };

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          width: width,
          height: height,
          top: scrollY,
          left: RWAnimeInter,
          backgroundColor: "white",
          zIndex: 100,
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
        {/* Calculator */}
        <MiniCalculator
          isOpen={isCalculatorOpen}
          setIsOpen={setIsCalculatorOpen}
        />
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
          {questionPart1 && (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text
                style={{
                  fontFamily: fontFamily.Bold,
                  color: colors.grayDark,
                  fontSize: 18,
                }}
              >
                {questionNumber}
              </Text>
              <View style={{ gap: 10 }}>
                <Text
                  style={{
                    fontFamily: fontFamily.Medium,
                    color: colors.grayLight,
                    fontSize: 15,
                  }}
                >
                  {questionPart1}
                </Text>
                {questionPart2 && (
                  <Text
                    style={{
                      fontFamily: fontFamily.Medium,
                      color: colors.grayLight,
                      fontSize: 15,
                    }}
                  >
                    {questionPart2}
                  </Text>
                )}
              </View>
            </View>
          )}
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
                onPress={() => setIsCalculatorOpen(true)}
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
                  source={calculator}
                  alt="Calculator"
                  resizeMode="contain"
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
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
        <ViewShot
          ref={viewShotRef}
          style={{ flex: 1, zIndex: 0, backgroundColor: "white" }}
        >
          <SketchCanvas
            style={{ flex: 1 }}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            ref={RNSketchRef}
            onStrokeEnd={handleStrokeEnd}
          />
        </ViewShot>
      </Animated.View>
      <View
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          if (questionError && questionNumber === questionError.id) {
            viewRef.current?.scrollTo({ y, animated: true });
          }
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
          {/* Question 1 */}
          <View style={{ width: "100%", gap: 20 }}>
            {/* Question */}
            {questionPart1 && (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text
                  style={{
                    fontFamily: fontFamily.Bold,
                    color: colors.grayDark,
                    fontSize: 18,
                  }}
                >
                  {questionNumber}
                </Text>
                <View style={{ gap: 10 }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.Medium,
                      color: colors.grayLight,
                      fontSize: 15,
                    }}
                  >
                    {questionPart1}
                  </Text>
                  {questionPart2 && (
                    <Text
                      style={{
                        fontFamily: fontFamily.Medium,
                        color: colors.grayLight,
                        fontSize: 15,
                      }}
                    >
                      {questionPart2}
                    </Text>
                  )}
                </View>
              </View>
            )}
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
              {/* Normal Option */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: "auto",
                  marginTop: 40,
                  gap: 7,
                }}
              >
                {isOption1 && (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        position: "relative",
                        borderStyle: "dashed",
                        borderColor:
                          result1 === null
                            ? colors.grayLight
                            : result1.success
                            ? "#74c69d"
                            : "#bc4749",
                        borderWidth: 1,
                        width: option1Width,
                      }}
                    >
                      <TextInput
                        value={answerValue1}
                        onChangeText={(value) =>
                          handleChangeText(value, "input1")
                        }
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

                    <Text
                      style={{ fontFamily: fontFamily.Medium, fontSize: 13 }}
                    >
                      {option1Label}
                    </Text>
                  </>
                )}
                {isOption2 && (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        position: "relative",
                        borderStyle: "dashed",
                        borderColor:
                          result2 === null
                            ? colors.grayLight
                            : result2.success
                            ? "#74c69d"
                            : "#bc4749",
                        borderWidth: 1,
                        width: option2Width,
                      }}
                    >
                      <TextInput
                        value={answerValue2}
                        onChangeText={(value) =>
                          handleChangeText(value, "input2")
                        }
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
                    <Text
                      style={{ fontFamily: fontFamily.Medium, fontSize: 13 }}
                    >
                      {option2Label}
                    </Text>
                  </>
                )}
              </View>
              {/* Double Option */}
              <View style={{ gap: 7 }}>
                {doubleSideOption1 && (
                  <View
                    style={{
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {doubleSideOption1.leftSide.isUpon ? (
                        <View
                          style={{
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption1.leftSide.firstValue}
                          </Text>
                          <View
                            style={{
                              height: 1,
                              width: "100%",
                              backgroundColor: colors.grayLight,
                            }}
                          ></View>
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption1.leftSide.secondValue}
                          </Text>
                        </View>
                      ) : (
                        <Text>{doubleSideOption1.leftSide.firstValue}</Text>
                      )}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                          position: "relative",
                          borderStyle: "dashed",
                          borderColor: colors.grayLight,
                          borderWidth: 1,
                          width: doubleSideOption1.optionWidth,
                        }}
                      >
                        <TextInput
                          // value={answerValue1}
                          // onChangeText={(value) =>
                          //   handleChangeText(value, "input1")
                          // }
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
                      {doubleSideOption1.rightSide.isUpon ? (
                        <View
                          style={{
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption1.rightSide.firstValue}
                          </Text>
                          <View
                            style={{
                              height: 1,
                              width: "100%",
                              backgroundColor: colors.grayLight,
                            }}
                          ></View>
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption1.rightSide.secondValue}
                          </Text>
                        </View>
                      ) : (
                        <Text>{doubleSideOption1.rightSide.firstValue}</Text>
                      )}
                    </View>
                  </View>
                )}
                {doubleSideOption2 && (
                  <View
                    style={{
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {doubleSideOption2.leftSide.isUpon ? (
                        <View
                          style={{
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption2.leftSide.firstValue}
                          </Text>
                          <View
                            style={{
                              height: 1,
                              width: "100%",
                              backgroundColor: colors.grayLight,
                            }}
                          ></View>
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption2.leftSide.secondValue}
                          </Text>
                        </View>
                      ) : (
                        <Text>{doubleSideOption2.leftSide.firstValue}</Text>
                      )}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                          position: "relative",
                          borderStyle: "dashed",
                          borderColor: colors.grayLight,
                          borderWidth: 1,
                          width: doubleSideOption2.optionWidth,
                        }}
                      >
                        <TextInput
                          // value={answerValue1}
                          // onChangeText={(value) =>
                          //   handleChangeText(value, "input1")
                          // }
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
                      {doubleSideOption2.rightSide.isUpon ? (
                        <View
                          style={{
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption2.rightSide.firstValue}
                          </Text>
                          <View
                            style={{
                              height: 1,
                              width: "100%",
                              backgroundColor: colors.grayLight,
                            }}
                          ></View>
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption2.rightSide.secondValue}
                          </Text>
                        </View>
                      ) : (
                        <Text>{doubleSideOption2.rightSide.firstValue}</Text>
                      )}
                    </View>
                  </View>
                )}
                {doubleSideOption3 && (
                  <View
                    style={{
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {doubleSideOption3.leftSide.isUpon ? (
                        <View
                          style={{
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption3.leftSide.firstValue}
                          </Text>
                          <View
                            style={{
                              height: 1,
                              width: "100%",
                              backgroundColor: colors.grayLight,
                            }}
                          ></View>
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption3.leftSide.secondValue}
                          </Text>
                        </View>
                      ) : (
                        <Text>{doubleSideOption3.leftSide.firstValue}</Text>
                      )}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                          position: "relative",
                          borderStyle: "dashed",
                          borderColor: colors.grayLight,
                          borderWidth: 1,
                          width: doubleSideOption3.optionWidth,
                        }}
                      >
                        <TextInput
                          // value={answerValue1}
                          // onChangeText={(value) =>
                          //   handleChangeText(value, "input1")
                          // }
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
                      {doubleSideOption3.rightSide.isUpon ? (
                        <View
                          style={{
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption3.rightSide.firstValue}
                          </Text>
                          <View
                            style={{
                              height: 1,
                              width: "100%",
                              backgroundColor: colors.grayLight,
                            }}
                          ></View>
                          <Text
                            style={{
                              fontFamily: fontFamily.Medium,
                              fontSize: 15,
                              color: colors.grayLight,
                            }}
                          >
                            {doubleSideOption3.rightSide.secondValue}
                          </Text>
                        </View>
                      ) : (
                        <Text>{doubleSideOption3.rightSide.firstValue}</Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
              <View
                style={{
                  marginVertical: 15,
                }}
              >
                <TouchableOpacity
                  onPress={handleSubmit}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: getCheckVisibality().backgroundColor,
                    paddingHorizontal: 25,
                    paddingVertical: 13,
                    borderRadius: 8,
                    marginRight: "auto",
                    opacity: getCheckVisibality().opacity,
                    pointerEvents: getCheckVisibality().pointerEvents,
                    userSelect: getCheckVisibality().userSelect,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fontFamily.Medium,
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    Check
                  </Text>
                </TouchableOpacity>
              </View>
              {result1 && !result1.success && (
                <Text
                  style={{
                    marginBottom: 10,
                    fontFamily: fontFamily.Medium,
                    fontSize: 14,
                    color: "#bc4749",
                  }}
                >
                  1) {result1.message}
                </Text>
              )}
              {result1 && result1.success && (
                <Text
                  style={{
                    marginBottom: 10,
                    fontFamily: fontFamily.Medium,
                    fontSize: 14,
                    color: "#74c69d",
                  }}
                >
                  1) {result1.message}
                </Text>
              )}
              {result2 && !result2.success && (
                <Text
                  style={{
                    marginBottom: 10,
                    fontFamily: fontFamily.Medium,
                    fontSize: 14,
                    color: "#bc4749",
                  }}
                >
                  2) {result2.message}
                </Text>
              )}
              {result2 && result2.success && (
                <Text
                  style={{
                    marginBottom: 10,
                    fontFamily: fontFamily.Medium,
                    fontSize: 14,
                    color: "#74c69d",
                  }}
                >
                  2) {result2.message}
                </Text>
              )}
            </View>
          </View>
          {questionError && questionError.id === questionNumber && (
            <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: "#e5383b",
                  fontSize: 14,
                  fontFamily: fontFamily.Medium,
                }}
              >
                * {questionError.message}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            width: "100%",
            height: 2,
            backgroundColor: colors.grayLight,
          }}
        ></View>
      </View>
    </>
  );
};

export default TextQuestion;

const styles = StyleSheet.create({});
