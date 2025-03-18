import { Fonts } from "@/constants/Fonts";
import { formatRelativeTime } from "@/utils/timeUtils";
import { Image } from "expo-image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, TouchableOpacity, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "../CustomText";

const CommentCard = ({
  item,
  onDelete,
  highlight = false,
  canDelete = false,
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const [photoModalVisible, setPhotoModalVisible] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleDeleteComment = () => {
    Alert.alert(
      t("commentCard.alertDeleteTitle"),
      t("commentCard.alertDeleteDescription"),
      [
        {
          text: t("commentCard.alertDeleteYes"),
          onPress: () => onDelete(),
        },
        {
          text: t("commentCard.alertDeleteNo"),
          onPress: undefined,
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setPhotoModalVisible(true)}
        style={styles.photoContainer}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.user.photo_url }}
          contentFit="cover"
          style={styles.photo}
        />
      </TouchableOpacity>
      <View style={styles.content(highlight)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.nameContainer}>
            <CustomText style={styles.displayName}>
              {item.user.display_name}
            </CustomText>
            <CustomText
              style={{ fontSize: RFValue(5), color: theme.Colors.gray[300] }}
            >
              ●
            </CustomText>
            <CustomText style={styles.postTime}>
              {formatRelativeTime(item.created_at)}
            </CustomText>
          </View>
          {canDelete && (
            <TouchableOpacity onPress={handleDeleteComment} activeOpacity={0.8}>
              <XMarkIcon size={RFValue(20)} color={theme.Colors.error} />
            </TouchableOpacity>
          )}
        </View>
        <CustomText style={styles.commentText}>{item.text}</CustomText>
      </View>
    </View>
  );
};

export default CommentCard;

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 7,
  },
  content: (highlight) => ({
    flex: 1,
    gap: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    borderCurve: "continuous",
    backgroundColor: theme.Colors.gray[100],
    borderWidth: highlight ? 0.5 : 0,
    borderStyle: highlight ? "dashed" : "solid",
    borderColor: theme.Colors.primary,
    elevation: highlight ? 3 : 0,
  }),

  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  photoContainer: {
    width: moderateScale(30),
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  displayName: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Regular,
    color: theme.Colors.gray[400],
  },
  postTime: {
    fontSize: RFValue(10),
    color: theme.Colors.gray[300],
  },
  commentText: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Medium,
    color: theme.Colors.typography,
  },
}));
