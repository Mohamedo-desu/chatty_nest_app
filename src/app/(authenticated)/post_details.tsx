import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import CommentCard from "@/components/ui/CommentCard";
import PostCard from "@/components/ui/PostCard";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import {
  createPostComment,
  fetchPostDetails,
  removePost,
  removePostComment,
} from "@/services/postService";
import { getUserData } from "@/services/userService";
import { usePostStore } from "@/store/postStore";
import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, TextInput, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Define interfaces for our data types
interface Comment {
  id: string | number;
  user_id: string;
  text: string;
  user?: any; // Replace with a proper User type if available
}

interface Post {
  id: string;
  user_id: string;
  post_comments: Comment[];
  // Add any additional fields as needed
}

interface PostDetailsParams {
  postId: string;
}

interface RealtimePayload {
  new?: Comment;
}

const PostDetails: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const { postId } = useLocalSearchParams<PostDetailsParams>();
  const [startLoading, setStartLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [post, setPost] = useState<Post | null>(null);

  const inputRef = useRef<TextInput>(null);
  const commentRef = useRef<string>("");

  const { updatePost, setPosts, posts } = usePostStore();
  const { currentUser } = useUserStore();

  const getPostDetails = useCallback(async (): Promise<void> => {
    try {
      const res = await fetchPostDetails(postId);
      if (res) {
        setPost(res);
        updatePost({
          ...res,
          post_comments: [{ count: res?.post_comments?.length }],
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setStartLoading(false);
    }
  }, [postId, updatePost]);

  const handleAddNewComment = useCallback(async (): Promise<void> => {
    if (!commentRef.current) return;
    const data = {
      user_id: currentUser.user_id,
      post_id: postId,
      text: commentRef.current,
    };
    setLoading(true);
    try {
      const res = await createPostComment(data);
      if (res) {
        // Optionally send notification here later.
        inputRef.current?.clear();
        commentRef.current = "";
        showToast("success", "Success", "Comment added successfully!");
      }
    } catch (error: any) {
      console.error(error);
      showToast("error", "Error", error.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser.user_id, postId]);

  const onDelete = useCallback(
    async (comment: Comment): Promise<void> => {
      try {
        const res = await removePostComment(comment.id);
        if (res && post) {
          setPost((prevPost) => {
            if (!prevPost) return prevPost;
            const updatedComments = prevPost.post_comments.filter(
              (item) => item.id !== comment.id
            );
            const updatedPost = {
              ...prevPost,
              post_comments: updatedComments,
            };
            updatePost({
              ...updatedPost,
              post_comments: [{ count: updatedComments.length }],
            });
            return updatedPost;
          });
          showToast("success", "Success", "Comment deleted successfully!");
        }
      } catch (error: any) {
        console.error(error);
        showToast("error", "Error", error.message);
      }
    },
    [post, updatePost]
  );

  const handleNewCommentEvent = useCallback(
    async (payload: RealtimePayload): Promise<void> => {
      try {
        if (payload.new) {
          const newComment: Comment = { ...payload.new };
          const userData = await getUserData(newComment.user_id, false);
          newComment.user = userData ?? {};
          setPost((prevPost) => {
            if (!prevPost) return prevPost;
            updatePost({
              ...prevPost,
              post_comments: [
                { count: [newComment, ...prevPost.post_comments].length },
              ],
            });

            return {
              ...prevPost,
              post_comments: [newComment, ...prevPost.post_comments],
            };
          });
        }
      } catch (error: any) {
        console.error(error);
        showToast("error", "Error", error.message);
      }
    },
    []
  );

  useEffect(() => {
    // Subscribe to realtime post events.
    const commentChannel = client
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "post_comments",
          filter: `post_id=eq.${postId}`,
        },
        handleNewCommentEvent
      )
      .subscribe();

    getPostDetails();

    return () => {
      client.removeChannel(commentChannel);
    };
  }, [getPostDetails, handleNewCommentEvent, postId]);

  const onDeletePost = async () => {
    try {
      if (!post) return;

      const res = await removePost(post.id);

      if (res) {
        let updatedPosts = posts.filter((item) => item.id !== post.id);
        setPosts(updatedPosts);
        showToast("success", "Success", "Post deleted successfully!");
        router.back();
      }
    } catch (error: any) {
      showToast("error", "Error", error.message);
    }
  };

  const onEditPost = async () => {
    router.back();

    router.push({
      pathname: "/add_post",
      params: {
        postId,
      },
    });
  };

  if (startLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CustomText variant="h5">Post not found</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PostCard
          currentUser={currentUser}
          item={{
            ...post,
            post_comments: [{ count: post.post_comments.length }],
          }}
          router={router}
          isDetails={true}
          canDelete={currentUser.user_id === post.user_id}
          onDelete={onDeletePost}
          onEdit={onEditPost}
        />

        <View style={styles.inputContainer}>
          <CustomInput
            inputRef={inputRef}
            handleChange={(value: string) => (commentRef.current = value)}
            placeholder="Type a Comment"
            multiline
          />
          {loading ? (
            <ActivityIndicator />
          ) : (
            <CustomButton text="Add Comment" onPress={handleAddNewComment} />
          )}
        </View>
        <View style={{ marginVertical: 15, gap: 17 }}>
          {post.post_comments.map((comment) => (
            <CommentCard
              item={comment}
              key={comment.id}
              canDelete={
                currentUser.user_id === comment.user_id ||
                currentUser.user_id === post.user_id
              }
              onDelete={() => onDelete(comment)}
            />
          ))}
          {post.post_comments.length === 0 && (
            <CustomText style={styles.notFound}>Be first to comment</CustomText>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.Colors.background,
    paddingBottom: rt.insets.top,
    paddingTop: 10,
  },
  inputContainer: {
    marginTop: 10,
    gap: 10,
  },
  list: {
    paddingHorizontal: 5,
  },
  notFound: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Medium,
    color: theme.Colors.gray[200],
    textAlign: "center",
  },
}));
