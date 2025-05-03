import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TextQuestion from "@/components/past-papers/textQuestion";

const Papers = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrollEnable, setIsScrollEnable] = useState(true);

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      <ScrollView
        scrollEnabled={isScrollEnable}
        showsVerticalScrollIndicator={false}
        style={{ position: "relative" }}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          setScrollY(y);
        }}
      >
        <TextQuestion
          changeScroll={setIsScrollEnable}
          scrollY={scrollY}
          questionPart1="Jacob is 10 years 8 months old. Amy is 15 months younger than Jacob."
          questionPart2="Find how old Amy is."
          isOption1
          isOption2
          option1Width="30%"
          option2Width="30%"
          option1Label="years"
          option2Label="months"
        />
        <TextQuestion
          changeScroll={setIsScrollEnable}
          scrollY={scrollY}
          questionPart1="Change 6.7 kilometres to metres"
          isOption1
          option1Width="50%"
          option1Label="m"
        />
        <TextQuestion
          changeScroll={setIsScrollEnable}
          scrollY={scrollY}
          questionPart1="A concert starts at 1950 and finishes 2 hours 42 minutes later."
          questionPart2="Work out the time the concert finishes."
          isOption1
          option1Width="50%"
          option1Label=""
        />
        <TextQuestion
          changeScroll={setIsScrollEnable}
          scrollY={scrollY}
          questionPart1="Edith invests $3000 in a savings account.
The account pays simple interest at a rate of 2.6% per year."
          questionPart2="Calculate the total interest earned during the 3 years."
          isOption1
          option1Width="50%"
          option1Label="$"
        />
        <TextQuestion
          changeScroll={setIsScrollEnable}
          scrollY={scrollY}
          questionPart1="The circumference of a wheel is 198.55cm."
          questionPart2="Calculate the diameter of the wheel.
Give your answer in millimetres."
          isOption1
          option1Width="50%"
          option1Label="mm"
        />
        <TextQuestion
          changeScroll={setIsScrollEnable}
          scrollY={scrollY}
          questionPart1="Write 34 as a percentage of 80."
          isOption1
          option1Width="60%"
          option1Label="%"
        />
      </ScrollView>
    </View>
  );
};

export default Papers;

const styles = StyleSheet.create({});
