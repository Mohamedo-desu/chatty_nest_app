import CustomText from "@/components/CustomText";
import { Fonts } from "@/constants/Fonts";
import * as Sentry from "@sentry/react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Define the different report types that users can choose from
const reportTypes = ["Bug Report", "Feedback", "Other"];

const HelpScreen = () => {
  const { theme, styles } = useStyles(stylesheet);

  // State to hold report type, user details, and the report text
  const [selectedType, setSelectedType] = useState(reportTypes[0]); // Default to "Bug Report"
  const [userName, setUserName] = useState(""); // User's name
  const [userEmail, setUserEmail] = useState(""); // User's email
  const [reportText, setReportText] = useState(""); // Report description

  // Handle form submission for the report
  const handleSubmit = () => {
    // Validate that the user has entered their name
    if (userName.trim().length === 0) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }
    // Validate that the user has entered their email address
    if (userEmail.trim().length === 0) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    // Validate that the email format is correct (simple regex check)
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    // Validate that the user has entered a report description
    if (reportText.trim().length === 0) {
      Alert.alert("Error", "Please enter a description for your report.");
      return;
    }

    // Capture a Sentry event to generate an actual event ID.
    // The message includes the report type and description.
    const eventId = Sentry.captureMessage(
      `[${selectedType}] Report: ${reportText}`
    );

    // Build the user feedback object with the captured event ID
    const userFeedback: Sentry.UserFeedback = {
      event_id: eventId,
      name: userName,
      email: userEmail,
      comments: `Report Type: ${selectedType}\n\n${reportText}`,
    };

    // Send the user feedback to Sentry
    Sentry.captureUserFeedback(userFeedback);

    // Optionally, notify the user that their report was submitted
    Alert.alert(
      "Report Submitted",
      `Name: ${userName}\nEmail: ${userEmail}\nType: ${selectedType}`
    );

    // Clear the input fields after submission
    setUserName("");
    setUserEmail("");
    setReportText("");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={[styles.screen]}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <CustomText
        variant="h5"
        fontFamily={Fonts.Medium}
        style={styles.subTitle}
      >
        Please let us know your feedback or any issues you are facing.
      </CustomText>

      {/* Report Type Selection */}
      <View style={styles.reportTypeContainer}>
        {reportTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.reportTypeButton(selectedType, type)]}
            onPress={() => setSelectedType(type)}
          >
            <CustomText
              style={
                {
                  // Change text color based on selection
                }
              }
            >
              {type}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      {/* User Name Input */}
      <TextInput
        style={[styles.textInputSmall, {}]}
        placeholder="Your Name"
        placeholderTextColor={theme.Colors.gray[500]}
        value={userName}
        onChangeText={setUserName}
        autoCorrect={false}
      />

      {/* User Email Input */}
      <TextInput
        style={styles.textInputSmall}
        placeholder="Your Email"
        placeholderTextColor={theme.Colors.gray[500]}
        value={userEmail}
        onChangeText={setUserEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Report Description Input */}
      <TextInput
        style={[styles.textInput, {}]}
        placeholder="Describe your issue or feedback here..."
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
          Submit Report
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
  // Larger input style for report description
  textInput: {
    height: 150,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: theme.Colors.typography,
    borderColor: theme.Colors.gray[200],
  },
  // Smaller input style for name and email
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
