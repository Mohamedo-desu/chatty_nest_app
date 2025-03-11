import { getStoredValues } from "@/store/storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ar } from "./languages/ar";
import { de } from "./languages/de";
import { en } from "./languages/en";
import { es } from "./languages/es";
import { fr } from "./languages/fr";
import { hi } from "./languages/hi";
import { it } from "./languages/it";
import { ja } from "./languages/ja";
import { ko } from "./languages/ko";
import { pt } from "./languages/pt";
import { ru } from "./languages/ru";
import { so } from "./languages/so";
import { sw } from "./languages/sw";
import { zh } from "./languages/zh";

// Retrieve the stored language from your storage
const stored = getStoredValues(["language"]);
let defaultLanguage = "en";

if (stored.language) {
  try {
    const parsed = JSON.parse(stored.language);
    defaultLanguage = parsed.code || "en";
  } catch (error) {
    console.error("Error parsing stored language:", error);
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en,
    so,
    ar,
    hi,
    pt,
    ru,
    ja,
    ko,
    fr,
    es,
    de,
    it,
    zh,
    sw,
  },
  lng: defaultLanguage, // Set default language dynamically
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
