import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import { appName } from "@/constants";
import { Fonts } from "@/constants/Fonts";
import * as Application from "expo-application";
import * as Updates from "expo-updates";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const About: React.FC = () => {
  const { styles } = useStyles(stylesheet);

  // App Info
  const version = Application.nativeApplicationVersion;
  const buildNumber = Application.nativeBuildVersion;
  const packageName = Application.applicationId;

  // URL constants
  const privacyPolicyUrl = "https://yourdomain.com/privacy";
  const termsUrl = "https://yourdomain.com/terms";
  const appDescription = "Meet people";

  const [loading, setLoading] = useState(false);

  // Reusable component for legal links
  const LegalLink: React.FC<{ text: string; onPress: () => void }> = ({
    text,
    onPress,
  }) => (
    <TouchableOpacity
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <CustomText style={styles.linkText}>{text}</CustomText>
    </TouchableOpacity>
  );

  // Check for updates using expo-updates
  const handleCheckForUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        Alert.alert("No Updates", "You are using the latest version.");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "An error occurred while checking for updates."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Open app store for rating
  const handleRateApp = useCallback(async () => {
    try {
      const playStoreUrl = `market://details?id=${packageName}`;
      const supported = await Linking.canOpenURL(playStoreUrl);
      const url = supported
        ? playStoreUrl
        : `https://play.google.com/store/apps/details?id=${packageName}`;
      await Linking.openURL(url);
    } catch {
      Alert.alert("Error", "Unable to open the app store.");
    }
  }, [packageName]);

  const handleOpenUrl = useCallback(
    async (url: string, fallbackMsg: string) => {
      try {
        await Linking.openURL(url);
      } catch {
        Alert.alert("Error", fallbackMsg);
      }
    },
    []
  );

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <CustomText style={styles.header}>{appName}</CustomText>
      <CustomText style={styles.description}>{appDescription}</CustomText>

      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>App Information</CustomText>
        <View style={styles.infoItem}>
          <CustomText style={styles.infoLabel}>Version:</CustomText>
          <CustomText style={styles.infoValue}>{version}</CustomText>
        </View>
        <View style={styles.infoItem}>
          <CustomText style={styles.infoLabel}>Build Number:</CustomText>
          <CustomText style={styles.infoValue}>{buildNumber}</CustomText>
        </View>
      </View>

      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>Updates</CustomText>
        <CustomButton
          text="Check for Updates"
          onPress={handleCheckForUpdates}
          loading={loading}
        />
      </View>

      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>Rate this App</CustomText>
        <CustomButton text="Rate Now" onPress={handleRateApp} />
      </View>

      {/* Restructured Legal Section */}
      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>Legal</CustomText>
        <CustomText style={styles.legalText}>
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </CustomText>
        <View style={styles.legalLinks}>
          <LegalLink
            text="Privacy Policy"
            onPress={() =>
              handleOpenUrl(privacyPolicyUrl, "Unable to open Privacy Policy.")
            }
          />
          <CustomText style={styles.legalSeparator}>|</CustomText>
          <LegalLink
            text="Terms & Conditions"
            onPress={() =>
              handleOpenUrl(termsUrl, "Unable to open Terms & Conditions.")
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default About;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainer: {
    padding: moderateScale(16),
  },
  header: {
    fontSize: RFValue(20),
    fontFamily: Fonts.Bold,
    marginBottom: moderateScale(16),
    color: theme.Colors.typography,
  },
  description: {
    fontSize: RFValue(16),
    fontFamily: Fonts.Regular,
    marginBottom: moderateScale(24),
    color: theme.Colors.typography,
  },
  section: {
    marginBottom: moderateScale(24),
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontFamily: Fonts.Medium,
    marginBottom: moderateScale(8),
    color: theme.Colors.primary,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: moderateScale(4),
  },
  infoLabel: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Regular,
    color: theme.Colors.typography,
  },
  infoValue: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Bold,
    color: theme.Colors.typography,
  },
  legalText: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Regular,
    color: theme.Colors.typography,
  },
  legalLinks: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(8),
  },
  legalSeparator: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Medium,
    color: theme.Colors.typography,
    marginHorizontal: moderateScale(8),
  },
  linkText: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Medium,
    color: theme.Colors.primary,
    textDecorationLine: "underline",
  },
}));
