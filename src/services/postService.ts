import { client } from "@/supabase/config";

export const fetchPosts = async (limit = 10) => {
  const { data, error } = await client
    .from("posts")
    .select(
      `*,
        user:users (user_id,display_name,user_name,photo_url),
        post_likes (*)
        `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }
  if (data) {
    return data;
  }
};
export const createPostLike = async (postLike) => {
  const { data, error } = await client
    .from("post_likes")
    .insert(postLike)
    .select("*")
    .single();

  if (error) {
    throw error;
  }
  if (data) {
    return data;
  }
};
export const removePostLike = async (
  postId: string | number,
  userId: string | number
) => {
  const { error } = await client
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
};
