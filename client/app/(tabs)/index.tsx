import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { colors } from "@/constants/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { fontFamily } from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import {
  joinQuizImage,
  joinQuizSideImage,
  onlineQuizImage,
  onlineQuizSideImage,
  soloQuizImage,
  soloQuizSideImage,
} from "@/constants/images";
import * as Linking from "expo-linking";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <View style={styles.tabBarContainer}>
          <TouchableOpacity activeOpacity={0.7}>
            <Entypo name="menu" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.7}
            style={styles.profileContainer}
          >
            <Image
              source={{ uri: user?.imageUrl }}
              alt="User Profile Image"
              style={styles.userProfileImage}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.bodyContainer}>
            <Text style={styles.playText}>Let&apos;s Play</Text>
            <View style={styles.contentContainer}>
              <LinearGradient
                style={styles.box}
                colors={["#ff4d6d", "#ff758f"]}
                start={{ x: 0, y: 0 }}
              >
                <View style={styles.boxContent}>
                  <Text style={styles.boxTitle}>Online Quiz</Text>
                  <View style={styles.boxImageContainer}>
                    <Image
                      source={onlineQuizImage}
                      alt="Online quiz image"
                      style={styles.boxImage}
                    />
                  </View>
                  <TouchableOpacity style={styles.boxPlayButton}>
                    <Text style={styles.boxPlayText}>Play</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={onlineQuizSideImage}
                  alt="Parachut Image"
                  style={styles.boxSideImage}
                />
              </LinearGradient>
              <LinearGradient
                style={styles.box}
                colors={["#0096c7", "#12c0d8"]}
                start={{ x: 0, y: 0 }}
              >
                <View style={styles.boxContent}>
                  <Text style={styles.boxTitle}>Solo Quiz</Text>
                  <View style={styles.boxImageContainer}>
                    <Image
                      source={soloQuizImage}
                      alt="Solo quiz image"
                      style={styles.boxImage}
                    />
                  </View>
                  <TouchableOpacity style={styles.boxPlayButton}>
                    <Text style={styles.boxPlayText}>Play</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={soloQuizSideImage}
                  alt="Joystick Image"
                  style={styles.boxSideImage}
                />
              </LinearGradient>
              <LinearGradient
                style={styles.box}
                colors={["#9d4edd", "#c77dff"]}
                start={{ x: 0, y: 0 }}
              >
                <View style={styles.boxContent}>
                  <Text style={styles.boxTitle}>Join Friend</Text>
                  <View style={styles.boxImageContainer}>
                    <Image
                      source={joinQuizImage}
                      alt="Solo quiz image"
                      style={styles.boxImage}
                    />
                  </View>
                  <TouchableOpacity style={styles.boxPlayButton}>
                    <Text style={styles.boxPlayText}>Play</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={joinQuizSideImage}
                  alt="Join Game Image"
                  style={styles.boxSideImage}
                />
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  tabBarContainer: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },
  profileContainer: {
    width: 30,
    height: 30,
    borderRadius: 100,
    overflow: "hidden",
  },
  userProfileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 100,
  },
  bodyContainer: {
    gap: 5,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  contentContainer: {
    gap: 30,
    width: "100%",
    height: "100%",
    flex: 1,
    marginTop: 20,
  },
  playText: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fontFamily.Bold,
  },
  box: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  boxContent: {
    gap: 4,
  },
  boxTitle: {
    color: "#fff",
    fontFamily: fontFamily.Bold,
    fontSize: 16,
  },
  boxImageContainer: {
    height: 50,
    width: 100,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  boxImage: {
    height: 50,
    width: 80,
    resizeMode: "contain",
  },
  boxPlayButton: {
    paddingVertical: 15,
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  boxPlayText: {
    color: "#333",
    fontSize: 16,
    fontFamily: fontFamily.Medium,
  },
  boxSideImage: {
    width: "50%",
    resizeMode: "contain",
    transform: [{ translateY: -20 }],
  },
});
