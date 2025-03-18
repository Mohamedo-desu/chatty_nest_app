import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { capitalizeWords } from "@/utils/functions";
import { formatRelativeTime } from "@/utils/timeUtils";
import { Image, ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";
import { ExclamationCircleIcon } from "react-native-heroicons/outline";
import {
  CheckCircleIcon,
  CheckIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "../CustomText";

const ChatCard = ({ item, currentUser }) => {
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const uid = currentUser.user_id;
  const router = useRouter();
  const { styles, theme } = useStyles(stylesheet);

  const getStatusIndicator = () => {
    const msg = item?.lastMessage;
    if (msg && msg.user?.id === uid) {
      if (msg.seen) {
        return (
          <CheckCircleIcon size={RFValue(20)} color={theme.Colors.success} />
        );
      } else if (msg.received) {
        return (
          <CheckIcon size={moderateScale(20)} color={theme.Colors.gray[300]} />
        );
      } else {
        return (
          <ExclamationCircleIcon
            size={moderateScale(20)}
            color={Colors.error}
          />
        );
      }
    } else if (item?.unseenCount > 0) {
      return (
        <View style={styles.badgeContainer}>
          <CustomText style={styles.badgeText}>{item.unseenCount}</CustomText>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <View style={styles.chatCard}>
        <TouchableOpacity
          onPress={() => setPhotoModalVisible(true)}
          style={styles.photoContainer}
        >
          <Image
            source={{ uri: item?.photo }}
            contentFit="cover"
            style={styles.photo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() =>
            router.navigate({
              pathname: "/chat_details",
              params: {
                conversationId: item?.conversation_id,
                name: item?.name,
                photo: item?.photo,
                push_tokens: JSON.stringify(item.push_tokens),
                other_user_id: item.otherUserId,
              },
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
                {capitalizeWords(item?.name)}
              </CustomText>
              <CustomText style={styles.timeText}>
                {formatRelativeTime(item?.lastMessageTime)}
              </CustomText>
            </View>
            <View style={styles.messageRow}>
              <CustomText
                style={styles.messageText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item?.lastMessage && item.lastMessage.user.id === uid && (
                  <CustomText style={styles.youText}>You : </CustomText>
                )}
                {item?.lastMessage?.text}
              </CustomText>
              {getStatusIndicator()}
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
        <View style={styles.modalBackground}>
          <ImageBackground
            source={{ uri: item.photo }}
            contentFit="cover"
            style={styles.modalImageBackground}
            transition={100}
          >
            <View style={styles.modalImageOverlay}>
              <CustomText style={styles.modalNameText}>{item.name}</CustomText>
              <Pressable
                style={styles.closeIcon}
                hitSlop={10}
                onPress={() => setPhotoModalVisible(false)}
              >
                <XMarkIcon size={RFValue(22)} color={Colors.error} />
              </Pressable>
            </View>
          </ImageBackground>
        </View>
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
  photo: { width: "100%", height: "100%" },
  contentContainer: { flex: 1, marginLeft: 10, gap: 5 },
  headerRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  nameText: { fontSize: RFValue(13), fontFamily: Fonts.SemiBold, flex: 1 },
  timeText: {
    fontSize: RFValue(10),
    fontFamily: Fonts.Regular,
    color: Colors.primary,
  },
  messageRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  messageText: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: Fonts.Regular,
    textTransform: "capitalize",
  },
  youText: { fontSize: RFValue(12), fontFamily: Fonts.Regular },
  badgeContainer: {
    backgroundColor: Colors.error,
    width: 20,
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: Colors.white,
    fontSize: RFValue(10),
    fontFamily: Fonts.Regular,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalImageBackground: {
    width: "100%",
    height: "100%",
    elevation: 1,
    backgroundColor: Colors.primary[300],
  },
  modalImageOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalNameText: {
    fontSize: RFValue(20),
    fontFamily: Fonts.Medium,
    textTransform: "capitalize",
    color: Colors.white,
  },
  closeIcon: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5,
    borderRadius: 100,
  },
}));
