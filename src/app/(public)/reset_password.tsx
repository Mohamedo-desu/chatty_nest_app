import AuthHeader from "@/components/AuthHeader";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import useTimer from "@/hooks/useTimer";
import { useSignIn } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import * as Yup from "yup";

const ResetPasswordScreen = () => {
  const { displayTime, timerUp, resetTimer } = useTimer();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { email }: { email: string } = useLocalSearchParams();
  const { isLoaded, signIn, setActive } = useSignIn();

  const { t } = useTranslation();

  const { styles } = useStyles(stylesheet);

  const handleChangePassword = async ({
    resetCode,
    newPassword,
  }: {
    resetCode: string;
    newPassword: string;
  }) => {
    try {
      if (!isLoaded) {
        return null;
      }
      setLoading(true);
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode,
        password: newPassword,
      });

      if (result?.status === "complete") {
        showToast("success", "Success", "Password reset successfully!");

        await setActive({ session: result.createdSessionId });
      } else {
        console.log("Reset password result:", result);
      }
    } catch (error: any) {
      //console.error(error);
      showToast("error", "Error", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleResendCode = async () => {
    try {
      if (!isLoaded) {
        return null;
      }

      await signIn
        ?.create({
          strategy: "reset_password_email_code",
          identifier: email,
        })
        .then((_) => {
          resetTimer();
        })
        .catch((error) => {
          // console.error("error", error.errors[0].longMessage);
          showToast("error", "Error", error.message);
        });
    } catch (error: any) {
      console.error(error);
    }
  };

  const ResetPasswordValidationSchema = Yup.object().shape({
    resetCode: Yup.string()
      .trim()
      .required(t("validation.reset") + " " + t("validation.required"))
      .label(t("validation.reset")),
    newPassword: Yup.string()
      .trim()
      .min(8)
      .max(35)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        t("validation.passwordRequirement")
      )
      .required(t("validation.password") + " " + t("validation.required"))
      .label(t("validation.password")),
    confirmNewPassword: Yup.string()
      .trim()
      .oneOf([Yup.ref("newPassword")], t("validation.passwordMatch")),
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!timerUp()) {
          showToast(
            "error",
            "Action Blocked",
            "Please wait for the timer to complete."
          );
          return true; // Prevent default behavior
        }
        return false; // Allow default behavior
      }
    );

    return () => backHandler.remove(); // Clean up listener on unmount
  }, [timerUp]);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardDismissMode="on-drag"
    >
      <AuthHeader
        title={t("resetPassword.title")}
        description={t("resetPassword.description", { email })}
        showArrow={false}
      />
      <Formik
        initialValues={{
          resetCode: "",
          newPassword: "",
          confirmNewPassword: "",
        }}
        enableReinitialize
        validationSchema={ResetPasswordValidationSchema}
        onSubmit={(values) => handleChangePassword(values)}
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
              placeholder={t("resetPassword.resetCodePlaceholder")}
              errors={errors.resetCode}
              touched={touched.resetCode}
              value={values.resetCode}
              handleChange={handleChange("resetCode")}
              handleBlur={handleBlur("resetCode")}
              autoComplete={"cc-number"}
              rightIcon={"key"}
              keyboardType="numeric"
            />
            <CustomInput
              placeholder={t("resetPassword.newPasswordPlaceholder")}
              errors={errors.newPassword}
              touched={touched.newPassword}
              value={values.newPassword}
              handleChange={handleChange("newPassword")}
              handleBlur={handleBlur("newPassword")}
              autoComplete={"password"}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? "eye-off" : "eye"}
              onPressRightIcon={() => setShowPassword(!showPassword)}
            />
            <CustomInput
              placeholder={t("resetPassword.confirmPasswordPlaceholder")}
              errors={errors.confirmNewPassword}
              touched={touched.confirmNewPassword}
              value={values.confirmNewPassword}
              handleChange={handleChange("confirmNewPassword")}
              handleBlur={handleBlur("confirmNewPassword")}
              autoComplete={"password"}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? "eye-off" : "eye"}
              onPressRightIcon={() => setShowPassword(!showPassword)}
            />
            <CustomButton
              loading={loading}
              text={t("resetPassword.resetPassword")}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
      <View
        style={{
          marginVertical: 40,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {timerUp() ? (
          <TouchableOpacity onPress={handleResendCode} activeOpacity={0.8}>
            <CustomText
              fontFamily={Fonts.Medium}
              variant="h6"
              style={{
                borderWidth: 2,
                borderColor: Colors.primary,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderStyle: "dashed",
              }}
            >
              {t("resetPassword.resendCode")}
            </CustomText>
          </TouchableOpacity>
        ) : (
          <CustomText fontFamily={Fonts.Bold} variant="h6">
            {t("resetPassword.resendCodeIn", { displayTime: displayTime() })}
          </CustomText>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ResetPasswordScreen;

const stylesheet = createStyleSheet((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  formikContainer: {
    width: "100%",
    marginTop: 20,
    gap: 20,
  },
}));
