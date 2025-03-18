import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useChatStore } from "@/store/chatStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import CustomText from "../CustomText";
import { showToast } from "../toast/ShowToast";

dayjs.extend(relativeTime);
dayjs.locale("en");

interface User {
  user_id: string;
  display_name: string;
  email_address: string;
  photo_url: string;
  conversation_id?: string | null;
  status?: {
    date?: Date | string;
    isOnline?: boolean;
  };
}

interface SearchedUserProps {
  item: User;
  searchPhrase: string;
}

const SearchedUser: React.FC<SearchedUserProps> = ({ item, searchPhrase }) => {
  const { styles, theme } = useStyles(stylesheet);

  const { createOneToOneChat, error } = useChatStore();

  const userStatus = {
    isOnline: true,
    date: new Date(),
  };

  const date = userStatus.date ?? item.status?.date;
  const formattedDate = typeof date === "string" ? new Date(date) : date;
  const isOnline = userStatus.isOnline ?? item.status?.isOnline;
  const lastSeen = dayjs(formattedDate).fromNow();

  const handlePress = useCallback(async () => {
    let convId = item.conversation_id;

    if (!convId) {
      convId = await createOneToOneChat(item);
      if (!convId) return;
    }

    router.push({
      pathname: "/chat_details",
      params: {
        conversationId: convId,
        name: item.display_name,
        photo: item.photo_url,
        push_tokens: JSON.stringify(item.push_tokens),
        other_user_id: item.user_id,
      },
    });
  }, [item]);

  const highlightSearchPhrase = useCallback(
    (fullName: string) => {
      if (!searchPhrase) {
        return <CustomText style={styles.fullName}>{fullName}</CustomText>;
      }
      const regex = new RegExp(`(${searchPhrase})`, "gi");
      const parts = fullName.split(regex);
      return (
        <Text style={styles.fullName}>
          {parts.map((part, index) => (
            <Text
              key={index}
              style={[
                styles.fullName,
                regex.test(part) && {
                  color: theme.Colors.primary,
                },
              ]}
            >
              {part}
            </Text>
          ))}
        </Text>
      );
    },
    [searchPhrase]
  );

  useEffect(() => {
    if (error) {
      showToast("error", "Error", error.message);
    }
  }, [error]);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.user}
      onPress={handlePress}
    >
      <TouchableOpacity style={styles.photoContainer}>
        <Image
          source={{ uri: item.photo_url }}
          contentFit="cover"
          style={styles.photo}
        />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        {highlightSearchPhrase(item.display_name)}

        <CustomText
          style={[
            styles.lastSeen,
            {
              color: isOnline ? theme.Colors.success : theme.Colors.gray[200],
            },
          ]}
        >
          {isOnline ? "Online" : `last seen ${lastSeen}`}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default SearchedUser;

const stylesheet = createStyleSheet((theme, rt) => ({
  user: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: theme.Colors.gray[100],
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(10),
    borderRadius: 5,
  },

  photoContainer: {
    width: moderateScale(40),
    aspectRatio: 1,
    borderRadius: moderateScale(20),
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    flex: 1,
    marginLeft: moderateScale(8),
    overflow: "hidden",
  },
  fullName: {
    fontSize: RFValue(14),
    fontFamily: Fonts.SemiBold,
    flex: 1,
    color: theme.Colors.typography,
  },
  lastSeen: {
    fontSize: RFValue(10),
    fontFamily: Fonts.Regular,
    color: Colors.primary,
  },
}));
