import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useSettingsStore } from "@/store/settingsStore";
import { client } from "@/supabase/config";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect } from "react";
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
  const { user } = useUser();
  const userId = user?.id;
  const { notificationSettings, setNotificationSettings } = useSettingsStore();

  // This function uses upsert so that if no row exists, it gets inserted.
  const updateSettingInSupabase = async (
    field: keyof typeof notificationSettings,
    value: boolean
  ) => {
    if (!userId) return;
    const updatePayload = { user_id: userId, [field]: value };
    const { error } = await client
      .from("notification_settings")
      .upsert(updatePayload, { onConflict: "user_id" });
    if (error) {
      showToast("error", "Error", error.message);
    }
  };

  // Handler to update both the store and Supabase.
  const handleToggle =
    (field: keyof typeof notificationSettings) => (val: boolean) => {
      setNotificationSettings({ [field]: val });
      updateSettingInSupabase(field, val);
    };

  // Fetch settings from Supabase and update the store.
  const fetchNotificationSettings = async () => {
    try {
      if (!userId) return;
      const { data, error } = await client
        .from("notification_settings")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (error) {
        throw error;
      }
      if (data) {
        setNotificationSettings({
          push_notifications: data.push_notifications,
          email_notifications: data.email_notifications,
          sms_notifications: data.sms_notifications,
          likes_notifications: data.likes_notifications,
          comments_notifications: data.comments_notifications,
          mentions_notifications: data.mentions_notifications,
          friend_requests_notifications: data.friend_requests_notifications,
          direct_messages_notifications: data.direct_messages_notifications,
          group_notifications: data.group_notifications,
          notification_sound: data.notification_sound,
          vibrate_on_notification: data.vibrate_on_notification,
        });
      }
    } catch (error: any) {
      showToast("error", "Error", error.message);
    }
  };

  useEffect(() => {
    fetchNotificationSettings();
  }, [userId]);

  // Define sections using values from the store.
  const sections: { title: string; data: ListItemData[] }[] = [
    {
      title: "General Notifications",
      data: [
        {
          title: "Push Notifications",
          value: notificationSettings.push_notifications,
          onValueChange: handleToggle("push_notifications"),
        },
        {
          title: "Email Notifications",
          value: notificationSettings.email_notifications,
          onValueChange: handleToggle("email_notifications"),
        },
        {
          title: "SMS Notifications",
          value: notificationSettings.sms_notifications,
          onValueChange: handleToggle("sms_notifications"),
        },
      ],
    },
    {
      title: "Social Activity",
      data: [
        {
          title: "Likes",
          value: notificationSettings.likes_notifications,
          onValueChange: handleToggle("likes_notifications"),
        },
        {
          title: "Comments",
          value: notificationSettings.comments_notifications,
          onValueChange: handleToggle("comments_notifications"),
        },
        {
          title: "Mentions",
          value: notificationSettings.mentions_notifications,
          onValueChange: handleToggle("mentions_notifications"),
        },
        {
          title: "Friend Requests",
          value: notificationSettings.friend_requests_notifications,
          onValueChange: handleToggle("friend_requests_notifications"),
        },
        {
          title: "Direct Messages",
          value: notificationSettings.direct_messages_notifications,
          onValueChange: handleToggle("direct_messages_notifications"),
        },
        {
          title: "Group Notifications",
          value: notificationSettings.group_notifications,
          onValueChange: handleToggle("group_notifications"),
        },
      ],
    },
    {
      title: "Sound & Vibration",
      data: [
        {
          title: "Notification Sound",
          value: notificationSettings.notification_sound,
          onValueChange: handleToggle("notification_sound"),
        },
        {
          title: "Vibrate on Notification",
          value: notificationSettings.vibrate_on_notification,
          onValueChange: handleToggle("vibrate_on_notification"),
        },
      ],
    },
  ];

  // Reusable list item component.
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

const stylesheet = createStyleSheet((theme, rt) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainer: {
    padding: moderateScale(16),
    paddingBottom: rt.insets.bottom + 10,
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
