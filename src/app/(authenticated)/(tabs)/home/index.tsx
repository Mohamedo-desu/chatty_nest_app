import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import PostCard from "@/components/ui/PostCard";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { fetchPosts } from "@/services/postService";
import { getUserData } from "@/services/userService";
import { usePostStore } from "@/store/postStore";
import { useUserStore } from "@/store/userStore";
import { client } from "@/supabase/config";
import { DEVICE_HEIGHT } from "@/utils/device";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Fixed posts per page.
const POSTS_LIMIT = 10;

const ForYou = () => {
  const { styles } = useStyles(stylesheet);
  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [newPostsCount, setNewPostsCount] = useState(0);

  const { t } = useTranslation();
  const { currentUser } = useUserStore();
  const { posts, setPosts, updatePost, removePost, updateInPostScreen } =
    usePostStore();
  const isFocused = useIsFocused();

  useEffect(() => {
    updateInPostScreen(isFocused);
  }, [isFocused, updateInPostScreen]);

  const getForYouPosts = useCallback(async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);
    try {
      const res = await fetchPosts(offset, POSTS_LIMIT);
      if (res) {
        if (res.length < POSTS_LIMIT) {
          setHasMore(false);
        }
        // Filter out duplicates.
        const newUniquePosts = res.filter(
          (post) => !posts.some((existingPost) => existingPost.id === post.id)
        );
        setPosts([...posts, ...newUniquePosts]);
        setOffset((prevOffset) => prevOffset + res.length);
      }
    } catch (error: any) {
      showToast("error", "Error", error.message);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, hasMore, offset, posts, setPosts]);

  const handlePostEvent = useCallback(
    async (payload: any) => {
      if (payload.eventType === "INSERT" && payload.new.id) {
        let newPost = { ...payload.new };
        const userData = await getUserData(newPost.user_id, false);
        newPost.user = userData ?? {};
        newPost.post_likes = newPost.post_likes || [];
        newPost.post_comments = newPost.post_comments || [{ count: 0 }];
        // Prepend the new post.
        setPosts([newPost, ...posts]);
        if (!isAtTop) {
          setNewPostsCount((prev) => prev + 1);
        }
      } else if (payload.eventType === "UPDATE" && payload.new.id) {
        let updatedPost = { ...payload.new };
        // Fetch userData from the already existing post item, if available.
        const existingPost = posts.find((post) => post.id === updatedPost.id);

        if (existingPost && existingPost.user) {
          updatedPost.user = existingPost.user;
        } else {
          // Fallback to fetching user data if not found.
          const userData = await getUserData(updatedPost.user_id, false);
          updatedPost.user = userData ?? {};
        }
        // Use provided values or set defaults.
        updatedPost.body = payload.new.body ?? updatedPost.body;
        updatedPost.file = payload.new.file ?? updatedPost.file;
        // Update the post in the store.
        updatePost(updatedPost);
      } else if (payload.eventType === "DELETE" && payload.old.id) {
        removePost(payload.old.id);
      }
    },
    [isAtTop, posts, setPosts, updatePost, removePost]
  );

  // Listen for changes on post_likes and post_comments tables.
  const handleRelatedEvent = useCallback(
    async (payload: any) => {
      const table = payload.table;

      if (table === "post_likes") {
        if (payload.eventType === "INSERT") {
          // For INSERT, we extract the post_id from payload.new.
          const postId = payload.new?.post_id;
          if (!postId) return;
          const existingPost = posts.find((post) => post.id === postId);
          if (!existingPost) return;
          // Re-fetch all likes for this post.
          const { data, error } = await client
            .from("post_likes")
            .select("*")
            .eq("post_id", postId);
          if (error) {
            console.error("Error fetching post_likes:", error);
            return;
          }
          const updatedPost = { ...existingPost, post_likes: data };
          updatePost(updatedPost);
        } else if (payload.eventType === "DELETE") {
          // For DELETE, payload.old contains only the like id.
          // Iterate through posts to find and update the one that contains this like.
          posts.forEach((post) => {
            const updatedLikes = post.post_likes.filter(
              (like: any) => like.id !== payload.old.id
            );
            const updatedPost = { ...post, post_likes: updatedLikes };
            updatePost(updatedPost);
          });
        }
      } else if (table === "post_comments") {
        if (payload.eventType === "INSERT") {
          const existingPost = posts.find(
            (post) => post.id === payload.new?.post_id
          );
          if (!existingPost) return;

          let updatedPost = { ...existingPost };

          const currentCount = updatedPost.post_comments[0]?.count || 0;
          updatedPost.post_comments = [{ count: currentCount + 1 }];
          updatePost(updatedPost);
        } else if (payload.eventType === "DELETE") {
        }
      }
    },
    [posts, updatePost]
  );

  useEffect(() => {
    const postChannel = client
      .channel("posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        handlePostEvent
      )
      .subscribe();

    return () => {
      client.removeChannel(postChannel);
    };
  }, [handlePostEvent]);

  // Subscribe to post_likes and post_comments events.
  useEffect(() => {
    const likesChannel = client
      .channel("post_likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_likes" },
        handleRelatedEvent
      )
      .subscribe();

    const commentsChannel = client
      .channel("post_comments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_comments" },
        handleRelatedEvent
      )
      .subscribe();

    return () => {
      client.removeChannel(likesChannel);
      client.removeChannel(commentsChannel);
    };
  }, [handleRelatedEvent]);

  const onRefresh = async () => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    setPosts([]);
    await getForYouPosts();
    setRefreshing(false);
  };

  const handleScroll = useCallback(
    (event) => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      if (currentOffset < 50) {
        if (!isAtTop) {
          setIsAtTop(true);
          setNewPostsCount(0);
        }
      } else {
        if (isAtTop) {
          setIsAtTop(false);
        }
      }
    },
    [isAtTop]
  );

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setNewPostsCount(0);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <PostCard item={item} currentUser={currentUser} router={router} />
    ),
    [currentUser]
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        style={styles.page}
        data={posts}
        contentContainerStyle={styles.contentContainerStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.white]}
            progressBackgroundColor={Colors.primary}
          />
        }
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          hasMore ? (
            <View
              style={posts.length === 0 ? styles.footerEmpty : styles.footer}
            >
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <CustomText style={styles.emptyText}>
                {t("home.emptyPosts")}
              </CustomText>
            </View>
          )
        }
        onEndReached={getForYouPosts}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {newPostsCount > 0 && !isAtTop && (
        <TouchableOpacity onPress={scrollToTop} style={styles.badge}>
          <CustomText style={styles.badgeText}>
            {newPostsCount} new post{newPostsCount > 1 ? "s" : ""}
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ForYou;

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainerStyle: {
    flexGrow: 1,
    gap: 10,
    paddingHorizontal: 5,
    paddingVertical: rt.insets.top,
  },
  footerEmpty: {
    marginVertical: DEVICE_HEIGHT / 3,
  },
  footer: {
    marginVertical: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Medium,
    color: theme.Colors.gray[200],
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
  },
  badgeText: {
    color: Colors.white,
    fontFamily: Fonts.Medium,
  },
}));
