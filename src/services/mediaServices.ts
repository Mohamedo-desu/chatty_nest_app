import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

const getMimeType = (uri: string): string => {
  const ext = uri.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "ogg":
      return "video/ogg";
    case "mov":
      return "video/quicktime";
    default:
      return "image/jpeg";
  }
};

export const uploadMedia = async (
  uri: string,
  folder: string,
  fileName: string
): Promise<string> => {
  const userId = useUserStore.getState().currentUser.user_id;

  const base64Data = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const fileData = decode(base64Data);
  const mimeType = getMimeType(uri);
  const storagePath = `${userId}/${folder}/${fileName}`;
  const { error } = await client.storage
    .from("uploads")
    .upload(storagePath, fileData, { contentType: mimeType, upsert: true });
  if (error) {
    throw error;
  }
  const { data } = client.storage.from("uploads").getPublicUrl(storagePath);
  return data.publicUrl;
};

export const downloadFile = async (url: string) => {
  try {
    let fileName = url.split("/").pop();

    const localFilePath = `${FileSystem.documentDirectory}${fileName}`;

    const { uri } = await FileSystem.downloadAsync(url, localFilePath);

    return uri;
  } catch (error) {
    return null;
  }
};
