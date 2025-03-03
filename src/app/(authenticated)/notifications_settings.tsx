import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import React, { useState } from "react";
import { ScrollView, Switch, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface ListItemData {
  title: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

const Notifications: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);

  // States for notification options
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);

  const [likesNotifications, setLikesNotifications] = useState<boolean>(true);
  const [commentsNotifications, setCommentsNotifications] =
    useState<boolean>(true);
  const [mentionsNotifications, setMentionsNotifications] =
    useState<boolean>(true);
  const [friendRequestsNotifications, setFriendRequestsNotifications] =
    useState<boolean>(true);
  const [directMessagesNotifications, setDirectMessagesNotifications] =
    useState<boolean>(true);
  const [groupNotifications, setGroupNotifications] = useState<boolean>(true);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(false);

  // Define sections and items
  const sections: {
    title: string;
    data: ListItemData[];
  }[] = [
    {
      title: "General Notifications",
      data: [
        {
          title: "Push Notifications",
          value: pushNotifications,
          onValueChange: setPushNotifications,
        },
        {
          title: "Email Notifications",
          value: emailNotifications,
          onValueChange: setEmailNotifications,
        },
        {
          title: "SMS Notifications",
          value: smsNotifications,
          onValueChange: setSmsNotifications,
        },
      ],
    },
    {
      title: "Social Activity",
      data: [
        {
          title: "Likes",
          value: likesNotifications,
          onValueChange: setLikesNotifications,
        },
        {
          title: "Comments",
          value: commentsNotifications,
          onValueChange: setCommentsNotifications,
        },
        {
          title: "Mentions",
          value: mentionsNotifications,
          onValueChange: setMentionsNotifications,
        },
        {
          title: "Friend Requests",
          value: friendRequestsNotifications,
          onValueChange: setFriendRequestsNotifications,
        },
        {
          title: "Direct Messages",
          value: directMessagesNotifications,
          onValueChange: setDirectMessagesNotifications,
        },
        {
          title: "Group Notifications",
          value: groupNotifications,
          onValueChange: setGroupNotifications,
        },
      ],
    },
    {
      title: "Sound & Vibration",
      data: [
        {
          title: "Notification Sound",
          value: soundEnabled,
          onValueChange: setSoundEnabled,
        },
        {
          title: "Vibrate on Notification",
          value: vibrateEnabled,
          onValueChange: setVibrateEnabled,
        },
      ],
    },
  ];

  // Reusable list item component
  const ListItem: React.FC<ListItemData> = ({
    title,
    value,
    onValueChange,
  }) => (
    <View style={styles.itemContainer}>
      <CustomText style={styles.itemTitle}>{title}</CustomText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? Colors.white : theme.Colors.gray[300]}
        trackColor={{
          false: theme.Colors.gray[400],
          true: theme.Colors.primary,
        }}
      />
    </View>
  );

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.sectionContainer}>
          <CustomText style={styles.sectionTitle} variant="h6">
            {section.title}
          </CustomText>
          {section.data.map((item, itemIndex) => (
            <ListItem
              key={itemIndex}
              title={item.title}
              value={item.value}
              onValueChange={item.onValueChange}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default Notifications;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainer: {
    padding: moderateScale(16),
  },
  sectionContainer: {
    marginBottom: moderateScale(24),
  },
  sectionTitle: {
    marginBottom: moderateScale(12),
    color: theme.Colors.primary,
    fontSize: RFValue(16),
    fontFamily: Fonts.SemiBold,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.Colors.gray[200],
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(8),
  },
  itemTitle: {
    flex: 1,
    color: theme.Colors.typography,
    fontSize: RFValue(14),
    fontFamily: Fonts.Regular,
  },
}));
