import CustomText from "@/components/CustomText";
import GroupCard from "@/components/ui/GroupCard";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Example placeholder groups array
const groupsItems = [
  {
    gid: "group1",
    photo_url: "https://i.pravatar.cc/200?img=5",
    title: "Group One",
    lastMessage: {
      user: { uid: "user1", photo_url: "https://i.pravatar.cc/200?img=6" },
      text: "Hello Group One!",
      created_at: new Date().toISOString(),
      seen: [],
      received: true,
      sent: true,
    },
  },
  {
    gid: "group2",
    photo_url: "https://i.pravatar.cc/200?img=7",
    title: "Group Two",
    lastMessage: {
      user: { uid: "user2", photo_url: "https://i.pravatar.cc/200?img=8" },
      text: "What's up?",
      created_at: new Date().toISOString(),
      seen: [],
      received: false,
      sent: true,
    },
  },
  // Add more group items as needed...
];

const GroupsScreen = () => {
  const { styles, theme } = useStyles(stylesheet);

  const renderItem = ({ item }: { item: (typeof groupsItems)[0] }) => (
    <GroupCard item={item} />
  );

  const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatList
      style={styles.page}
      contentContainerStyle={styles.contentContainerStyle}
      refreshing={refreshing}
      onRefresh={() => setRefreshing(true)}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
          colors={[Colors.white]}
          progressBackgroundColor={Colors.primary}
        />
      }
      data={[]}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <CustomText variant="h7" style={styles.emptyText}>
            You have no groups yet
          </CustomText>
        </View>
      )}
    />
  );
};

export default GroupsScreen;

const stylesheet = createStyleSheet((theme, rt) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },

  contentContainerStyle: {
    flexGrow: 1,
    gap: 10,
    paddingHorizontal: 15,
    paddingTop: rt.insets.top,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontSize: RFValue(14),
    fontFamily: "Medium",
    color: theme.Colors.gray[200],
  },
}));
