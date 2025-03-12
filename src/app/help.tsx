import CustomText from "@/components/CustomText";
import { Fonts } from "@/constants/Fonts";
import { useUserStore } from "@/store/userStore";
import * as Sentry from "@sentry/react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Define the different report types that users can choose from using keys.
const reportTypesMap = [
  { key: "bugReport", label: "helpScreen.reportType.bugReport" },
  { key: "feedback", label: "helpScreen.reportType.feedback" },
  { key: "other", label: "helpScreen.reportType.other" },
];

const HelpScreen = () => {
  const { theme, styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  const { currentUser } = useUserStore();

  // State to hold report type, user details, and the report text.
  // Use reportTypesMap[0].key as the default (i.e. "bugReport").
  const [selectedType, setSelectedType] = useState(reportTypesMap[0].key);
  const [userName, setUserName] = useState(currentUser?.display_name || "");
  const [userEmail, setUserEmail] = useState(currentUser?.email_address || "");
  const [reportText, setReportText] = useState("");

  // Handle form submission for the report.
  const handleSubmit = () => {
    // Validate that the user has entered their name.
    if (userName.trim().length === 0) {
      Alert.alert(t("helpScreen.errorTitle"), t("helpScreen.enterName"));
      return;
    }
    // Validate that the user has entered their email address.
    if (userEmail.trim().length === 0) {
      Alert.alert(t("helpScreen.errorTitle"), t("helpScreen.enterEmail"));
      return;
    }
    // Validate that the email format is correct (simple regex check).
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
      Alert.alert(t("helpScreen.errorTitle"), t("helpScreen.validEmail"));
      return;
    }
    // Validate that the user has entered a report description.
    if (reportText.trim().length === 0) {
      Alert.alert(
        t("helpScreen.errorTitle"),
        t("helpScreen.enterReportDescription")
      );
      return;
    }

    // Capture a Sentry event to generate an actual event ID.
    const eventId = Sentry.captureMessage(
      `[${selectedType}] Report: ${reportText}`
    );

    // Get the selected report type label from the mapping.
    const selectedLabel =
      reportTypesMap.find((item) => item.key === selectedType)?.label || "";

    // Build the user feedback object with the captured event ID.
    const userFeedback: Sentry.UserFeedback = {
      event_id: eventId,
      name: userName,
      email: userEmail,
      comments: t("helpScreen.reportFeedback", {
        type: t(selectedLabel),
        report: reportText,
      }),
    };

    // Send the user feedback to Sentry.
    Sentry.captureUserFeedback(userFeedback);

    // Notify the user that their report was submitted.
    Alert.alert(
      t("helpScreen.reportSubmittedTitle"),
      t("helpScreen.reportSubmittedMessage", {
        name: userName,
        email: userEmail,
        type: t(selectedLabel),
      })
    );

    // Clear the input fields after submission.
    setUserName("");
    setUserEmail("");
    setReportText("");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <CustomText
        variant="h5"
        fontFamily={Fonts.Medium}
        style={styles.subTitle}
      >
        {t("helpScreen.subTitle")}
      </CustomText>

      {/* Report Type Selection */}
      <View style={styles.reportTypeContainer}>
        {reportTypesMap.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[styles.reportTypeButton(selectedType, type.key)]}
            onPress={() => setSelectedType(type.key)}
          >
            <CustomText
              style={{
                color:
                  selectedType === type.key ? "white" : theme.Colors.typography,
              }}
            >
              {t(type.label)}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      {/* User Name Input */}
      <TextInput
        style={styles.textInputSmall}
        placeholder={t("helpScreen.placeholderName")}
        placeholderTextColor={theme.Colors.gray[500]}
        value={userName}
        onChangeText={setUserName}
        autoCorrect={false}
      />

      {/* User Email Input */}
      <TextInput
        style={styles.textInputSmall}
        placeholder={t("helpScreen.placeholderEmail")}
        placeholderTextColor={theme.Colors.gray[500]}
        value={userEmail}
        onChangeText={setUserEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Report Description Input */}
      <TextInput
        style={styles.textInput}
        placeholder={t("helpScreen.placeholderDescription")}
        placeholderTextColor={theme.Colors.gray[500]}
        value={reportText}
        onChangeText={setReportText}
        multiline
        textAlignVertical="top"
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <CustomText
          variant="h5"
          fontFamily={Fonts.Medium}
          style={styles.submitButtonText}
        >
          {t("helpScreen.submitReport")}
        </CustomText>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HelpScreen;

const stylesheet = createStyleSheet((theme, rt) => ({
  screen: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: theme.Colors.background,
  },
  subTitle: {
    marginTop: 10,
    color: theme.Colors.gray[500],
  },
  reportTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  reportTypeButton: (selectedType, type) => ({
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor:
      selectedType === type ? theme.Colors.primary : theme.Colors.gray[200],
    backgroundColor:
      selectedType === type ? theme.Colors.primary : "transparent",
  }),
  // Larger input style for report description.
  textInput: {
    height: 150,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: theme.Colors.typography,
    borderColor: theme.Colors.gray[200],
  },
  // Smaller input style for name and email.
  textInputSmall: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: theme.Colors.typography,
    borderColor: theme.Colors.gray[200],
  },
  submitButton: {
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: theme.Colors.primary,
  },
  submitButtonText: {
    color: "#fff",
  },
}));
