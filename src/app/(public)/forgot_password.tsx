import AuthHeader from "@/components/AuthHeader";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { showToast } from "@/components/toast/ShowToast";
import { useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const ForgotPasswordScreen = () => {
  const [loading, setLoading] = useState(false);
  const { isLoaded, signIn } = useSignIn();

  const { t } = useTranslation();

  const { styles } = useStyles(stylesheet);

  const handleRequest = async ({ email }: { email: string }) => {
    try {
      if (!isLoaded) {
        return null;
      }
      setLoading(true);

      await signIn
        ?.create({
          strategy: "reset_password_email_code",
          identifier: email,
        })
        .then((_) => {
          showToast("success", "Success", "Reset code sent to your email.");

          router.push({
            pathname: "/(public)/reset_password",
            params: { email },
          });
        })
        .catch((err) => {
          console.error("error", err.errors[0].longMessage);
        });
    } catch (error: any) {
      //console.error("Error:", error.message);
      showToast("error", "Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AuthHeader
        title={t("forgotPassword.title")}
        description={t("forgotPassword.description")}
        showArrow={false}
      />
      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values) => handleRequest(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formikContainer}>
            <CustomInput
              placeholder={t("forgotPassword.emailPlaceholder")}
              errors={errors.email}
              touched={touched.email}
              value={values.email}
              handleChange={handleChange("email")}
              handleBlur={handleBlur("email")}
              autoComplete={"email"}
              rightIcon={"email"}
            />
            <CustomButton
              loading={loading}
              text={t("forgotPassword.submit")}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default ForgotPasswordScreen;

const stylesheet = createStyleSheet((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.Colors.background,
    paddingHorizontal: 16,
  },
  formikContainer: {
    width: "100%",
    marginTop: 20,
    gap: 20,
  },
}));
