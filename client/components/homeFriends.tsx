import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { fontFamily } from "@/constants/fonts";
import { colors } from "@/constants/colors";
import { friends } from "@/constants";
import { starFill } from "@/constants/images";

const HomeFriends = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Friends</Text>
      <View style={styles.contentContainer}>
        {friends.map((friend, index) => (
          <View key={index}>
            <View style={styles.friendBox}>
              <View style={styles.friendProfileBox}>
                <Image
                  source={friend.image}
                  alt={`${friend.name} Profile Image`}
                  style={styles.friendImage}
                />
                <View style={styles.friendDetailsBox1}>
                  <View style={styles.flexRowCenter}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Image
                      source={friend.countryFlag}
                      alt="Country Flag Image"
                      style={styles.flagImg}
                    />
                  </View>
                  <View style={styles.friendDetailsBox2}>
                    <Text style={styles.friendStudyFieldText}>
                      {friend.studyField}
                    </Text>
                    <View style={[styles.flexRowCenter, { gap: 1 }]}>
                      <Image
                        source={starFill}
                        alt="Star Fill Image"
                        style={styles.rankingStarImg}
                      />
                      <Text style={styles.friendRankingText}>
                        {friend.ranking} Ranking
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity activeOpacity={0.7} style={styles.button}>
                  <Text style={styles.buttonText}>Request Match</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={styles.button}>
                  <Text style={styles.buttonText}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
            {index !== friends.length - 1 && (
              <View style={styles.separatorLine}></View>
            )}
          </View>
        ))}
      </View>
      <TouchableOpacity activeOpacity={0.7} style={styles.allFriendButton}>
        <Text style={styles.allFriendText}>See All Friends</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeFriends;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 30,
  },
  heading: {
    fontSize: 18,
    fontFamily: fontFamily.Medium,
    color: colors.grayDark,
  },
  contentContainer: {
    gap: 25,
    width: "100%",
    height: "100%",
    flex: 1,
    marginTop: 10,
  },
  friendBox: {
    gap: 10,
  },
  friendProfileBox: {
    flexDirection: "row",
    gap: 3,
  },
  friendImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: 7,
  },
  friendDetailsBox1: {
    gap: 4,
    width: 180,
  },
  friendDetailsBox2: {
    gap: 2,
  },
  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  flagImg: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  friendName: {
    color: colors.grayLight,
    fontSize: 18,
    fontFamily: fontFamily.Medium,
  },
  friendStudyFieldText: {
    color: colors.grayLight,
    fontSize: 13,
    fontFamily: fontFamily.Regular,
  },
  rankingStarImg: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  friendRankingText: {
    color: colors.grayLight,
    fontSize: 13,
    fontFamily: fontFamily.Regular,
  },
  buttonContainer: {
    gap: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    backgroundColor: colors.grayLight,
    width: 140,
    paddingVertical: 18,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 13,
    fontFamily: fontFamily.Regular,
  },
  separatorLine: {
    width: "100%",
    height: 1.5,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
  },
  allFriendButton: {
    backgroundColor: colors.purple,
    width: 250,
    paddingVertical: 22,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: "auto",
  },
  allFriendText: {
    color: "white",
    fontSize: 14,
    fontFamily: fontFamily.Medium,
  },
});
