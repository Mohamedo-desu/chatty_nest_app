import { Colors } from "@/constants/Colors";
import { IMessage } from "@/types";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Modal, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Import Heroicons from react native heroicons
import { Fonts } from "@/constants/Fonts";
import { capitalizeWords } from "@/utils/functions";
import { formatRelativeTime } from "@/utils/timeUtils";
import { ExclamationCircleIcon } from "react-native-heroicons/outline";
import { CheckCircleIcon, CheckIcon } from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "../CustomText";

const ChatCard = ({ item }: { item: IMessage }) => {
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const myName = "Isra";
  const router = useRouter();
  const { styles, theme } = useStyles(stylesheet);

  return (
    <>
      <View style={styles.chatCard}>
        <TouchableOpacity
          onPress={() => setPhotoModalVisible(true)}
          style={styles.photoContainer}
        >
          <Image
            source={{ uri: item.photo }}
            contentFit="cover"
            style={styles.photo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() =>
            router.navigate({
              pathname: "/chat_details",
              params: { ...item },
            })
          }
        >
          <>
            <View style={styles.headerRow}>
              <CustomText
                style={styles.nameText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {capitalizeWords(item.name)}
              </CustomText>
              <CustomText style={styles.timeText}>
                {formatRelativeTime(item.lastMessageTime)}
              </CustomText>
            </View>
            <View style={styles.messageRow}>
              <CustomText
                style={styles.messageText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.lastMessage.user.name === myName && (
                  <CustomText style={styles.youText}>You : </CustomText>
                )}
                {item.lastMessage.text}
              </CustomText>

              {myName !== item.lastMessage.user.name ? (
                <View style={styles.unreadBadge}>
                  <CustomText style={styles.unreadText} variant="h7">
                    5
                  </CustomText>
                </View>
              ) : item.lastMessage.seen ? (
                <CheckCircleIcon
                  size={RFValue(20)}
                  color={theme.Colors.success}
                />
              ) : item.lastMessage.received ? (
                <CheckIcon
                  size={moderateScale(20)}
                  color={theme.Colors.gray[300]}
                />
              ) : (
                <ExclamationCircleIcon
                  size={moderateScale(20)}
                  color={Colors.error}
                />
              )}
            </View>
          </>
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
          style={styles.modalBackground}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.modalContentContainer}
          >
            <ImageBackground
              source={{ uri: item.photo }}
              resizeMode="contain"
              style={styles.modalImageBackground}
            >
              <View style={styles.modalImageOverlay}>
                <CustomText style={styles.modalNameText}>
                  {item.name}
                </CustomText>
              </View>
            </ImageBackground>
            <View style={styles.modalIconContainer}>
              <CheckCircleIcon
                size={moderateScale(32)}
                color={Colors.primary}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ChatCard;

const stylesheet = createStyleSheet((theme, rt) => ({
  chatCard: {
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
  nameText: {
    fontSize: RFValue(16),
    fontFamily: Fonts.SemiBold,
    flex: 1,
  },
  timeText: {
    fontSize: RFValue(10),
    fontFamily: Fonts.Regular,
    color: Colors.primary,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  messageText: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: Fonts.Regular,
    textTransform: "capitalize",
  },
  youText: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Regular,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    height: moderateScale(6),
    width: 20,
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: Colors.white,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalContentContainer: {
    width: "90%",
    height: "70%",
    position: "relative", // Absolute children are positioned relative to this container
  },
  modalImageBackground: {
    width: "100%",
    height: "100%",
    elevation: 1,
    backgroundColor: Colors.primary[300],
  },
  modalImageOverlay: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: moderateScale(1),
  },
  modalNameText: {
    fontSize: RFValue(20),
    fontFamily: Fonts.Medium,
    textTransform: "capitalize",
    color: Colors.white,
  },
  modalIconContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.white,
    width: "100%",
    padding: moderateScale(3),
    justifyContent: "center",
    alignItems: "center",
  },
}));
