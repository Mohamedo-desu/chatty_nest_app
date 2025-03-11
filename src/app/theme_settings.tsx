import CustomText from "@/components/CustomText";
import { Fonts } from "@/constants/Fonts";
import { useSettingsStore } from "@/store/settingsStore";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const ThemeSettings = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();
  const { theme: currTheme, setTheme } = useSettingsStore();

  const themeOptions = [
    { title: t("themeSettings.light"), value: "light" },
    { title: t("themeSettings.dark"), value: "dark" },
    { title: t("themeSettings.system"), value: "system" },
  ];

  // Reusable list item component.
  const ListItem = ({ title, value, selected, onPress }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <CustomText style={styles.itemTitle}>{title}</CustomText>
      {selected && <CustomText style={styles.checkmark}>✓</CustomText>}
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerTitle: t("themeSettings.headerTitle") }} />
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <CustomText style={styles.sectionTitle} variant="h6">
            {t("themeSettings.chooseTheme")}
          </CustomText>
          {themeOptions.map((option, index) => (
            <ListItem
              key={index}
              title={option.title}
              value={option.value}
              selected={currTheme === option.value}
              onPress={() => setTheme(option.value)}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default ThemeSettings;

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
  checkmark: {
    fontSize: RFValue(14),
    color: theme.Colors.primary,
    fontFamily: Fonts.SemiBold,
  },
}));
