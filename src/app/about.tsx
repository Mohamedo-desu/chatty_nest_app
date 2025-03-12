import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import { appName } from "@/constants";
import { Fonts } from "@/constants/Fonts";
import * as Application from "expo-application";
import * as Updates from "expo-updates";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  // App Info
  const version = Application.nativeApplicationVersion;
  const buildNumber = Application.nativeBuildVersion;
  const packageName = Application.applicationId;

  // URL constants
  const privacyPolicyUrl = "https://yourdomain.com/privacy";
  const termsUrl = "https://yourdomain.com/terms";
  // Note: if your app name is dynamic, you might consider translating it elsewhere.
  const appDescription = t("aboutScreen.appDescription");

  const [loading, setLoading] = useState(false);

  // Reusable component for legal links.
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

  // Check for updates using expo-updates.
  const handleCheckForUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        Alert.alert(
          t("aboutScreen.noUpdatesTitle"),
          t("aboutScreen.noUpdatesMessage")
        );
      }
    } catch (error: any) {
      Alert.alert(
        t("aboutScreen.errorTitle"),
        error.message || t("aboutScreen.updateErrorMessage")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Open app store for rating.
  const handleRateApp = useCallback(async () => {
    try {
      const playStoreUrl = `market://details?id=${packageName}`;
      const supported = await Linking.canOpenURL(playStoreUrl);
      const url = supported
        ? playStoreUrl
        : `https://play.google.com/store/apps/details?id=${packageName}`;
      await Linking.openURL(url);
    } catch {
      Alert.alert(t("aboutScreen.errorTitle"), t("aboutScreen.rateError"));
    }
  }, [packageName]);

  const handleOpenUrl = useCallback(
    async (url: string, fallbackMsg: string) => {
      try {
        await Linking.openURL(url);
      } catch {
        Alert.alert(t("aboutScreen.errorTitle"), fallbackMsg);
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
        <CustomText style={styles.sectionTitle}>
          {t("aboutScreen.appInformation")}
        </CustomText>
        <View style={styles.infoItem}>
          <CustomText style={styles.infoLabel}>
            {t("aboutScreen.versionLabel")}
          </CustomText>
          <CustomText style={styles.infoValue}>{version}</CustomText>
        </View>
        <View style={styles.infoItem}>
          <CustomText style={styles.infoLabel}>
            {t("aboutScreen.buildNumberLabel")}
          </CustomText>
          <CustomText style={styles.infoValue}>{buildNumber}</CustomText>
        </View>
      </View>

      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>
          {t("aboutScreen.updates")}
        </CustomText>
        <CustomButton
          text={t("aboutScreen.checkForUpdates")}
          onPress={handleCheckForUpdates}
          loading={loading}
        />
      </View>

      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>
          {t("aboutScreen.rateThisApp")}
        </CustomText>
        <CustomButton text={t("aboutScreen.rateNow")} onPress={handleRateApp} />
      </View>

      {/* Legal Section */}
      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>
          {t("aboutScreen.legal")}
        </CustomText>
        <CustomText style={styles.legalText}>
          {t("aboutScreen.legalText", {
            year: new Date().getFullYear(),
            appName: appName,
          })}
        </CustomText>
        <View style={styles.legalLinks}>
          <LegalLink
            text={t("aboutScreen.privacyPolicy")}
            onPress={() =>
              handleOpenUrl(privacyPolicyUrl, t("aboutScreen.openPrivacyError"))
            }
          />
          <CustomText style={styles.legalSeparator}>|</CustomText>
          <LegalLink
            text={t("aboutScreen.termsAndConditions")}
            onPress={() =>
              handleOpenUrl(termsUrl, t("aboutScreen.openTermsError"))
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
