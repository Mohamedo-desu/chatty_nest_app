import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import RichTextEditor from "@/components/RichTextEditor";
import { Colors } from "@/constants/Colors";
import { getSupabaseFileUrl } from "@/services/imageServices";
import { createOrUpdatePost } from "@/services/postService";
import { useUserStore } from "@/store/userStore";
import { Video } from "expo-av";
import { Image } from "expo-image";
import type { ImagePickerAsset } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import { Alert, Pressable, TouchableOpacity, View } from "react-native";
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type MediaFile = string | ImagePickerAsset | null;

const AddNewPostScreen: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { currentUser } = useUserStore();

  // A ref to hold the editor content (rich text content as string)
  const bodyRef = useRef<string>("");
  // Editor ref: adjust the type if RichTextEditor exposes a proper ref interface
  const editorRef = useRef<any>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<MediaFile>(null);

  const onPick = async (isImage: boolean): Promise<void> => {
    try {
      let mediaConfig: ImagePicker.ImagePickerOptions = {
        mediaTypes: isImage ? ["images"] : ["videos"],
        allowsEditing: true,
        quality: 0.7,
        // Only images need an aspect ratio option
        ...(isImage && { aspect: [4, 3] }),
      };

      const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log("file", result.assets[0]);
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking media:", error);
    }
  };

  const onSubmit = async (): Promise<void> => {
    try {
      if (!bodyRef.current && !file) {
        Alert.alert("Error", "Please enter some text or select a file.");
        return;
      }

      let data = {
        file,
        body: bodyRef.current,
        user_id: currentUser?.user_id,
      };

      setLoading(true);
      let res = await createOrUpdatePost(data);
      setLoading(false);
      console.log("res", res);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  // Type predicate to check if file is a local file (an object)
  const isLocalFile = (file: MediaFile): file is ImagePickerAsset => {
    return !!file && typeof file === "object";
  };

  const getFileType = (file: MediaFile): string | undefined => {
    if (!file) return undefined;

    if (isLocalFile(file)) {
      return file.type;
    }

    // For remote files stored in Supabase
    if (typeof file === "string" && file.includes("postImage")) {
      return "image";
    }
    return "video";
  };

  const getFileUri = (file: MediaFile): string | undefined => {
    if (!file) return undefined;
    if (isLocalFile(file)) {
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;
  };

  return (
    <View style={styles.page}>
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
          {getFileType(file) === "video" ? (
            <Video
              source={{ uri: getFileUri(file) as string }}
              style={{ flex: 1 }}
              resizeMode="cover"
              useNativeControls
              isLooping
            />
          ) : (
            <Image
              source={{ uri: getFileUri(file) as string }}
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
        <CustomText>Add to your post</CustomText>
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
      <CustomButton text="Submit" loading={loading} onPress={onSubmit} />
    </View>
  );
};

export default AddNewPostScreen;

const stylesheet = createStyleSheet((theme, rt) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
    padding: 15,
    gap: 10,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderCurve: "continuous",
    borderColor: theme.Colors.gray[200],
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
  video: {},
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5,
    borderRadius: 100,
  },
}));
