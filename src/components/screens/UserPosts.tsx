import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import PostCard from "@/components/ui/PostCard";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { fetchUserPosts } from "@/services/postService";
import { useUserStore } from "@/store/userStore";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const POSTS_LIMIT = 10;

const UserPosts = () => {
  const { styles } = useStyles(stylesheet);
  const flatListRef = useRef(null);

  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const { t } = useTranslation();

  const { currentUser } = useUserStore();

  // Fetch paginated posts for the current user.
  const getUserPosts = async () => {
    if (!currentUser || isFetching || !hasMore) return;
    setIsFetching(true);
    try {
      const res = await fetchUserPosts(
        offset,
        POSTS_LIMIT,
        currentUser.user_id
      );
      if (res) {
        if (res.length < POSTS_LIMIT) {
          setHasMore(false);
        }
        // Append new posts to the existing list.
        setPosts((prevPosts) => [...prevPosts, ...res]);
        setOffset((prevOffset) => prevOffset + res.length);
      }
    } catch (error: any) {
      console.log(error);
      showToast("error", "Error", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  // Pull-to-refresh handler resets the posts list and pagination.
  const onRefresh = async () => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    setPosts([]);
    await getUserPosts();
    setRefreshing(false);
  };

  // Fetch posts on mount if the current user is set.
  useEffect(() => {
    if (currentUser) {
      getUserPosts();
    }
  }, [currentUser]);

  const renderItem = ({ item }) => (
    <PostCard item={item} currentUser={currentUser} router={router} />
  );

  return (
    <Tabs.FlatList
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
          <View style={posts.length === 0 ? styles.footerEmpty : styles.footer}>
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
      onEndReached={getUserPosts}
      onEndReachedThreshold={0.5}
    />
  );
};

export default UserPosts;

const stylesheet = createStyleSheet((theme, rt) => ({
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
    marginVertical: 100,
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
}));
