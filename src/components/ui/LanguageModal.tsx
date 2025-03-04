import CustomText from "@/components/CustomText";
import { Fonts } from "@/constants/Fonts";
import React from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  languages: { code: string; name: string; flag: string }[];
  onLanguageSelect: (language: {
    code: string;
    name: string;
    flag: string;
  }) => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  visible,
  onClose,
  languages,
  onLanguageSelect,
}) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      transparent
      animationType="fade"
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.languageList}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={styles.languageOption}
                  onPress={() => onLanguageSelect(language)}
                  activeOpacity={0.8}
                >
                  <CountryFlag
                    isoCode={language.flag}
                    size={RFValue(20)}
                    style={styles.flagIcon}
                  />
                  {/* Display the flag */}
                  <CustomText
                    fontFamily={Fonts.Regular}
                    style={styles.languageText}
                  >
                    {language.name}
                    {" - "}
                    <CustomText style={styles.languageCode}>
                      ({language.code})
                    </CustomText>
                  </CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default LanguageModal;

const stylesheet = createStyleSheet((theme) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: theme.Colors.background,
    borderRadius: theme.border.xs,
    width: "60%",
    padding: 20,
    elevation: 5,
    maxHeight: "70%",
  },
  languageList: {
    gap: 15,
  },
  languageOption: {
    paddingVertical: theme.margins.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    alignSelf: "center",
  },
  languageText: {
    fontSize: RFValue(14),
    textAlign: "center",
  },
  languageCode: {
    fontSize: RFValue(14),
    color: theme.Colors.primary,
  },
  flagIcon: {},
}));
