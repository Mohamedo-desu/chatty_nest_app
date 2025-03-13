import { DEVICE_WIDTH } from "@/utils/device";
import { shortenNumber } from "@/utils/functions";
import { formatRelativeTime } from "@/utils/timeUtils";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import {
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ShareIcon,
} from "react-native-heroicons/solid";
import RenderHTML from "react-native-render-html";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "../CustomText";

const getTagsStyles = (theme) => ({
  div: {
    color: theme.Colors.typography,
    fontSize: RFValue(12),
  },
  p: {
    color: theme.Colors.typography,
    fontSize: RFValue(12),
  },
  ol: {
    color: theme.Colors.typography,
    fontSize: RFValue(12),
  },
  h1: {
    color: theme.Colors.typography,
  },
  h4: {
    color: theme.Colors.typography,
  },
});

const PostCard = ({ item, currentUser, router }) => {
  const { styles, theme } = useStyles(stylesheet);
  const isVideo = item.file && item.file.includes("videos");
  const isImage = item.file && item.file.includes("images");

  const player = isVideo
    ? useVideoPlayer(item.file, (playerInstance) => {
        playerInstance.loop = true;
        playerInstance.play();
        playerInstance.generateThumbnailsAsync(0);
      })
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => {}} style={styles.photoContainer}>
            <Image
              source={{ uri: item.user.photo_url }}
              contentFit="cover"
              style={styles.photo}
            />
          </TouchableOpacity>
          <View style={{ gap: 2 }}>
            <CustomText>{item.user.display_name}</CustomText>
            <CustomText style={styles.postTime}>
              @{item.user.user_name}
            </CustomText>
            <CustomText style={styles.postTime}>
              {formatRelativeTime(item.created_at)}
            </CustomText>
          </View>
        </View>
        <TouchableOpacity>
          <EllipsisHorizontalIcon
            size={RFValue(20)}
            color={theme.Colors.gray[500]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item.body && (
            <RenderHTML
              contentWidth={DEVICE_WIDTH}
              source={{ html: item.body }}
              tagsStyles={getTagsStyles(theme)}
            />
          )}
        </View>
        {isImage && (
          <Image
            source={{ uri: item.file }}
            contentFit="cover"
            transition={100}
            style={styles.postMedia}
          />
        )}
        {isVideo && player && (
          <VideoView
            style={styles.videoPlayer}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <HeartIcon size={RFValue(20)} color={theme.Colors.primary} />
          </TouchableOpacity>
          <CustomText style={styles.count}>
            {shortenNumber(item.likes?.length)}
          </CustomText>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <ChatBubbleBottomCenterTextIcon
              size={RFValue(20)}
              color={theme.Colors.typography}
            />
          </TouchableOpacity>
          <CustomText style={styles.count}>
            {shortenNumber(item.comments?.length)}
          </CustomText>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <ShareIcon size={RFValue(20)} color={theme.Colors.typography} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: 10,
    borderRadius: 8,
    borderCurve: "continuous",
    padding: 10,
    backgroundColor: theme.Colors.gray[100],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  photoContainer: {
    width: moderateScale(40),
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  postBody: {},
  postMedia: {
    height: moderateScale(300),
    width: "100%",
    borderRadius: 8,
    borderCurve: "continuous",
  },
  videoPlayer: {
    height: moderateScale(300),
    width: "100%",
    borderRadius: 8,
    borderCurve: "continuous",
  },
  postTime: {
    fontSize: RFValue(10),
    color: theme.Colors.gray[400],
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  count: {
    fontSize: RFValue(12),
    color: theme.Colors.typography,
  },
}));
