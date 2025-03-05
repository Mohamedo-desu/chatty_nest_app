import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useSettingsStore } from "@/store/settingsStore";
import { client } from "@/supabase/config";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { ScrollView, Switch, TextInput, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface MessageFilteringSettings {
  filterUnknown: boolean;
  filterExplicit: boolean;
  blockedKeywords: string[];
}

const MessageFilteringScreen: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { user } = useUser();
  const userId = user?.id;

  const { messageFilteringSettings, setMessageFilteringSettings } =
    useSettingsStore();
  const [localBlockedKeywords, setLocalBlockedKeywords] = useState<string>("");

  // Helper: convert comma-separated string to array
  const textToKeywords = (text: string): string[] =>
    text
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

  // Update message filtering settings in Supabase using upsert.
  const updateMessageFilteringSettingInSupabase = async (
    field: keyof MessageFilteringSettings,
    value: any
  ) => {
    if (!userId) return;

    // Map store field names to DB column names.
    const dbFieldMapping: Record<keyof MessageFilteringSettings, string> = {
      filterUnknown: "filter_unknown",
      filterExplicit: "filter_explicit",
      blockedKeywords: "blocked_keywords",
    };

    // Prepare payload using the current store values, then override the changed field.
    const payload = {
      user_id: userId,
      filter_unknown: messageFilteringSettings.filterUnknown,
      filter_explicit: messageFilteringSettings.filterExplicit,
      blocked_keywords: messageFilteringSettings.blockedKeywords,
      [dbFieldMapping[field]]: value,
    };

    const { error } = await client
      .from("message_filtering")
      .upsert(payload, { onConflict: "user_id" });
    if (error) {
      console.error(`Error updating ${field}:`, error);
      showToast("error", "Error", error.message);
    }
  };

  // Fetch message filtering settings from Supabase and update the store.
  const fetchMessageFilteringSettings = async () => {
    try {
      if (!userId) return;
      const { data, error } = await client
        .from("message_filtering")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (error) {
        console.error("Error fetching message filtering settings:", error);
        return;
      }
      if (data) {
        setMessageFilteringSettings({
          filterUnknown: data.filter_unknown,
          filterExplicit: data.filter_explicit,
          blockedKeywords: data.blocked_keywords || [],
        });
        setLocalBlockedKeywords((data.blocked_keywords || []).join(", "));
      }
    } catch (error: any) {
      showToast("error", "Error", error.message);
    }
  };

  useEffect(() => {
    fetchMessageFilteringSettings();
  }, [userId]);

  // Handlers for toggles
  const handleToggleFilterUnknown = (val: boolean) => {
    setMessageFilteringSettings({ filterUnknown: val });
    updateMessageFilteringSettingInSupabase("filterUnknown", val);
  };

  const handleToggleFilterExplicit = (val: boolean) => {
    setMessageFilteringSettings({ filterExplicit: val });
    updateMessageFilteringSettingInSupabase("filterExplicit", val);
  };

  // Handlers for blocked keywords
  const handleBlockedKeywordsChange = (text: string) => {
    setLocalBlockedKeywords(text);
  };

  const handleBlockedKeywordsBlur = () => {
    const keywordsArray = textToKeywords(localBlockedKeywords);
    setMessageFilteringSettings({ blockedKeywords: keywordsArray });
    updateMessageFilteringSettingInSupabase("blockedKeywords", keywordsArray);
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Toggle for filtering unknown senders */}
      <View style={styles.toggleContainer}>
        <CustomText style={styles.toggleLabel}>
          Filter messages from unknown senders
        </CustomText>
        <Switch
          value={messageFilteringSettings.filterUnknown}
          onValueChange={handleToggleFilterUnknown}
          thumbColor={
            messageFilteringSettings.filterUnknown
              ? Colors.white
              : theme.Colors.gray[300]
          }
          trackColor={{
            false: theme.Colors.gray[200],
            true: theme.Colors.primary,
          }}
        />
      </View>

      {/* Toggle for filtering explicit content */}
      <View style={styles.toggleContainer}>
        <CustomText style={styles.toggleLabel}>
          Filter messages with explicit language
        </CustomText>
        <Switch
          value={messageFilteringSettings.filterExplicit}
          onValueChange={handleToggleFilterExplicit}
          thumbColor={
            messageFilteringSettings.filterExplicit
              ? Colors.white
              : theme.Colors.gray[300]
          }
          trackColor={{
            false: theme.Colors.gray[200],
            true: theme.Colors.primary,
          }}
        />
      </View>

      {/* Blocked Keywords Input */}
      <CustomText style={styles.inputLabel}>
        Blocked Keywords (comma separated)
      </CustomText>
      <TextInput
        value={localBlockedKeywords}
        onChangeText={handleBlockedKeywordsChange}
        onBlur={handleBlockedKeywordsBlur}
        placeholder="Enter keywords separated by commas"
        placeholderTextColor={theme.Colors.gray[400]}
        multiline
        style={styles.blockedKeywordsInput}
      />

      <CustomButton text="Save Settings" onPress={handleBlockedKeywordsBlur} />
    </ScrollView>
  );
};

export default MessageFilteringScreen;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    padding: moderateScale(16),
    paddingBottom: moderateScale(20),
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: theme.Colors.gray[200],
    marginBottom: moderateScale(16),
  },
  toggleLabel: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Regular,
    color: theme.Colors.typography,
    flex: 1,
  },
  inputLabel: {
    fontSize: RFValue(14),
    fontFamily: Fonts.SemiBold,
    color: theme.Colors.typography,
    marginBottom: moderateScale(8),
  },
  blockedKeywordsInput: {
    height: moderateScale(80),
    borderWidth: 1,
    borderColor: theme.Colors.gray[200],
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    fontSize: RFValue(14),
    backgroundColor: theme.Colors.gray[50],
    textAlignVertical: "top",
    marginBottom: moderateScale(16),
    color: theme.Colors.typography,
  },
}));
