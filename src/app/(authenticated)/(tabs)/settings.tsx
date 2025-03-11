import CustomText from "@/components/CustomText";
import { Fonts } from "@/constants/Fonts";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import {
  ArrowLeftOnRectangleIcon,
  BellIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  MoonIcon,
  ShieldCheckIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const SettingsScreen = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { signOut } = useAuth();

  const { t } = useTranslation();

  // Define settings sections and items
  const sections = [
    {
      title: t("SettingsPage.account"),
      data: [
        {
          title: t("SettingsPage.profile"),
          icon: UserIcon,
          onPress: () => {
            // Navigate to profile settings
            router.navigate("/(authenticated)/profile");
          },
        },
      ],
    },
    {
      title: t("SettingsPage.privacy"),
      data: [
        {
          title: t("SettingsPage.privacySettings"),
          icon: ShieldCheckIcon,
          onPress: () => {
            // Navigate to privacy settings
            router.navigate("/(authenticated)/privacy_settings");
          },
        },
      ],
    },
    {
      title: t("SettingsPage.notifications"),
      data: [
        {
          title: t("SettingsPage.pushNotifications"),
          icon: BellIcon,
          onPress: () => {
            // Navigate to notifications settings
            router.navigate("/(authenticated)/notifications_settings");
          },
        },
      ],
    },
    {
      title: t("SettingsPage.dataAndStorage"),
      data: [
        {
          title: t("SettingsPage.dataUsage"),
          icon: DocumentTextIcon,
          onPress: () => {
            // Navigate to data usage details
            router.navigate("/(authenticated)/data_usage");
          },
        },
      ],
    },
    {
      title: t("SettingsPage.general"),
      data: [
        {
          title: t("SettingsPage.theme"),
          icon: MoonIcon,
          onPress: () => {
            // Navigate to language selection
            router.navigate("/theme_settings");
          },
        },
        {
          title: t("SettingsPage.language"),
          icon: GlobeAltIcon,
          onPress: () => {
            // Navigate to language selection
            router.navigate("/language_settings");
          },
        },
        {
          title: t("SettingsPage.about"),
          icon: InformationCircleIcon,
          onPress: () => {
            // Navigate to about screen
            router.navigate("/about");
          },
        },
      ],
    },
    {
      title: t("SettingsPage.support"),
      data: [
        {
          title: t("SettingsPage.helpCenter"),
          icon: InformationCircleIcon,
          onPress: () => {
            // Navigate to help center
            router.navigate("/help_center");
          },
        },
        {
          title: t("SettingsPage.reportProblem"),
          icon: ExclamationTriangleIcon,
          onPress: () => {
            // Navigate to report problem
            router.navigate("/help");
          },
        },
      ],
    },
    {
      title: t("SettingsPage.other"),
      data: [
        {
          title: t("SettingsPage.logOut"),
          icon: ArrowLeftOnRectangleIcon,
          onPress: () => {
            // Handle logout
            Alert.alert(
              t("SettingsPage.alertLogoutTitle"),
              t("SettingsPage.alertLogoutDescription"),
              [
                {
                  text: t("SettingsPage.alertLogoutYes"),
                  onPress: () => signOut(),
                },
                {
                  text: t("SettingsPage.alertLogoutNo"),
                  onPress: undefined,
                  style: "cancel",
                },
              ]
            );
          },
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView>
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.sectionContainer}>
            <CustomText style={styles.sectionTitle}>{section.title}</CustomText>
            {section.data.map((item, itemIndex) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.itemContainer}
                  onPress={item.onPress}
                  activeOpacity={0.8}
                >
                  <View style={styles.itemIconContainer}>
                    <IconComponent
                      color={theme.Colors.typography}
                      width={RFValue(20)}
                      height={RFValue(20)}
                    />
                  </View>
                  <View style={styles.itemTextContainer}>
                    <CustomText style={styles.itemTitle}>
                      {item.title}
                    </CustomText>
                  </View>
                  <View style={styles.itemArrowContainer}>
                    <ChevronRightIcon
                      color={theme.Colors.gray[400]}
                      width={RFValue(20)}
                      height={RFValue(20)}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </SafeAreaView>
    </ScrollView>
  );
};

export default SettingsScreen;

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
