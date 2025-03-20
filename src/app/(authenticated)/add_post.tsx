import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import RichTextEditor from "@/components/RichTextEditor";
import { showToast } from "@/components/toast/ShowToast";
import { Colors } from "@/constants/Colors";
import { uploadMedia } from "@/services/mediaServices";
import { deleteStorageFile } from "@/services/postService";
import { usePostStore } from "@/store/postStore";
import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Define TS types for the post and the editor ref
interface Post {
  id: string;
  file: string;
  body: string;
  type: "public" | "private";
  post_likes?: unknown[];
  post_comments?: Array<{ count: number }>;
}

interface RichTextEditorRef {
  setContentHTML: (html: string) => void;
}

type MediaFile = ImagePicker.ImagePickerAsset | null;

interface PostBodyData {
  id?: string;
  file: string;
  body: string;
  user_id: string;
  type: "public" | "private";
}

const AddNewPostScreen: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { currentUser } = useUserStore();
  const { updatePost } = usePostStore();
  const [post, setPost] = useState<Post | null>(null);

  // Retrieve postItem from local search params (should be a JSON string if editing)
  const { postItem } = useLocalSearchParams<{ postItem?: string }>();

  const { t } = useTranslation();

  // Refs for storing post body and editor instance
  const bodyRef = useRef<string>("");
  const editorRef = useRef<RichTextEditorRef | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<MediaFile>(null);
  const [postType, setPostType] = useState<"public" | "private">("public");

  // Always compute a videoUri (empty string if not applicable) to maintain hook order.
  const videoUri: string = file && file.type === "video" ? file.uri : "";
  const player = useVideoPlayer(videoUri, (playerInstance) => {
    if (videoUri) {
      playerInstance.loop = true;
    }
  });

  // Handle media selection from gallery
  const onPick = useCallback(async (isImage: boolean): Promise<void> => {
    try {
      const mediaConfig: ImagePicker.ImagePickerOptions = {
        mediaTypes: isImage ? ["images"] : ["videos"],
        allowsEditing: true,
        quality: 0.7,
        ...(isImage && { aspect: [4, 3] }),
      };

      const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (error: any) {
      console.error("Error picking media:", error);
      showToast("error", "Error", error.message);
    }
  }, []);

  // Parse postItem and set it to the post state
  useEffect(() => {
    if (postItem) {
      try {
        const parsedPost = JSON.parse(postItem);
        setPost(parsedPost);
      } catch (error) {
        console.error("Error parsing postItem:", error);
      }
    }
  }, [postItem]);

  // When post is loaded/updated (for editing), update fields accordingly.
  useEffect(() => {
    if (post && post.id) {
      const fileUri = post.file;
      const fileType: "video" | "image" = fileUri.includes("videos")
        ? "video"
        : "image";
      const fileName = fileUri.split("/").pop() ?? "unknown_file";

      setFile({ uri: fileUri, type: fileType, fileName });
      bodyRef.current = post.body;
      setPostType(post.type);

      // Delay setting content to allow the editor to mount.
      const timeoutId = setTimeout(() => {
        editorRef.current?.setContentHTML(post.body);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [post]);

  // Submit post creation or update
  const onSubmit = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // Validate that at least one field is provided.
      if (!bodyRef.current.trim() && !file) {
        Alert.alert(
          t("addPost.submitAlertError"),
          t("addPost.submitAlertErrorDesc")
        );
        setLoading(false);
        return;
      }

      let postMediaUrl = "";
      if (file) {
        // Upload the file if it's a local file; otherwise, use the existing URL.
        if (file.uri.startsWith("file://")) {
          postMediaUrl = await uploadMedia(
            file.uri,
            file.type === "video" ? "posts/videos" : "posts/images",
            file.fileName ?? "unknown_file"
          );
        } else {
          postMediaUrl = file.uri;
        }
      }

      // In update mode, if the file was changed (or removed), delete the previous file.
      if (post && post.file && post.file !== postMediaUrl) {
        await deleteStorageFile(post.file);
      }

      const bodyData: PostBodyData = {
        file: postMediaUrl,
        body: bodyRef.current,
        user_id: currentUser.user_id,
        type: postType,
      };

      if (post && post.id) {
        bodyData.id = post.id;
      }

      const { data, error } = await client
        .from("posts")
        .upsert(bodyData)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Reset fields upon success.
        bodyRef.current = "";
        setFile(null);
        editorRef.current?.setContentHTML("");
        showToast(
          "success",
          t("addPost.submitSuccessTitle"),
          post && post.id
            ? t("addPost.submitSuccessUpdateDesc")
            : t("addPost.submitSuccessAddDesc")
        );

        if (post && post.id) {
          // Update the post in store if it's an update.
          const updatedPost: Post = {
            ...post,
            body: bodyData.body,
            file: bodyData.file,
            type: bodyData.type,
            post_likes: Array.isArray(post.post_likes) ? post.post_likes : [],
            post_comments: [{ count: post.post_comments?.length ?? 0 }],
          };
          updatePost(updatedPost);
        }
        router.back();
      }
    } catch (error: any) {
      console.error("Error submitting post:", error);
      showToast(
        "error",
        t("addPost.submitErrorTitle"),
        t("addPost.submitErrorDesc")
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser.user_id, file, post, postType, t, updatePost]);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.userRow}>
        <TouchableOpacity onPress={() => {}} style={styles.photoContainer}>
          <Image
            source={{ uri: currentUser.photo_url }}
            contentFit="cover"
            style={styles.photo}
          />
        </TouchableOpacity>
        <View>
          <CustomText style={styles.name}>
            {currentUser.display_name}
          </CustomText>
          <CustomText style={styles.userName}>
            @{currentUser.user_name}
          </CustomText>
        </View>
      </View>
      <View style={styles.textEditor}>
        <RichTextEditor
          editorRef={editorRef}
          onChange={(body: string) => {
            bodyRef.current = body;
          }}
        />
      </View>
      {file?.uri && (
        <View style={styles.file}>
          {file.type === "video" ? (
            <VideoView
              style={{ flex: 1, height: moderateScale(300) }}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          ) : file.type === "image" ? (
            <Image
              source={{ uri: file.uri }}
              contentFit="cover"
              style={{ flex: 1 }}
            />
          ) : null}
          <Pressable
            style={styles.closeIcon}
            hitSlop={10}
            onPress={() => setFile(null)}
          >
            <XMarkIcon size={RFValue(20)} color={Colors.error} />
          </Pressable>
        </View>
      )}
      <View style={styles.mediaContainer}>
        <CustomText style={styles.mediaText}>
          {t("addPost.chooseMedia")}
        </CustomText>
        <View style={styles.mediaIcons}>
          <TouchableOpacity onPress={() => onPick(true)}>
            <PhotoIcon size={RFValue(30)} color={theme.Colors.typography} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPick(false)}>
            <VideoCameraIcon
              size={RFValue(30)}
              color={theme.Colors.typography}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Post type selection */}
      <View style={styles.postTypeContainer}>
        <CustomText style={styles.postTypeTitle}>
          {t("addPost.postType")}
        </CustomText>
        <View style={styles.postTypeButtons}>
          <TouchableOpacity
            onPress={() => setPostType("public")}
            style={[
              styles.postTypeButton,
              postType === "public" && styles.selectedPostTypeButton,
            ]}
          >
            <CustomText
              style={[
                styles.postTypeText,
                postType === "public" && styles.selectedPostTypeText,
              ]}
            >
              {t("addPost.public")}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPostType("private")}
            style={[
              styles.postTypeButton,
              postType === "private" && styles.selectedPostTypeButton,
            ]}
          >
            <CustomText
              style={[
                styles.postTypeText,
                postType === "private" && styles.selectedPostTypeText,
              ]}
            >
              {t("addPost.private")}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.spacer} />
      <CustomButton
        text={post?.id ? t("addPost.update") : t("addPost.post")}
        loading={loading}
        onPress={onSubmit}
      />
    </ScrollView>
  );
};

export default AddNewPostScreen;

const stylesheet = createStyleSheet((theme, rt) => ({
  page: {
    flex: 1,
  },
  scrollContainer: {
    padding: 15,
    gap: 10,
    paddingBottom: rt.insets.bottom + 10,
    backgroundColor: theme.Colors.background,
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
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userName: {
    color: theme.Colors.gray[400],
  },
  name: {},
  textEditor: {
    marginTop: 20,
  },
  mediaContainer: {
    backgroundColor: theme.Colors.gray[100],
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  mediaText: {
    flex: 1,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  file: {
    height: 200,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    borderCurve: "continuous",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5,
    borderRadius: 100,
  },
  postTypeContainer: {
    marginVertical: 10,
  },
  postTypeTitle: {
    marginBottom: 5,
    fontWeight: "600",
  },
  postTypeButtons: {
    flexDirection: "row",
    gap: 10,
  },
  postTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.Colors.gray[300],
    borderRadius: 5,
  },
  selectedPostTypeButton: {
    backgroundColor: theme.Colors.primary,
    borderColor: theme.Colors.primary,
  },
  postTypeText: {
    color: theme.Colors.typography,
  },
  selectedPostTypeText: {
    color: theme.Colors.white,
  },
  spacer: {
    flex: 1,
  },
}));
