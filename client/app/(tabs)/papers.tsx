import {
  DimensionValue,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import TextQuestion from "@/components/past-papers/textQuestion";
import { fontFamily } from "@/constants/fonts";

const Papers = () => {
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
    },
    {
      id: 2,
      questionPart1: "Change 6.7 kilometres to metres",
      isOption1: true,
      option1Width: "30%" as DimensionValue,
      option1Label: "years",
      correctAns1: "6000",
    },
    {
      id: 3,
      questionPart1:
        "A concert starts at 1950 and finishes 2 hours 42 minutes later.",
      questionPart2: "Work out the time the concert finishes.",
      isOption1: true,
      option1Width: "50%" as DimensionValue,
      option1Label: "",
      correctAns1: "6000",
    },
    {
      id: 4,
      questionPart1:
        "Edith invests $3000 in a savings account. The account pays simple interest at a rate of 2.6% per year.",
      questionPart2: "Calculate the total interest earned during the 3 years.",
      isOption1: true,
      option1Width: "50%" as DimensionValue,
      option1Label: "$",
      correctAns1: "6000",
    },
    {
      id: 5,
      questionPart1: "The circumference of a wheel is 198.55cm.",
      questionPart2:
        "Calculate the diameter of the wheel. Give your answer in millimetres.",
      isOption1: true,
      option1Width: "50%" as DimensionValue,
      option1Label: "mm",
      correctAns1: "6000",
    },
    {
      id: 6,
      questionPart1: "Write 34 as a percentage of 80.",
      isOption1: true,
      option1Width: "50%" as DimensionValue,
      option1Label: "%",
      correctAns1: "27.2",
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
  console.log(states);
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
  console.log(questionError);

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
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
        {data.map((question, index) => (
          <TextQuestion
            key={index}
            questionNumber={question.id}
            changeScroll={setIsScrollEnable}
            scrollY={scrollY}
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

export default Papers;

const styles = StyleSheet.create({});
