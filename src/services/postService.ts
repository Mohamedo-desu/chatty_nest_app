import { client } from "@/supabase/config";
import { uploadFile } from "./imageServices";

export const createOrUpdatePost = async (post) => {
  try {
    if (post.file && typeof post.file === "object") {
      let isImage = post?.file?.type === "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);

      if (fileResult) {
        post.file = fileResult;
      } else {
        fileResult;
      }

      let { data, error } = await client
        .from("posts")
        .upsert(post)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
