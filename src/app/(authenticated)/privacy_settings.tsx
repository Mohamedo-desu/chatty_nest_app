import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useSettingsStore } from "@/store/settingsStore";
import { client } from "@/supabase/config";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import {
  BellIcon,
  ChevronRightIcon,
  FunnelIcon,
  InformationCircleIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface PrivacyItem {
  title: string;
  icon: React.FC<{ color: string; width: number; height: number }>;
  onPress?: () => void;
  hasSwitch?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

const PrivacyScreen: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { user } = useUser();
  const userId = user?.id;

  const { t } = useTranslation();

  // Access privacy settings from the existing settings store.
  const { privacySettings, setPrivacySettings } = useSettingsStore();

  // Upsert a privacy setting in Supabase.
  const updatePrivacySettingInSupabase = async (
    field: keyof typeof privacySettings,
    value: boolean
  ) => {
    if (!userId) return;
    const payload = { user_id: userId, [field]: value };
    const { error } = await client
      .from("privacy_settings")
      .upsert(payload, { onConflict: "user_id" });
    if (error) {
      console.error(`Error updating ${field}:`, error);
      showToast("error", "Error", error.message);
    }
  };

  // When a toggle changes, update the store and Supabase.
  const handleToggle =
    (field: keyof typeof privacySettings) => (val: boolean) => {
      setPrivacySettings({ [field]: val });
      updatePrivacySettingInSupabase(field, val);
    };

  // Fetch privacy settings from Supabase and update the store.
  const fetchPrivacySettings = async () => {
    try {
      if (!userId) return;
      const { data, error } = await client
        .from("privacy_settings")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (error) {
        console.error("Error fetching privacy settings:", error);
        return;
      }
      if (data) {
        setPrivacySettings({
          private_account: data.private_account,
          activity_status: data.activity_status,
          read_receipts: data.read_receipts,
        });
      }
    } catch (error: any) {
      showToast("error", "Error", error.message);
    }
  };

  useEffect(() => {
    fetchPrivacySettings();
  }, [userId]);

  // Define sections using the values from the store.
  const sections: { title: string; data: PrivacyItem[] }[] = [
    {
      title: t("privacySettingsPage.accountPrivacy"),
      data: [
        {
          title: t("privacySettingsPage.privateAccount"),
          icon: ShieldCheckIcon,
          hasSwitch: true,
          value: privacySettings.private_account,
          onValueChange: handleToggle("private_account"),
        },
        {
          title: t("privacySettingsPage.activityStatus"),
          icon: BellIcon,
          hasSwitch: true,
          value: privacySettings.activity_status,
          onValueChange: handleToggle("activity_status"),
        },
      ],
    },
    {
      title: t("privacySettingsPage.messagePrivacy"),
      data: [
        {
          title: t("privacySettingsPage.readReceipts"),
          icon: InformationCircleIcon,
          hasSwitch: true,
          value: privacySettings.read_receipts,
          onValueChange: handleToggle("read_receipts"),
        },
        {
          title: t("privacySettingsPage.messageFiltering"),
          icon: FunnelIcon,
          onPress: () => {
            router.navigate("/(authenticated)/message_filtering");
          },
        },
      ],
    },
    {
      title: t("privacySettingsPage.blockingAndRestriction"),
      data: [
        {
          title: t("privacySettingsPage.blockedAccounts"),
          icon: NoSymbolIcon,
          onPress: () => {
            router.navigate("/(authenticated)/blocked_accounts");
          },
        },
        {
          title: t("privacySettingsPage.restrictedAccounts"),
          icon: UserIcon,
          onPress: () => {
            router.navigate("/(authenticated)/restricted_accounts");
          },
        },
      ],
    },
  ];

  // Reusable list item component.
  const ListItem: React.FC<PrivacyItem> = ({
    title,
    icon: IconComponent,
    onPress,
    hasSwitch,
    value,
    onValueChange,
  }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={hasSwitch} // disable press when a switch is used
    >
      <View style={styles.itemIconContainer}>
        <IconComponent
          color={theme.Colors.typography}
          width={RFValue(20)}
          height={RFValue(20)}
        />
      </View>
      <View style={styles.itemTextContainer}>
        <CustomText style={styles.itemTitle}>{title}</CustomText>
      </View>
      {hasSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          thumbColor={value ? Colors.white : theme.Colors.gray[400]}
          trackColor={{
            false: theme.Colors.gray[300],
            true: theme.Colors.primary,
          }}
        />
      ) : (
        <View style={styles.itemArrowContainer}>
          <ChevronRightIcon
            color={theme.Colors.gray[400]}
            width={RFValue(20)}
            height={RFValue(20)}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.sectionContainer}>
          <CustomText style={styles.sectionTitle}>{section.title}</CustomText>
          {section.data.map((item, itemIndex) => (
            <ListItem key={itemIndex} {...item} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default PrivacyScreen;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    color: theme.Colors.primary,
    fontSize: RFValue(14),
    fontFamily: Fonts.SemiBold,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.Colors.gray[200],
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemIconContainer: {
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    color: theme.Colors.typography,
    fontSize: RFValue(14),
    fontFamily: Fonts.Regular,
  },
  itemArrowContainer: {
    marginLeft: 12,
  },
}));
