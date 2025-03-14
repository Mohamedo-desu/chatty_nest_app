import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import RichTextEditor from "@/components/RichTextEditor";
import { showToast } from "@/components/toast/ShowToast";
import { Colors } from "@/constants/Colors";
import { uploadMedia } from "@/services/mediaServices";
import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useRef, useState } from "react";
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

// Narrow the file type to the asset returned from ImagePicker
type MediaFile = ImagePicker.ImagePickerAsset | null;

interface PostBodyData {
  file: string;
  body: string;
  user_id: string;
  type: "public" | "private";
}

const AddNewPostScreen: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { currentUser } = useUserStore();

  const { t } = useTranslation();

  // For storing the post text
  const bodyRef = useRef<string>("");
  // Replace unknown with a proper ref type if available from RichTextEditor
  const editorRef = useRef<unknown>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<MediaFile>(null);
  const [postType, setPostType] = useState<"public" | "private">("public");

  const player =
    file && file.uri.includes("videos")
      ? useVideoPlayer(file.uri, (player) => {
          player.loop = true;
          player.play();
        })
      : null;

  const onPick = async (isImage: boolean): Promise<void> => {
    try {
      const mediaConfig: ImagePicker.ImagePickerOptions = {
        mediaTypes: isImage ? ["images"] : ["videos"],
        allowsEditing: true,
        quality: 0.7,
        // Only images need an aspect ratio option
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
  };

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      if (!bodyRef.current && !file) {
        Alert.alert(
          t("addPost.submitAlertError"),
          t("addPost.submitAlertErrorDesc")
        );
        return;
      }

      let postMediaUrl = "";
      if (file) {
        // Upload file if it is local, else use the existing URL.
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

      const bodyData: PostBodyData = {
        file: postMediaUrl,
        body: bodyRef.current,
        user_id: currentUser.user_id,
        type: postType,
      };

      const { data, error } = await client
        .from("posts")
        .upsert(bodyData)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Reset the post upon successful creation
        bodyRef.current = "";
        setFile(null);
        editorRef.current?.setContentHTML("");
        showToast(
          "success",
          t("addPost.submitSuccessTitle"),
          t("addPost.submitSuccessDesc")
        );
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
  };

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
      {file && (
        <View style={styles.file}>
          {file.type === "video" ? (
            <VideoView
              style={{ flex: 1, height: moderateScale(300) }}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          ) : (
            <Image
              source={{ uri: file.uri }}
              contentFit="cover"
              style={{ flex: 1 }}
            />
          )}
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
        text={t("addPost.submit")}
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
  /* New Post Type Styles */
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
