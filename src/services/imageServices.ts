import { client } from "@/supabase/config";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

export const getUserImageSrc = (imagePath) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return require("@/assets/images/defaultUser.png");
  }
};

export const getSupabaseFileUrl = (filePath) => {
  if (filePath) {
    return {
      uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`,
    };
  }

  return null;
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    let fileName = getFilePath(folderName, isImage);

    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let imageData = decode(fileBase64);
    let { data, error } = await client.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: true,
        contentType: isImage ? "image/*" : "video/*",
      });

    if (error) {
      throw error;
    }
    console.log(data);

    return data.path;
  } catch (error) {
    console.log(error);
  }
};

export const getFilePath = (folderName, isImage) => {
  const timestamp = new Date().getTime();
  return `/${folderName}/${timestamp}.${isImage ? "png" : "mp4"}`;
};
