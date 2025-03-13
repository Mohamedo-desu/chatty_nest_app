import { Video } from "expo-av";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
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

import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import RichTextEditor from "@/components/RichTextEditor";
import { Colors } from "@/constants/Colors";
import { uploadMedia } from "@/services/uploadMedia";
import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { router } from "expo-router";

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

  // For storing the post text
  const bodyRef = useRef<string>("");
  // Replace unknown with a proper ref type if available from RichTextEditor
  const editorRef = useRef<unknown>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<MediaFile>(null);
  const [postType, setPostType] = useState<"public" | "private">("public");

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
        console.log("Picked file:", result.assets[0]);
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking media:", error);
    }
  };

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      if (!bodyRef.current && !file) {
        Alert.alert("Error", "Please enter some text or select a file.");
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
        console.log("Post created:", data);
        // Reset the post upon successful creation
        bodyRef.current = "";
        setFile(null);
        editorRef.current?.setContentHTML("");
        router.back();
      }
    } catch (error) {
      console.error("Error submitting post:", error);
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
            <Video
              source={{ uri: file.uri }}
              style={{ flex: 1 }}
              resizeMode="cover"
              useNativeControls
              isLooping
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
        <CustomText style={styles.mediaText}>Add to your post</CustomText>
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
        <CustomText style={styles.postTypeTitle}>Post Type:</CustomText>
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
              Public
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
              Private
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.spacer} />
      <CustomButton text="Post" loading={loading} onPress={onSubmit} />
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
