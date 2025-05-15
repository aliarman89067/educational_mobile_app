import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "react-native";

import { MiniCalculator } from "@/components/past-papers/MiniCalculator";
import ViewShot, { captureRef } from "react-native-view-shot";
import { SketchCanvas } from "@sourcetoad/react-native-sketch-canvas";
import {
  brush,
  calculator,
  chevronDown,
  close,
  pencil,
  redo,
  undo,
} from "@/constants/images";
import { colors } from "@/constants/colors";
import { useSketchCanvasStore } from "@/context/zustandStore";

const SketchCanvasContainer = () => {
  const RNSketchRef = useRef<SketchCanvas>(null);
  const viewShotRef = useRef(null);

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [strokeColor, setStrokeColor] = useState("red");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [paths, setPaths] = useState<any[]>([]);
  const [imagePath, setImagePath] = useState("");
  const [canvaReady, setCanvaReady] = useState(false);

  const { status, pending, data } = useSketchCanvasStore();

  useEffect(() => {
    if (status === "start" && canvaReady) {
      console.log("Start Updated");
      setPaths(data.pathsNodes);
      setRedoStack(data.redoStackNodes);
      setUndoStack(data.undoStackNodes);
      setImagePath(data.imagePathString);
      data.pathsNodes.forEach((path) => {
        RNSketchRef.current?.addPath(path);
      });
    }
  }, [status, RNSketchRef, canvaReady]);

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
  // Called when user finishes a stroke
  const handleStrokeEnd = (path: any) => {
    setPaths([...paths, path]);
    setUndoStack((prev) => [...prev, path]);
    setRedoStack([]); // Clear redo when a new stroke is added
  };

  const captureScreen = async () => {
    try {
      if (paths.length === 0 || !paths) return;
      const uri = await captureRef(viewShotRef, {
        format: "jpg",
        quality: 0.8,
      });
      setCanvaReady(false);
      pending({
        imagePathString: uri,
        pathsNodes: paths,
        undoStackNodes: undoStack,
        redoStackNodes: redoStack,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { width, height } = Dimensions.get("window");

  return (
    <>
      {status === "start" && (
        <View
          style={{
            position: "absolute",
            width: width,
            height: height,
            top: 0,
            left: 0,
            backgroundColor: "white",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {/* Calculator */}
          <MiniCalculator
            isOpen={isCalculatorOpen}
            setIsOpen={setIsCalculatorOpen}
          />
          {/* Header */}
          <View style={{ gap: 20, paddingHorizontal: 20, paddingVertical: 10 }}>
            <TouchableOpacity onPress={captureScreen} activeOpacity={0.7}>
              <Image
                source={close}
                alt="Close"
                resizeMode="contain"
                tintColor={colors.grayLight}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
            {/* Tools */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  gap: 15,
                }}
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
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  gap: 15,
                }}
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
              onCanvasReady={() => setCanvaReady(true)}
              onStrokeEnd={handleStrokeEnd}
            />
          </ViewShot>
        </View>
      )}
    </>
  );
};

export default SketchCanvasContainer;

const styles = StyleSheet.create({});
