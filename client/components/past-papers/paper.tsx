import {
  DimensionValue,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import TextQuestion from "@/components/past-papers/textQuestion";
import { fontFamily } from "@/constants/fonts";
import DiagramQuestion from "@/components/past-papers/diagramQuestion";
import {
  diagram,
  diagram2,
  diagram3,
  diagram4,
  diagram5,
  diagram6,
  diagram7,
  paperHeader1,
  paperHeaderQR,
} from "@/constants/images";
import { colors } from "@/constants/colors";

const Paper = () => {
  const viewRef = useRef<ScrollView>(null);

  const [scrollY, setScrollY] = useState(0);
  const [isScrollEnable, setIsScrollEnable] = useState(true);
  const [questionError, setQuestionError] = useState<null | {
    id: number;
    message: string;
  }>(null);
  const [states, setStates] = useState<
    | null
    | {
        id: number;
        input1: string;
        input2: string | undefined;
        correct1: string;
        correct2: string | undefined;
      }[]
  >(null);

  const data = [
    {
      id: 1,
      questionPart1:
        "Jacob is 10 years 8 months old. Amy is 15 months younger than Jacob.",
      questionPart2: "Find how old Amy is.",
      isOption1: true,
      isOption2: true,
      option1Width: "30%" as DimensionValue,
      option2Width: "30%" as DimensionValue,
      option1Label: "years",
      option2Label: "months",
      correctAns1: "9",
      correctAns2: "5",
      isDiagram: false,
    },
    {
      id: 2,
      questionPart1: "Change 6.7 kilometres to metres.",
      questionPart2: "",
      isOption1: true,
      isOption2: false,
      option1Width: "50%" as DimensionValue,
      option2Width: "0%" as DimensionValue,
      option1Label: "m",
      option2Label: "",
      correctAns1: "6000",
      correctAns2: "",
      isDiagram: false,
    },
    {
      id: 3,
      diagramSrc: diagram,
      questionBeforeDiagram: "",
      questionAfterDiagram: "",
      option1: false,
      option1Label: "",
      option1Width: "0%" as DimensionValue,
      point1: "Measure angle x.",
      point2: "Write down the mathematical name for this type of angle",
      isPointOption1: true,
      pointOption1Width: "55%" as DimensionValue,
      pointOption1Label: "Angle x = ",
      isPointOption2: true,
      pointOption2Width: "60%" as DimensionValue,
      pointOption2Label: "",
      diagramWidthPercentage: "80%" as DimensionValue,
      isDiagram: true,
    },
    {
      id: 4,
      questionPart1:
        "A concert starts at 1950 and finishes 2 hours 42 minutes later.",
      questionPart2: "Work out the time the concert finishes.",
      isOption1: true,
      isOption2: false,
      option1Width: "50%" as DimensionValue,
      option2Width: "0%" as DimensionValue,
      option1Label: "",
      option2Label: "",
      correctAns1: "6000",
      correctAns2: "",
      isDiagram: false,
    },
    {
      id: 5,
      questionPart1:
        "Use one of these symbols <,> or = to make each statement true.",
      questionPart2: "",
      isOption1: false,
      isOption2: false,
      option1Width: "0%" as DimensionValue,
      option2Width: "0%" as DimensionValue,
      option1Label: "",
      option2Label: "",
      correctAns1: "6000",
      correctAns2: "",
      doubleSideOption1: {
        leftSide: {
          isUpon: true,
          firstValue: "2",
          secondValue: "7",
        },
        optionWidth: "40%" as DimensionValue,
        correctAns: "5000",
        rightSide: {
          isUpon: false,
          firstValue: "0.2861",
          secondValue: "",
        },
      },
      doubleSideOption2: {
        leftSide: {
          isUpon: true,
          firstValue: "99",
          secondValue: "900",
        },
        optionWidth: "40%" as DimensionValue,
        correctAns: "5000",
        rightSide: {
          isUpon: false,
          firstValue: "11%",
          secondValue: "",
        },
      },
      doubleSideOption3: {
        leftSide: {
          isUpon: false,
          firstValue: "1\u00B3",
          secondValue: "",
        },
        optionWidth: "40%" as DimensionValue,
        correctAns: "5000",
        rightSide: {
          isUpon: false,
          firstValue: "4\u2070",
          secondValue: "",
        },
      },
      isDiagram: false,
    },
    {
      id: 6,
      diagramSrc: diagram2,
      questionBeforeDiagram:
        "The stem-and-leaf diagram shows the number of cars sold each day by a company.",
      questionAfterDiagram: "",
      point1: "Find the range.",
      point2: "Find the mode.",
      option1: false,
      option1Label: "",
      option1Width: "0%" as DimensionValue,
      isPointOption1: true,
      pointOption1Width: "55%" as DimensionValue,
      pointOption1Label: "",
      isPointOption2: true,
      pointOption2Width: "55%" as DimensionValue,
      pointOption2Label: "",
      diagramWidthPercentage: "90%" as DimensionValue,
      isDiagram: true,
    },
    {
      id: 7,
      questionPart1: "Find the reciprocal of 1*1/4.",
      questionPart2: "",
      isOption1: true,
      isOption2: false,
      option1Width: "50%" as DimensionValue,
      option2Width: "0%" as DimensionValue,
      option1Label: "",
      option2Label: "",
      correctAns1: "6000",
      correctAns2: "",
      isDiagram: false,
    },
    {
      id: 8,
      diagramSrc: diagram3,
      questionBeforeDiagram: "",
      questionAfterDiagram:
        "The diagram shows a quadrilateral. \n Find the value of y",
      point1: "",
      point2: "",
      option1: true,
      option1Label: "y = ",
      option1Width: "60%" as DimensionValue,
      isPointOption1: true,
      pointOption1Width: "55%" as DimensionValue,
      pointOption1Label: "y= ",
      isPointOption2: false,
      pointOption2Width: "0%" as DimensionValue,
      pointOption2Label: "",
      diagramWidthPercentage: "70%" as DimensionValue,
      isDiagram: true,
    },
    {
      id: 9,
      questionPart1:
        "Edith invests $3000 in a savings account. \n The account pays simple interest at a rate of 2.6% per year.",
      questionPart2: "Calculate the total interest earned during the 3 years.",
      isOption1: true,
      isOption2: false,
      option1Width: "50%" as DimensionValue,
      option2Width: "0%" as DimensionValue,
      option1Label: "",
      option2Label: "",
      correctAns1: "6000",
      correctAns2: "",
      isDiagram: false,
    },
    {
      id: 10,
      questionPart1: "The circumference of a wheel is 198.55cm.",
      questionPart2:
        "Calculate the diameter of the wheel. \n Give your answer in millimetres.",
      isOption1: true,
      isOption2: false,
      option1Width: "50%" as DimensionValue,
      option2Width: "0%" as DimensionValue,
      option1Label: "mm",
      option2Label: "",
      correctAns1: "6000",
      correctAns2: "",
      isDiagram: false,
    },
    {
      id: 11,
      diagramSrc: diagram4,
      questionBeforeDiagram:
        "The grid shows half of a shape which has a line of symmetry, L. \n Complete the shape.",
      questionAfterDiagram: "",
      point1: "Find the value of 6c + 7d when c = 3 and d = -4.",
      point2: "Solve. \n 6x + 8 = 11x + 4",
      option1: false,
      option1Label: "",
      option1Width: "0%" as DimensionValue,
      isPointOption1: true,
      pointOption1Width: "55%" as DimensionValue,
      pointOption1Label: "",
      isPointOption2: true,
      pointOption2Width: "55%" as DimensionValue,
      pointOption2Label: "x = ",
      diagramWidthPercentage: "100%" as DimensionValue,
      isDiagram: true,
    },
    {
      id: 12,
      questionPart1: "Write 34 as a percentage of 80.",
      questionPart2: "",
      isOption1: true,
      isOption2: false,
      option1Width: "50%" as DimensionValue,
      option2Width: "0%" as DimensionValue,
      option1Label: "%",
      option2Label: "",
      correctAns1: "6000",
      correctAns2: "",
      isDiagram: false,
    },
    {
      id: 13,
      diagramSrc: diagram5,
      questionBeforeDiagram:
        "A bus stops 25 times on a journey \n The table shows the number of people who get on the bus at each stop.",
      questionAfterDiagram: "Calculate the mean.",
      point1: "",
      point2: "",
      option1: true,
      option1Label: "",
      option1Width: "50%" as DimensionValue,
      isPointOption1: false,
      pointOption1Width: "0%" as DimensionValue,
      pointOption1Label: "",
      isPointOption2: false,
      pointOption2Width: "0%" as DimensionValue,
      pointOption2Label: "",
      diagramWidthPercentage: "80%" as DimensionValue,
      isDiagram: true,
    },
    {
      id: 14,
      diagramSrc: diagram6,
      questionBeforeDiagram: "",
      questionAfterDiagram: `
      The diagram shows a trapezium with parallel sides of length 12cm and wcm \n
      The height of the trapezium is 8cm. \n
      The area of the trapezium is 78 cm\u00B2 \n\n
      Find the value of w.
      `,
      point1: "",
      point2: "",
      option1: true,
      option1Label: "w = ",
      option1Width: "50%" as DimensionValue,
      isPointOption1: false,
      pointOption1Width: "0%" as DimensionValue,
      pointOption1Label: "",
      isPointOption2: false,
      pointOption2Width: "0%" as DimensionValue,
      pointOption2Label: "",
      diagramWidthPercentage: "80%" as DimensionValue,
      isDiagram: true,
    },
    {
      id: 15,
      questionPart1:
        "A distance, d metres, measures 34.6m, correct to the nearest 0.1m.",
      questionPart2: "Complete this statement about the value of d.",
      isOption1: true,
      isOption2: true,
      option1Width: "30%" as DimensionValue,
      option2Width: "30%" as DimensionValue,
      option1Label: "≤ d <",
      option2Label: "",
      correctAns1: "6000",
      correctAns2: "6000",
      isDiagram: false,
    },
    {
      id: 16,
      questionPart1: "Josh buys a car for $7800 and sells it for $5265.",
      questionPart2: "Calculate his percentage loss.",
      isOption1: true,
      isOption2: false,
      option1Width: "55%" as DimensionValue,
      option2Width: "0%" as DimensionValue,
      option1Label: "%",
      option2Label: "",
      correctAns1: "6000",
      correctAns2: "",
      isDiagram: false,
    },
    {
      id: 17,
      questionPart1: "Solve the simultaneous equations.",
      questionPart2:
        "You must show all your working \n\n5x + 6y = 9 \n3x - 2y = -17",
      isOption1: true,
      isOption2: true,
      option1Width: "40%" as DimensionValue,
      option2Width: "40%" as DimensionValue,
      option1Label: "= x",
      option2Label: "= y",
      correctAns1: "6000",
      correctAns2: "6000",
      isDiagram: false,
    },
    {
      id: 18,
      diagramSrc: diagram7,
      questionBeforeDiagram: "",
      questionAfterDiagram: `
      The diagram shows part of a regular polygon. \n
      The interior angle of the polygon is 132° larger than the exterior angle. \n\n
      Calculate the number of sides of this polygon.
      `,
      point1: "",
      point2: "",
      option1: true,
      option1Label: "",
      option1Width: "60%" as DimensionValue,
      isPointOption1: false,
      pointOption1Width: "0%" as DimensionValue,
      pointOption1Label: "",
      isPointOption2: false,
      pointOption2Width: "0%" as DimensionValue,
      pointOption2Label: "",
      diagramWidthPercentage: "80%" as DimensionValue,
      isDiagram: true,
    },
  ];

  useEffect(() => {
    let formattedData: any = [];
    data.forEach((question) => {
      formattedData.push({
        id: question.id,
        input1: "",
        input2: "",
        correct1: question.correctAns1,
        correct2: question.correctAns2,
      });
    });

    setStates(formattedData);
  }, []);

  const handleSubmit = () => {
    if (!states) return;
    setQuestionError(null);
    const sortedStates = states.sort((a, b) => b.id - a.id);
    sortedStates.forEach((question) => {
      if (
        (question.correct1 && !question.input1) ||
        (question.correct2 && !question.input2)
      ) {
        setQuestionError({
          id: question.id,
          message: "Please complete this question",
        });
        return;
      }
      let isAnswer1IsCorrect = false;
      if (question.input1) {
        const isNumber = Number(question.correct1);
        if (isNumber) {
          const isFloat = Number(question.correct1) % 1 !== 0;
          if (isFloat) {
            const correctAnsInNumber = Number(question.correct1);
            const correctInputInNumber = Number(question.input1);
            isAnswer1IsCorrect =
              Math.trunc(correctAnsInNumber) ==
              Math.trunc(correctInputInNumber);
          } else {
            isAnswer1IsCorrect = question.correct1 == question.input1;
          }
        } else {
          isAnswer1IsCorrect = question.correct1 == question.input1;
        }
      }
      if (question.correct1 && !question.correct2) {
        if (isAnswer1IsCorrect) {
          // setResult1({
          //   success: true,
          //   message: `Your answer is correct`,
          // });
        } else {
          setQuestionError({
            id: question.id,
            message: `Your answer is wrong \n correct answer is ${question.correct1}`,
          });
          // setResult1({
          //   success: false,
          //   message: `Your answer is wrong \n correct answer is ${correctAns1}`,
          // });
        }
      } else if (question.correct1 && question.correct2) {
        if (!isAnswer1IsCorrect && question.input2 == question.correct2) {
          setQuestionError({
            id: question.id,
            message: `Your answer is wrong \n correct answer is ${question.correct1}`,
          });
          // setResult1({
          //   success: false,
          //   message: `Your answer is wrong \n correct answer is ${correctAns1}`,
          // });
          // setResult2({
          //   success: true,
          //   message: `Your answer is correct`,
          // });
        } else if (isAnswer1IsCorrect && question.input2 != question.correct2) {
          setQuestionError({
            id: question.id,
            message: `Your answer is wrong \n correct answer is ${question.correct1}`,
          });
          // setResult1({
          //   success: true,
          //   message: `Your answer is correct`,
          // });
          // setResult2({
          //   success: false,
          //   message: `Your answer is wrong \n correct answer is ${correctAns2}`,
          // });
        } else if (
          !isAnswer1IsCorrect &&
          question.input2 != question.correct2
        ) {
          setQuestionError({
            id: question.id,
            message: `Your answer is wrong \n correct answer is ${question.correct1}`,
          });
          // setResult1({
          //   success: false,
          //   message: `Your answer is wrong \n correct answer is ${correctAns1}`,
          // });
          // setResult2({
          //   success: false,
          //   message: `Your answer is wrong \n correct answer is ${correctAns2}`,
          // });
        } else {
          // setResult1({
          //   success: true,
          //   message: `Your answer is correct`,
          // });
          // setResult2({
          //   success: true,
          //   message: `Your answer is correct`,
          // });
        }
      }
    });
  };

  const instructionsData = [
    "Answer all questions.",
    "Use a black or dark blue pen. You may use an HB pencil for any diagrams or graphs.",
    "Write your name, centre number and candidate number in the boxes at the top of the page",
    "Write your answer to each question in the space provided.",
    "Do not use an erasable pen or correction fluid.",
    "Do not write on any bar codes.",
    "You should use a calculator where appropriate.",
    "You may use tracing paper.",
    "You must show all necessary working clearly",
    "Give non-exact numerical answers correct to 3 significant figures, or 1 decimal place for angles in degrees, unless a different level of accuracy is specified in the question.",
    "For r, use either your calculator value or 3.142.",
  ];
  const informationData = [
    "The total mark for this paper is 56",
    "The number of marks for each question or part question is shown in brackets [ ].",
  ];

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <ScrollView
        ref={viewRef}
        scrollEnabled={isScrollEnable}
        showsVerticalScrollIndicator={false}
        style={{ position: "relative" }}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          setScrollY(y);
        }}
      >
        <View style={{ flex: 1, width: "100%", gap: 7 }}>
          <Image
            source={paperHeader1}
            alt="Paper Header 1"
            resizeMode="contain"
            style={{ width: "100%", height: 60 }}
          />
          <View style={{ paddingHorizontal: 18 }}>
            <Text
              style={{
                fontFamily: fontFamily.Black,
                color: colors.grayLight,
                fontSize: 25,
                position: "relative",
              }}
            >
              Cambridge IGCSE
              <Text
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  transform: [
                    {
                      translateY: -20,
                    },
                  ],
                  fontFamily: fontFamily.Medium,
                  color: colors.grayLight,
                  fontSize: 10,
                }}
              >
                TM
              </Text>
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <View style={{ width: "auto" }}>
                <Text>CANDIDTATE</Text>
                <Text>NAME</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: 60,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: colors.grayLight,
                }}
              ></View>
            </View>
            <View
              style={{
                gap: 10,
                marginTop: 10,
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ width: "auto" }}>
                  <Text>CENTRE</Text>
                  <Text>NUMBER</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: 26,
                      height: 42,
                      borderColor: colors.grayLight,
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  ></View>
                  <View
                    style={{
                      width: 26,
                      height: 42,
                      borderColor: colors.grayLight,
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  ></View>
                  <View
                    style={{
                      width: 26,
                      height: 42,
                      borderColor: colors.grayLight,
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  ></View>
                  <View
                    style={{
                      width: 26,
                      height: 42,
                      borderColor: colors.grayLight,
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  ></View>
                  <View
                    style={{
                      width: 26,
                      height: 42,
                      borderColor: colors.grayLight,
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  ></View>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ width: "auto" }}>
                  <Text>CANDIDTATE</Text>
                  <Text>NUMBER</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: 26,
                      height: 42,
                      borderColor: colors.grayLight,
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  ></View>
                  <View
                    style={{
                      width: 26,
                      height: 42,
                      borderColor: colors.grayLight,
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  ></View>
                  <View
                    style={{
                      width: 26,
                      height: 42,
                      borderColor: colors.grayLight,
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  ></View>
                  <View
                    style={{
                      width: 26,
                      height: 42,
                      borderColor: colors.grayLight,
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  ></View>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 4, width: "100%" }}>
                <Image
                  source={paperHeaderQR}
                  alt="Paper Header QR"
                  resizeMode="contain"
                  style={{ width: 55, height: 160 }}
                />
                <View style={{ flex: 1, width: "100%", gap: 5 }}>
                  <View
                    style={{
                      height: 1,
                      width: "100%",
                      backgroundColor: colors.grayDark,
                    }}
                  ></View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 10,
                      flex: 1,
                    }}
                  >
                    <View
                      style={{ justifyContent: "space-between", width: "70%" }}
                    >
                      <View style={{ gap: 10 }}>
                        <Text
                          style={{
                            fontFamily: fontFamily.Bold,
                            fontSize: 15,
                            color: colors.grayDark,
                          }}
                        >
                          MATHEMATICS
                        </Text>
                        <Text
                          style={{
                            fontFamily: fontFamily.Medium,
                            fontSize: 13,
                            color: colors.grayLight,
                          }}
                        >
                          Paper 1 (CORE)
                        </Text>
                      </View>
                      <View style={{ gap: 10 }}>
                        <Text
                          style={{
                            fontFamily: fontFamily.Medium,
                            fontSize: 13,
                            color: colors.grayLight,
                          }}
                        >
                          You must answer on the question paper.
                        </Text>
                        <Text
                          style={{
                            fontFamily: fontFamily.Medium,
                            fontSize: 13,
                            color: colors.grayLight,
                          }}
                        >
                          You will need: Geometrical instruments
                        </Text>
                      </View>
                    </View>
                    <View style={{ gap: 5, width: 110 }}>
                      <Text
                        style={{
                          fontFamily: fontFamily.Bold,
                          fontSize: 13,
                          color: colors.grayDark,
                        }}
                      >
                        0580/11
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontFamily.Bold,
                          fontSize: 13,
                          color: colors.grayDark,
                        }}
                      >
                        October/November 2024
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontFamily.Bold,
                          fontSize: 13,
                          color: colors.grayDark,
                        }}
                      >
                        1 hour
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: colors.grayDark,
                }}
              ></View>
              <View>
                <Text
                  style={{
                    fontFamily: fontFamily.Bold,
                    color: colors.grayDark,
                    fontSize: 14,
                  }}
                >
                  INSTRUCTIONS
                </Text>
                {instructionsData.map((text, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "100%",
                        backgroundColor: colors.grayDark,
                      }}
                    ></View>
                    <Text
                      style={{
                        fontFamily: fontFamily.Medium,
                        fontSize: 13,
                        color: colors.grayLight,
                      }}
                    >
                      {text}
                    </Text>
                  </View>
                ))}
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: fontFamily.Bold,
                    color: colors.grayDark,
                    fontSize: 14,
                  }}
                >
                  INFORMATION
                </Text>
                {informationData.map((text, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "100%",
                        backgroundColor: colors.grayDark,
                      }}
                    ></View>
                    <Text
                      style={{
                        fontFamily: fontFamily.Medium,
                        fontSize: 13,
                        color: colors.grayLight,
                      }}
                    >
                      {text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: colors.grayDark,
            marginTop: 15,
          }}
        ></View>
        {data.map((question, index) => (
          <View key={index}>
            {question.isDiagram ? (
              <DiagramQuestion
                index={index}
                scrollY={scrollY}
                changeScroll={setIsScrollEnable}
                option1={question.option1}
                option1Label={question.option1Label}
                diagramWidthPercentage={question.diagramWidthPercentage}
                option1Width={question.option1Width}
                diagramSrc={question.diagramSrc}
                questionBeforeDiagram={question.questionBeforeDiagram}
                questionAfterDiagram={question.questionAfterDiagram!!}
                point1={question.point1}
                point2={question.point2}
                isPointOption1={question.isPointOption1}
                pointOption1Width={question.pointOption1Width}
                pointOption1Label={question.pointOption1Label}
                isPointOption2={question.isPointOption2}
                pointOption2Width={question.pointOption2Width}
                pointOption2Label={question.pointOption2Label}
              />
            ) : (
              <TextQuestion
                index={index}
                questionNumber={question.id}
                changeScroll={setIsScrollEnable}
                scrollY={scrollY}
                doubleSideOption1={question.doubleSideOption1}
                doubleSideOption2={question.doubleSideOption2}
                doubleSideOption3={question.doubleSideOption3}
                questionPart1={question.questionPart1}
                questionPart2={question.questionPart2}
                isOption1={question.isOption1}
                isOption2={question.isOption2}
                option1Width={question.option1Width}
                option2Width={question.option2Width}
                option1Label={question.option1Label}
                option2Label={question.option2Label}
                correctAns1={question.correctAns1}
                correctAns2={question.correctAns2}
                setStates={setStates}
                questionError={questionError}
                setQuestionError={setQuestionError}
                viewRef={viewRef}
              />
            )}
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.7}
          style={{
            width: "90%",
            paddingVertical: 20,
            backgroundColor: "#95d5b2",
            marginHorizontal: "auto",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.Medium,
              color: "white",
              fontSize: 14,
            }}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Paper;

const styles = StyleSheet.create({});
