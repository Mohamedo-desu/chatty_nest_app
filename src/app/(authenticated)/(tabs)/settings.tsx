import CustomText from "@/components/CustomText";
import { Fonts } from "@/constants/Fonts";
import { router } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  ArrowLeftOnRectangleIcon,
  BellIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  LockClosedIcon,
  MoonIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const SettingsScreen = () => {
  const { styles, theme } = useStyles(stylesheet);

  // Define settings sections and items
  const sections = [
    {
      title: "Account",
      data: [
        {
          title: "Profile",
          icon: UserIcon,
          onPress: () => {
            // Navigate to profile settings
            router.navigate("/(authenticated)/profile");
          },
        },
        {
          title: "Change Password",
          icon: LockClosedIcon,
          onPress: () => {
            // Navigate to change password screen
            router.navigate("/(authenticated)/change_password");
          },
        },
      ],
    },
    {
      title: "Privacy",
      data: [
        {
          title: "Privacy Settings",
          icon: ShieldCheckIcon,
          onPress: () => {
            // Navigate to privacy settings
            router.navigate("/(authenticated)/privacy_settings");
          },
        },
        {
          title: "Blocked Accounts",
          icon: NoSymbolIcon,
          onPress: () => {
            // Navigate to blocked accounts
            router.navigate("/(authenticated)/blocked_accounts");
          },
        },
      ],
    },
    {
      title: "Notifications",
      data: [
        {
          title: "Push Notifications",
          icon: BellIcon,
          onPress: () => {
            // Navigate to notifications settings
            router.navigate("/(authenticated)/notifications_settings");
          },
        },
      ],
    },
    {
      title: "Data & Storage",
      data: [
        {
          title: "Data Usage",
          icon: DocumentTextIcon,
          onPress: () => {
            // Navigate to data usage details
            router.navigate("/(authenticated)/data_usage");
          },
        },
      ],
    },
    {
      title: "General",
      data: [
        {
          title: "Theme",
          icon: MoonIcon,
          onPress: () => {
            // Navigate to language selection
            router.navigate("/theme_settings");
          },
        },
        {
          title: "Language",
          icon: GlobeAltIcon,
          onPress: () => {
            // Navigate to language selection
            router.navigate("/language");
          },
        },
        {
          title: "About",
          icon: InformationCircleIcon,
          onPress: () => {
            // Navigate to about screen
            router.navigate("/about");
          },
        },
      ],
    },
    {
      title: "Support",
      data: [
        {
          title: "Help Center",
          icon: InformationCircleIcon,
          onPress: () => {
            // Navigate to help center
            router.navigate("/help_center");
          },
        },
        {
          title: "Report a Problem",
          icon: ExclamationTriangleIcon,
          onPress: () => {
            // Navigate to report problem
            router.navigate("/help");
          },
        },
      ],
    },
    {
      title: "Other",
      data: [
        {
          title: "Logout",
          icon: ArrowLeftOnRectangleIcon,
          onPress: () => {
            // Handle logout
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
                      color={theme.Colors.primary}
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
