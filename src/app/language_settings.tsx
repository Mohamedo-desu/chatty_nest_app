import CustomText from "@/components/CustomText";
import { Fonts } from "@/constants/Fonts";
import { getStoredValues, saveSecurely } from "@/store/storage";
import i18next from "i18next";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

interface ListItemProps {
  title: string;
  code: string;
  flag: string;
  selected: boolean;
  onPress: () => void;
}

const LanguageSettings: React.FC = () => {
  const { styles } = useStyles(stylesheet);

  const languageOptions: LanguageOption[] = useMemo(
    () => [
      { code: "en-UK", name: "English", flag: "GB" },
      { code: "ar", name: "Arabic", flag: "SA" },
      { code: "zh", name: "Chinese", flag: "CN" },
      { code: "fr", name: "French", flag: "FR" },
      { code: "de", name: "German", flag: "DE" },
      { code: "hi", name: "Hindi", flag: "IN" },
      { code: "it", name: "Italian", flag: "IT" },
      { code: "ja", name: "Japanese", flag: "JP" },
      { code: "ko", name: "Korean", flag: "KR" },
      { code: "pt", name: "Portuguese", flag: "PT" },
      { code: "ru", name: "Russian", flag: "RU" },
      { code: "so", name: "Somali", flag: "SO" },
      { code: "es", name: "Spanish", flag: "ES" },
      { code: "sw", name: "Kiswahili", flag: "KE" },
    ],
    []
  );

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(
    languageOptions[0]
  );

  // Load the saved language on component mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const { language } = await getStoredValues(["language"]);
        if (language) {
          const savedLanguage: LanguageOption = JSON.parse(language);
          setSelectedLanguage(savedLanguage);
          i18next.changeLanguage(savedLanguage.code, (err: Error | null) => {
            if (err) console.error("Error loading language:", err);
          });
        }
      } catch (error) {
        console.error("Failed to load saved language", error);
      }
    };
    loadLanguage();
  }, []);

  const handleChangeLanguage = useCallback((language: LanguageOption) => {
    i18next.changeLanguage(language.code, (err: Error | null) => {
      if (err) console.error("Error loading language:", err);
    });
    setSelectedLanguage(language);
    saveSecurely([{ key: "language", value: JSON.stringify(language) }]);
  }, []);

  const ListItem: React.FC<ListItemProps> = ({
    title,
    code,
    flag,
    selected,
    onPress,
  }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.itemContainer}
      onPress={onPress}
    >
      <CountryFlag
        isoCode={flag}
        size={moderateScale(20)}
        style={{ marginRight: moderateScale(8) }}
      />
      <CustomText style={styles.itemTitle}>
        {title} <CustomText style={styles.languageCode}>({code})</CustomText>
      </CustomText>
      {selected && <CustomText style={styles.checkmark}>✓</CustomText>}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sectionContainer}>
        <CustomText style={styles.sectionTitle} variant="h6">
          Choose your preferred language
        </CustomText>
        {languageOptions.map((option, index) => (
          <ListItem
            key={index}
            title={option.name}
            code={option.code}
            flag={option.flag}
            selected={selectedLanguage.code === option.code}
            onPress={() => handleChangeLanguage(option)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default LanguageSettings;

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
  languageCode: {
    fontSize: RFValue(12),
    fontFamily: Fonts.Regular,
    color: theme.Colors.typography,
  },
  checkmark: {
    fontSize: RFValue(14),
    color: theme.Colors.primary,
    fontFamily: Fonts.SemiBold,
  },
}));
