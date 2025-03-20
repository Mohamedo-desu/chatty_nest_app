import { client } from "@/supabase/config";

export const fetchPosts = async (offset = 0, limit = 10) => {
  const { data, error } = await client
    .from("randomized_posts")
    .select(
      `*,
       user:users (user_id, display_name, user_name, photo_url, push_tokens),
       post_likes (*),
       post_comments (count)`
    )
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }
  return data;
};

export const createPostLike = async (postLike, notification) => {
  // Insert the like into the "post_likes" table.
  const { data, error } = await client
    .from("post_likes")
    .insert(postLike)
    .select("*")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (notification.recipientId === postLike.user_id) {
    return data;
  }

  // Check the recipient's notification settings.
  // It is assumed that notification.recipientId is the ID of the post owner.
  const recipientUserId = notification.recipientId;
  if (recipientUserId) {
    const { data: settings, error: settingsError } = await client
      .from("notification_settings")
      .select("likes_notifications")
      .eq("user_id", recipientUserId)
      .maybeSingle();

    if (settingsError) {
      throw settingsError;
    }

    // If the settings are missing or likes_notification is false, exit without sending a notification.
    if (!settings || !settings.likes_notifications) {
      return data;
    }
  }

  // Build the notification message.
  const pushTokens = notification.pushTokens;
  const messageBody = notification.postTitle
    ? `${notification.likerName} liked your post: "${notification.postTitle}"`
    : `${notification.likerName} liked your post!`;

  // If there are push tokens, send a push notification to each.
  if (Array.isArray(pushTokens) && pushTokens.length > 0) {
    const notificationPromises = pushTokens.map((token) => {
      const message = {
        to: token,
        sound: "default",
        title: "New Like!",
        body: messageBody,
        data: {
          url: `/(authenticated)/post_details?postId=${notification.postId}`,
        },
      };

      return fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    });

    await Promise.all(notificationPromises);
  }

  return data;
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
      .maybeSingle();
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
      .maybeSingle();
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
        user:users (user_id, display_name, user_name, photo_url,push_tokens),
        post_likes (*),
        post_comments (*, user:users (user_id, display_name, user_name, photo_url,push_tokens))
        `
    )
    .eq("id", postId)
    .order("created_at", { ascending: false, referencedTable: "post_comments" })
    .maybeSingle();

  if (error) {
    throw error;
  }
  if (data) {
    return data;
  }
};

export const createPostComment = async (postComment, notification) => {
  // Insert the comment into the "post_comments" table.
  const { data, error } = await client
    .from("post_comments")
    .insert(postComment)
    .select("*")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (notification.recipientId === postComment.user_id) {
    return data;
  }

  // Check notification settings for the recipient user.
  // It is assumed that notification.recipientId contains the ID of the post owner.
  const recipientUserId = notification.recipientId;

  if (recipientUserId) {
    const { data: settings, error: settingsError } = await client
      .from("notification_settings")
      .select("comments_notifications")
      .eq("user_id", recipientUserId)
      .maybeSingle();

    if (settingsError) {
      throw settingsError;
    }

    // If no settings were found or the comments_notification flag is false,
    // do not send the notification.
    if (!settings || !settings.comments_notifications) {
      return data;
    }
  }

  // Build the notification message.
  const pushTokens = notification.pushTokens;
  const messageBody = notification.postTitle
    ? `${notification.commenterName} commented on your post: "${notification.postTitle}"`
    : `${notification.commenterName} commented on your post!`;

  // If there are push tokens available, send a push notification to each.
  if (Array.isArray(pushTokens) && pushTokens.length > 0) {
    const notificationPromises = pushTokens.map((token) => {
      const message = {
        to: token,
        sound: "default",
        title: "New Comment!",
        body: messageBody,
        data: {
          url: `/(authenticated)/post_details?postId=${notification.postId}&commentId=${data.id}`,
        },
      };

      return fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    });

    await Promise.all(notificationPromises);
  }

  return data;
};

export const fetchUserPosts = async (
  offset = 0,
  limit = 10,
  userId: string
) => {
  const { data, error } = await client
    .from("posts")
    .select(
      `*,
        user:users (user_id, display_name, user_name, photo_url, push_tokens),
        post_likes (*),
        post_comments (count)`
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }
  return data || [];
};

export const removePostItem = async (postId: string | number, file: string) => {
  if (file) {
    deleteStorageFile(file);
  }

  const { error: deleteError } = await client
    .from("posts")
    .delete()
    .eq("id", postId);

  if (deleteError) {
    throw deleteError;
  }

  return postId;
};

export const deleteStorageFile = async (fileUrl: string): Promise<void> => {
  let removePath = fileUrl;
  if (fileUrl.startsWith("http")) {
    const parts = fileUrl.split("/storage/v1/object/public/uploads/");
    if (parts.length === 2) {
      removePath = parts[1];
    }
  }
  const { error } = await client.storage.from("uploads").remove([removePath]);
  if (error) {
    console.error("Error deleting storage file:", error);
    throw error;
  }
};
