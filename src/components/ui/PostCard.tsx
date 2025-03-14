import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { downloadFile } from "@/services/mediaServices";
import { createPostLike, removePostLike } from "@/services/postService";
import { usePostStore } from "@/store/postStore"; // Import the store
import { DEVICE_WIDTH } from "@/utils/device";
import { shortenNumber, stripHtmlTags } from "@/utils/functions";
import { formatRelativeTime } from "@/utils/timeUtils";
import { Image, ImageBackground } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ShareIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import RenderHTML from "react-native-render-html";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "../CustomText";

interface User {
  user_id: string | number;
  photo_url: string;
  display_name: string;
  user_name: string;
}

interface PostLike {
  user_id: string | number;
}

interface Comment {
  [key: string]: any;
}

interface Post {
  id: string | number;
  file: string;
  post_likes: PostLike[];
  user: User;
  created_at: string;
  body?: string;
  comments: Comment[];
}

interface PostCardProps {
  item: Post;
  currentUser: User;
  router: any;
  isDetails: boolean; // Replace with a more specific type if available
}

const getTagsStyles = (theme: any) => ({
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

const PostCard: FC<PostCardProps> = ({
  item,
  currentUser,
  router,
  isDetails = false,
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const isVideo = item.file && item.file.includes("videos");
  const isImage = item.file && item.file.includes("images");
  const [photoModalVisible, setPhotoModalVisible] = useState<boolean>(false);
  const [likes, setLikes] = useState<PostLike[]>([]);
  const [loading, setLoading] = useState(false);

  // Get the updatePost action from the store.
  const { updatePost } = usePostStore();

  useEffect(() => {
    setLikes(item.post_likes);
  }, [item.post_likes]);

  const player = isVideo
    ? useVideoPlayer(item.file, (playerInstance: any) => {
        playerInstance.loop = true;
        playerInstance.play();
        playerInstance.generateThumbnailsAsync(0);
      })
    : null;

  const handleLike = async (): Promise<void> => {
    try {
      if (liked) {
        // Remove like locally.
        const updatedLikes = likes.filter(
          (like) => like.user_id !== currentUser.user_id
        );
        setLikes(updatedLikes);
        // Update the global store.
        updatePost({ ...item, post_likes: updatedLikes });
        await removePostLike(item.id, currentUser.user_id);
      } else {
        // Create a new like entry.
        const data: PostLike & { post_id: string | number } = {
          user_id: currentUser.user_id,
          post_id: item.id,
        };
        const updatedLikes = [...likes, data];
        setLikes(updatedLikes);
        // Update the global store.
        updatePost({ ...item, post_likes: updatedLikes });
        await createPostLike(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = async () => {
    try {
      setLoading(true);
      let content = { message: stripHtmlTags(item.body) };
      if (item.file) {
        let url = await downloadFile(item.file);
        content.url = url;
        setLoading(false);
      }
      Share.share({
        url: content.url,
        message: content.message,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleOpenPostDetails = () => {
    if (isDetails) return;
    router.push({
      pathname: "/post_details",
      params: { postId: item.id },
    });
  };

  const liked = useMemo(
    () => likes?.find((like) => like.user_id === currentUser.user_id),
    [likes, currentUser.user_id]
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
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
            <View style={{ gap: 2 }}>
              <CustomText style={styles.displayName}>
                {item.user.display_name}
              </CustomText>
              <CustomText style={styles.userName}>
                @{item.user.user_name}
              </CustomText>
              <CustomText style={styles.postTime}>
                {formatRelativeTime(item.created_at)}
              </CustomText>
            </View>
          </View>
          {!isDetails && (
            <TouchableOpacity onPress={handleOpenPostDetails}>
              <EllipsisHorizontalIcon
                size={RFValue(20)}
                color={theme.Colors.gray[500]}
              />
            </TouchableOpacity>
          )}
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
            <TouchableOpacity onPress={handleLike}>
              <HeartIcon
                size={RFValue(20)}
                color={liked ? theme.Colors.primary : theme.Colors.gray[500]}
              />
            </TouchableOpacity>
            <CustomText style={styles.count}>
              {shortenNumber(likes?.length)}
            </CustomText>
          </View>
          <View style={styles.footerButton}>
            <TouchableOpacity onPress={handleOpenPostDetails}>
              <ChatBubbleBottomCenterTextIcon
                size={RFValue(20)}
                color={theme.Colors.gray[500]}
              />
            </TouchableOpacity>
            <CustomText style={styles.count}>
              {shortenNumber(item?.post_comments[0]?.count)}
            </CustomText>
          </View>
          <View style={styles.footerButton}>
            <TouchableOpacity onPress={handleShare}>
              {loading ? (
                <ActivityIndicator size={"small"} color={Colors.primary} />
              ) : (
                <ShareIcon size={RFValue(20)} color={theme.Colors.gray[500]} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        transparent
        visible={photoModalVisible}
        onDismiss={() => setPhotoModalVisible(false)}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <ImageBackground
            source={{ uri: item.user.photo_url }}
            contentFit="cover"
            style={styles.modalImageBackground}
            transition={100}
          >
            <View style={styles.modalImageOverlay}>
              <CustomText style={styles.modalNameText}>
                {item.user.display_name}
              </CustomText>
              <Pressable
                style={styles.closeIcon}
                hitSlop={10}
                onPress={() => setPhotoModalVisible(false)}
              >
                <XMarkIcon size={RFValue(20)} color={Colors.error} />
              </Pressable>
            </View>
          </ImageBackground>
        </View>
      </Modal>
    </>
  );
};

export default PostCard;

const stylesheet = createStyleSheet((theme, rt) => ({
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
  content: {
    // Additional content styles if needed
  },
  postBody: { marginBottom: 10 },
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
  displayName: {
    fontSize: RFValue(13),
    fontFamily: Fonts.Medium,
  },
  userName: {
    fontSize: RFValue(12),
    color: theme.Colors.gray[400],
  },
  postTime: {
    fontSize: RFValue(10),
    color: theme.Colors.gray[400],
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  closeIcon: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5,
    borderRadius: 100,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  count: {
    fontSize: RFValue(12),
    color: theme.Colors.typography,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.black,
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImageBackground: {
    width: "100%",
    height: "100%",
  },
  modalImageOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    marginTop: rt.insets.top,
  },
  modalNameText: {
    fontSize: RFValue(20),
    fontFamily: Fonts.Medium,
    textTransform: "capitalize",
    color: Colors.white,
  },
  modalIconContainer: {},
}));
