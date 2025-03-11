import { getStoredValues, saveSecurely } from "@/store/storage";
import i18next from "i18next";
import { useCallback, useMemo, useState } from "react";

export const useLanguage = () => {
  const languages = useMemo(
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

  const getInitialLanguage = () => {
    const { language } = getStoredValues(["language"]);
    if (language) {
      try {
        const parsed = JSON.parse(language);
        // Return the matching language if available
        const found = languages.find((lang) => lang.code === parsed.code);
        return found || languages[0];
      } catch (error) {
        console.error("Error parsing saved language:", error);
      }
    }
    return languages[0];
  };

  // Get the initial language and inform i18next immediately.
  const initialLanguage = getInitialLanguage();

  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleChangeLanguage = useCallback(
    (language: { code: string; name: string; flag: string }) => {
      i18next.changeLanguage(language.code, (err) => {
        if (err) console.error("Error loading language:", err);
      });
      setSelectedLanguage(language);
      setLanguageModalVisible(false);
      saveSecurely([{ key: "language", value: JSON.stringify(language) }]);
    },
    []
  );

  return {
    selectedLanguage,
    setLanguageModalVisible,
    languageModalVisible,
    languages,
    handleChangeLanguage,
  };
};
