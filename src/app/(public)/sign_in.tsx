import AuthHeader from "@/components/AuthHeader";
import BreakerText from "@/components/BreakerText";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomText from "@/components/CustomText";
import PrivacyTerms from "@/components/PrivacyTerms";
import SocialLogin from "@/components/SocialLogin";
import { showToast } from "@/components/toast/ShowToast";
import { getStoredValues, saveSecurely } from "@/store/storage";
import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import * as Yup from "yup";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const SigninScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCleared, setPasswordCleared] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();

  const { t } = useTranslation();

  const { styles } = useStyles(stylesheet);

  const initialValues = {
    email,
    password,
  };

  const handleSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      if (!isLoaded) return;

      setLoading(true);
      saveSecurely([
        { key: "email", value: email },
        { key: "password", value: password },
      ]);

      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      }
    } catch (error: any) {
      console.log("Sign-in error:", error);
      showToast("error", "Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (password: string) => {
    if (password.trim().length === 0 && !passwordCleared) {
      setPasswordCleared(true);
    }
  };

  useEffect(() => {
    const fetchStoredValues = async () => {
      const { email, password } = await getStoredValues(["email", "password"]);
      setEmail(email || "");
      setPassword(password || "");
      setPasswordCleared(!password || password.trim().length === 0);
    };
    fetchStoredValues();
  }, []);

  const SignInValidationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email()
      .required(t("validation.email") + " " + t("validation.required"))
      .label(t("validation.email")),
    password: Yup.string()
      .trim()
      .min(8)
      .max(35)
      .required(t("validation.password") + " " + t("validation.required"))
      .label(t("validation.password")),
  });

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardDismissMode="on-drag"
    >
      <AuthHeader
        title={t("signIn.title")}
        description={t("signIn.description")}
        showArrow={false}
      />
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={SignInValidationSchema}
        onSubmit={(values) => handleSignIn(values)}
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
              placeholder={t("signIn.emailPlaceholder")}
              errors={errors.email}
              touched={touched.email}
              value={values.email}
              handleChange={handleChange("email")}
              handleBlur={handleBlur("email")}
              autoComplete={"email"}
              rightIcon={"email"}
            />
            <CustomInput
              placeholder={t("signIn.passwordPlaceholder")}
              errors={errors.password}
              touched={touched.password}
              value={values.password}
              handleChange={(e) => {
                handleChange("password")(e);
                handlePasswordChange(e);
              }}
              handleBlur={handleBlur("password")}
              autoComplete={"password"}
              secureTextEntry={!showPassword}
              rightIcon={
                passwordCleared ? (showPassword ? "eye-off" : "eye") : null
              }
              onPressRightIcon={() => setShowPassword(!showPassword)}
            />
            <View style={styles.forgotPasswordContainer}>
              <Link href={"/(public)/sign_up"}>
                <CustomText style={styles.forgotPassword}>
                  {t("signIn.signUp")}
                </CustomText>
              </Link>
              <Link href={"/(public)/forgot_password"}>
                <CustomText style={styles.forgotPassword}>
                  {t("signIn.forgotPassword")}
                </CustomText>
              </Link>
            </View>
            <CustomButton
              loading={loading}
              text={t("signIn.signIn")}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
      <BreakerText text={t("signIn.or")} />
      <SocialLogin />
      <PrivacyTerms />
    </KeyboardAwareScrollView>
  );
};

export default SigninScreen;

const stylesheet = createStyleSheet((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  formikContainer: {
    width: "100%",
    marginTop: 20,
    gap: 20,
  },
  forgotPassword: {
    textAlign: "right",
    color: theme.Colors.primary,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
