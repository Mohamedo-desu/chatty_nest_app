import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { ScrollView, Switch, TextInput, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import * as Yup from "yup";

interface MessageFilteringFormValues {
  filterUnknown: boolean;
  filterExplicit: boolean;
  blockedKeywords: string;
}

// Yup validation schema (blockedKeywords is optional)
const validationSchema = Yup.object().shape({
  blockedKeywords: Yup.string(),
});

/**
 * Helper function that takes a comma-separated string of keywords and returns an array.
 */
const processBlockedKeywords = (keywords: string): string[] =>
  keywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

const MessageFilteringScreen: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <Formik
        initialValues={{
          filterUnknown: false,
          filterExplicit: false,
          blockedKeywords: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(
          values: MessageFilteringFormValues,
          helpers: FormikHelpers<MessageFilteringFormValues>
        ) => {
          // Process the blocked keywords into an array
          const keywordsArray = processBlockedKeywords(values.blockedKeywords);
          console.log("Filtering values:", {
            ...values,
            blockedKeywords: keywordsArray,
          });
          // TODO: Call your API to save filtering settings here.
          helpers.resetForm();
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            {/* Toggle for filtering messages from unknown senders */}
            <View style={styles.toggleContainer}>
              <CustomText style={styles.toggleLabel}>
                Filter messages from unknown senders
              </CustomText>
              <Switch
                value={values.filterUnknown}
                onValueChange={(val) => setFieldValue("filterUnknown", val)}
                thumbColor={
                  values.filterUnknown ? Colors.white : theme.Colors.gray[300]
                }
                trackColor={{
                  false: theme.Colors.gray[200],
                  true: theme.Colors.primary,
                }}
              />
            </View>

            {/* Toggle for filtering explicit language */}
            <View style={styles.toggleContainer}>
              <CustomText style={styles.toggleLabel}>
                Filter messages with explicit language
              </CustomText>
              <Switch
                value={values.filterExplicit}
                onValueChange={(val) => setFieldValue("filterExplicit", val)}
                thumbColor={
                  values.filterExplicit ? Colors.white : theme.Colors.gray[300]
                }
                trackColor={{
                  false: theme.Colors.gray[200],
                  true: theme.Colors.primary,
                }}
              />
            </View>

            {/* Blocked Keywords Input */}
            <CustomText style={styles.inputLabel}>
              Blocked Keywords (comma separated)
            </CustomText>
            <TextInput
              value={values.blockedKeywords}
              onChangeText={handleChange("blockedKeywords")}
              onBlur={handleBlur("blockedKeywords")}
              placeholder="Enter keywords separated by commas"
              placeholderTextColor={theme.Colors.gray[400]}
              multiline
              style={styles.blockedKeywordsInput}
            />
            {touched.blockedKeywords && errors.blockedKeywords ? (
              <CustomText style={styles.errorText}>
                {errors.blockedKeywords}
              </CustomText>
            ) : null}

            <CustomButton text="Save Settings" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default MessageFilteringScreen;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    padding: moderateScale(16),
    paddingBottom: moderateScale(20),
  },
  header: {
    fontSize: RFValue(18),
    fontFamily: Fonts.SemiBold,
    color: theme.Colors.typography,
    marginBottom: moderateScale(20),
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    gap: moderateScale(20),
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: theme.Colors.gray[200],
  },
  toggleLabel: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Regular,
    color: theme.Colors.typography,
    flex: 1,
  },
  inputLabel: {
    fontSize: RFValue(14),
    fontFamily: Fonts.SemiBold,
    color: theme.Colors.typography,
    marginBottom: moderateScale(8),
  },
  blockedKeywordsInput: {
    height: moderateScale(80),
    borderWidth: 1,
    borderColor: theme.Colors.gray[200],
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    fontSize: RFValue(14),
    backgroundColor: theme.Colors.gray[50],
    textAlignVertical: "top",
  },
  errorText: {
    color: Colors.error,
    fontSize: moderateScale(12),
  },
}));
