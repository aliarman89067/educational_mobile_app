import { colors } from "@/constants/colors";
import { fontFamily } from "@/constants/fonts";
import { close, divide, remove } from "@/constants/images";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const MiniCalculator = ({ isOpen, setIsOpen }: Props) => {
  const calculatorAnime = useRef(new Animated.Value(0)).current;

  const [firstValue, setFirstValue] = useState("");
  const [displayValue, setDisplayValue] = useState("0");
  const [operator, setOperator] = useState("");

  useEffect(() => {
    if (isOpen) {
      Animated.timing(calculatorAnime, {
        duration: 200,
        toValue: 1,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(calculatorAnime, {
        duration: 200,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const calculatoInter = calculatorAnime.interpolate({
    inputRange: [0, 1],
    outputRange: [250, 0],
  });

  const handleNumberInput = (num: string) => {
    if (displayValue === "0") {
      setDisplayValue(num);
    } else {
      setDisplayValue(displayValue + num);
    }
  };

  const handleOperatorInput = (operator: string) => {
    setOperator(operator);
    setFirstValue(displayValue);
    setDisplayValue("0");
  };

  const handleCalculation = () => {
    const num1 = parseFloat(firstValue);
    const num2 = parseFloat(displayValue);
    if (operator === "+") {
      setDisplayValue((num1 + num2).toString());
    } else if (operator === "-") {
      setDisplayValue((num1 - num2).toString());
    } else if (operator === "*") {
      setDisplayValue((num1 * num2).toString());
    } else if (operator === "/") {
      setDisplayValue((num1 / num2).toString());
    } else if (operator === "%") {
      setDisplayValue((num1 / num2).toString());
    }
    setOperator("");
    setFirstValue("");
  };

  const handeClear = () => {
    setDisplayValue("0");
    setOperator("");
    setFirstValue("");
  };
  const handleDelete = () => {
    if (displayValue.length === 1) {
      setDisplayValue("0");
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX: calculatoInter }] },
      ]}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.closeBtn}
          onPress={() => setIsOpen(false)}
        >
          <Image
            source={close}
            alt="Close Icon"
            resizeMode="contain"
            style={styles.closeImg}
          />
        </TouchableOpacity>
      </View>
      {/* Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.firstText}>{firstValue + operator}</Text>
        <Text style={styles.displayText}>{displayValue}</Text>
      </View>
      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={handeClear}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Image
              source={remove}
              tintColor="white"
              alt="Remove Button"
              resizeMode="contain"
              style={styles.buttonImg}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOperatorInput("%")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOperatorInput("/")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.purple }]}
          >
            <Image
              source={divide}
              tintColor="white"
              alt="Remove Button"
              resizeMode="contain"
              style={styles.buttonImg}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => handleNumberInput("7")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNumberInput("8")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNumberInput("9")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOperatorInput("*")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.purple }]}
          >
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => handleNumberInput("6")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNumberInput("5")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNumberInput("4")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOperatorInput("-")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.purple }]}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => handleNumberInput("1")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNumberInput("2")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNumberInput("3")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOperatorInput("+")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.purple }]}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => handleNumberInput("0")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNumberInput("00")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleNumberInput(". ")}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.grayLight }]}
          >
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCalculation}
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: colors.purple }]}
          >
            <Text style={styles.buttonText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.grayDark,
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 100,
    paddingHorizontal: 10,
    paddingBottom: 6,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 6,
  },
  closeBtn: {
    width: 25,
    height: 25,
    borderRadius: 100,
    backgroundColor: "#ff4d6d",
    alignItems: "center",
    justifyContent: "center",
  },
  closeImg: {
    width: 15,
    height: 15,
  },
  inputContainer: {
    height: 70,
    width: "100%",
    backgroundColor: "#f4f3ee",
    alignItems: "flex-end",
    paddingHorizontal: 4,
    paddingVertical: 2,
    justifyContent: "flex-end",
  },
  displayText: {
    fontFamily: fontFamily.Medium,
    fontSize: 25,
    color: colors.grayLight,
  },
  firstText: {
    fontFamily: fontFamily.Regular,
    fontSize: 17,
    color: colors.grayLight,
  },
  buttonsContainer: {
    gap: 5,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  buttonsRow: {
    gap: 5,
    flexDirection: "row",
    width: "100%",
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: fontFamily.Bold,
    fontSize: 20,
    color: "white",
  },
  buttonImg: {
    width: 30,
    height: 30,
  },
});
