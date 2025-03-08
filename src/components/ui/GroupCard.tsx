import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GROUPPROPS } from "@/types/chat";
import { capitalizeWords } from "@/utils/functions";
import { formatRelativeTime } from "@/utils/timeUtils";
import { useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "../CustomText";
// If you're using an Avatar component from a library, ensure it's imported correctly:

const GroupCard = ({ item }: { item: GROUPPROPS }) => {
  const { theme, styles } = useStyles(stylesheet);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const unseenMessages = 0;

  const uid = useUser().user?.id;
  const sentByMe = item.lastMessage.user.uid === uid;
  const messageSeen = item.lastMessage.seen.length > 0;

  const router = useRouter();

  return (
    <>
      <View style={styles.groupCard}>
        <TouchableOpacity
          style={styles.photoContainer}
          onPress={() => setPhotoModalVisible(true)}
        >
          <Image
            source={{ uri: item.photo_url }}
            contentFit="cover"
            style={styles.photo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() =>
            router.navigate({
              pathname: "/(authenticated)/group_details",
              params: { gid: item.gid },
            })
          }
        >
          <View style={styles.headerRow}>
            <CustomText
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {capitalizeWords(item.title || "Empty title")}
            </CustomText>
            <CustomText style={styles.time}>
              {formatRelativeTime(item.lastMessage.created_at)}
            </CustomText>
          </View>
          <View style={styles.messageRow}>
            {item.lastMessage.user.uid !== uid && (
              <Image
                source={{
                  uri: item.lastMessage?.user?.photo_url,
                }}
                contentFit="cover"
              />
            )}
            <CustomText
              style={[
                styles.lastMessage,
                {
                  color:
                    sentByMe || messageSeen
                      ? theme.Colors.gray[500]
                      : theme.Colors.typography,
                },
              ]}
              numberOfLines={1}
            >
              {item.lastMessage.user.uid === uid && "You : "}
              {item.lastMessage.text || "Err message"}
            </CustomText>
            {sentByMe ? (
              messageSeen ? (
                <MaterialCommunityIcons
                  name="check-all"
                  size={moderateScale(18)}
                  color={Colors.primary[500]}
                />
              ) : item.lastMessage.received ? (
                <MaterialCommunityIcons
                  name="check-all"
                  size={moderateScale(18)}
                  color={theme.Colors.gray[500]}
                />
              ) : item.lastMessage.sent ? (
                <MaterialCommunityIcons
                  name="check"
                  size={moderateScale(18)}
                  color={theme.Colors.gray[500]}
                />
              ) : null
            ) : (
              unseenMessages > 0 && (
                <View style={styles.unSeenCon}>
                  <CustomText style={styles.unSeenConText} variant="h7">
                    {unseenMessages > 99 ? "99+" : unseenMessages}
                  </CustomText>
                </View>
              )
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={photoModalVisible}
        onDismiss={() => setPhotoModalVisible(false)}
        animationType="fade"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setPhotoModalVisible(false)}
          style={styles.photoModalOverlay}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.photoModalContainer}
          >
            <ImageBackground
              source={{ uri: item.photo_url || PLACE_HOLDER }}
              contentFit="contain"
              style={[
                styles.fullSize,
                { elevation: 1, backgroundColor: Colors.primary[300] },
              ]}
            >
              <View style={styles.photoModalTitleContainer}>
                <CustomText style={styles.photoModalTitleText}>
                  {item.title || "Empty title"}
                </CustomText>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default memo(GroupCard);

const stylesheet = createStyleSheet((theme) => ({
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: theme.Colors.gray[100],
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(10),
    borderRadius: 5,
  },
  photoContainer: {
    width: moderateScale(40),
    aspectRatio: 1,
    borderRadius: moderateScale(20),
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  fullSize: {
    width: "100%",
    height: "100%",
  },
  photoModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  photoModalContainer: {
    width: "90%",
    height: "70%",
  },
  photoModalTitleContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: moderateScale(3),
  },
  photoModalTitleText: {
    fontSize: RFValue(18),
    fontFamily: Fonts.Medium,
    textTransform: "capitalize",
    color: Colors.white,
  },

  contentContainer: {
    flex: 1,
    marginLeft: 10,
    gap: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: RFValue(16),
    fontFamily: Fonts.SemiBold,
    flex: 1,
  },
  time: {
    fontSize: RFValue(10),
    fontFamily: Fonts.Regular,
    color: Colors.primary,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  lastMessage: {
    fontSize: RFValue(13),
    fontFamily: Fonts.Medium,
    flex: 1,
  },
  unSeenCon: {
    backgroundColor: Colors.primary[500],
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    width: moderateScale(22),
    aspectRatio: 1,
  },
  unSeenConText: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Regular,
    color: Colors.white,
  },
}));
