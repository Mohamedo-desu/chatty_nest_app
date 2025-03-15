import { client } from "@/supabase/config";

export const fetchPosts = async (limit = 10) => {
  const { data, error } = await client
    .from("posts")
    .select(
      `*,
        user:users (user_id, display_name, user_name, photo_url),
        post_likes (*),
        post_comments (count)
      `
    )
    .eq("type", "public")
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
export const removePostComment = async (commentId: string | number) => {
  const { error } = await client
    .from("post_comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    throw error;
  }

  return commentId;
};
export const getPostLikes = async (postId: string, userId: string) => {
  try {
    const { error, data } = await client
      .from("post_likes")
      .select("*")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();
    if (error) throw error;
    if (data) return data;
  } catch (error) {
    console.log(error);
  }
};
export const getPostComments = async (postId: string, userId: string) => {
  try {
    const { error, data } = await client
      .from("post_comments")
      .select("*")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();
    if (error) throw error;
    if (data) return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPostDetails = async (postId: string) => {
  const { data, error } = await client
    .from("posts")
    .select(
      `*,
        user:users (user_id,display_name,user_name,photo_url),
        post_likes (*),
        post_comments (*, user:users (user_id,display_name,user_name,photo_url))
        `
    )
    .eq("id", postId)
    .order("created_at", { ascending: false, referencedTable: "post_comments" })
    .single();

  if (error) {
    throw error;
  }
  if (data) {
    return data;
  }
};

export const createPostComment = async (postComment) => {
  const { data, error } = await client
    .from("post_comments")
    .insert(postComment)
    .select("*")
    .single();

  if (error) {
    throw error;
  }
  if (data) {
    return data;
  }
};

export const fetchUserPosts = async (limit = 10, userId: string) => {
  const { data, error } = await client
    .from("posts")
    .select(
      `*,
        user:users (user_id, display_name, user_name, photo_url),
        post_likes (*),
        post_comments (count)
      `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }
  if (data) {
    return data;
  }
};
export const removePost = async (postId: string | number) => {
  const { error } = await client.from("posts").delete().eq("id", postId);

  if (error) {
    throw error;
  }

  return postId;
};
