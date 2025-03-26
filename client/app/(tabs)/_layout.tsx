import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import {
  friendsImage,
  historyImage,
  homeImage,
  profileImage,
} from "@/constants/images";
import { useAuth } from "@clerk/clerk-expo";
import { colors } from "@/constants/colors";

interface TabBarIconProps {
  focused: boolean;
  icon: HTMLImageElement;
  label?: string;
}

const TabBarIcon = ({ focused, icon, label }: TabBarIconProps) => {
  return (
    <View style={styles.tabBarIconContainer}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={focused ? colors.primary : colors.grayDark}
        style={{ width: 22, height: 22 }}
      />
      <Text
        style={[
          styles.tabBarIconLabel,
          { color: focused ? colors.primary : colors.grayDark },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)"} />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarContainer,
      }}
    >
      <Tabs.Screen
        key={1}
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} label="Home" icon={homeImage} />
          ),
        }}
      />
      <Tabs.Screen
        key={2}
        name="history"
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} label="History" icon={historyImage} />
          ),
        }}
      />
      <Tabs.Screen
        key={3}
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} label="Profile" icon={profileImage} />
          ),
        }}
      />
      <Tabs.Screen
        key={4}
        name="friends"
        options={{
          tabBarLabel: "Friends",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} label="Friends" icon={friendsImage} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: "transparent",
    shadowColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    borderTopColor: "transparent",
    borderTopWidth: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 55,
  },
  tabBarIconContainer: {
    alignItems: "center",
    marginTop: -10,
  },
  tabBarIconLabel: {
    fontSize: 12,
    width: "100%",
  },
});
