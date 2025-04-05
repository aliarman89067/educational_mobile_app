import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as Linking from "expo-linking";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { colors } from "@/constants/colors";

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
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
  );
};

export default Navbar;

const styles = StyleSheet.create({
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
});
