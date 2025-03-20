import AuthHeader from "@/components/AuthHeader";
import BreakerText from "@/components/BreakerText";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomText from "@/components/CustomText";
import PrivacyTerms from "@/components/PrivacyTerms";
import SocialLogin from "@/components/SocialLogin";
import { showToast } from "@/components/toast/ShowToast";
import { Colors } from "@/constants/Colors";
import { saveSecurely } from "@/store/storage";
import { useSignUp } from "@clerk/clerk-expo";
import { Formik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import * as Yup from "yup";

const SignUpScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const { t } = useTranslation();
  const { isLoaded, signUp, setActive } = useSignUp();

  const { styles } = useStyles(stylesheet);

  const handleSignUpEmail = async ({
    email,
    password,
    displayName,
  }: {
    email: string;
    password: string;
    displayName: string;
  }) => {
    try {
      if (!isLoaded) return;
      setLoading(true);

      saveSecurely([
        { key: "email", value: email },
        { key: "password", value: password },
      ]);

      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: {
          displayName,
        },
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (error: any) {
      //console.error("Sign-up error:", error);
      showToast("error", "Error", error.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      if (!isLoaded) return;

      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        showToast("success", "Success", "Email verified successfully!");
        setVerifying(false);
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error: any) {
      setLoading(false);
      //console.error("Verification error:", err);
      showToast("error", "Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const SignUpValidationSchema = Yup.object().shape({
    displayName: Yup.string().required("Display name is required"),
    email: Yup.string()
      .trim()
      .email()
      .required(t("validation.email") + " " + t("validation.required"))
      .label(t("validation.email"))
      .test("email", t("validation.invalidEmail"), (value) => {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
      }),
    password: Yup.string()
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
      .oneOf([Yup.ref("password")], t("validation.passwordMatch")),
  });

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
      >
        <AuthHeader
          title={t("signUp.title")}
          description={t("signUp.description")}
          showArrow={false}
        />
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmNewPassword: "",
            displayName: "",
          }}
          validationSchema={SignUpValidationSchema}
          onSubmit={handleSignUpEmail}
          enableReinitialize
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
                placeholder={t("signUp.displayNamePlaceholder")}
                errors={errors.displayName}
                touched={touched.displayName}
                value={values.displayName}
                handleChange={handleChange("displayName")}
                handleBlur={handleBlur("displayName")}
                rightIcon="account"
              />
              <CustomInput
                placeholder={t("signUp.emailPlaceholder")}
                errors={errors.email}
                touched={touched.email}
                value={values.email}
                handleChange={handleChange("email")}
                handleBlur={handleBlur("email")}
                autoComplete="email"
                rightIcon="email"
              />
              <CustomInput
                placeholder={t("signUp.passwordPlaceholder")}
                errors={errors.password}
                touched={touched.password}
                value={values.password}
                handleChange={handleChange("password")}
                handleBlur={handleBlur("password")}
                autoComplete="password"
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? "eye-off" : "eye"}
                onPressRightIcon={() => setShowPassword(!showPassword)}
              />
              <CustomInput
                placeholder={t("signUp.confirmPasswordPlaceholder")}
                errors={errors.confirmNewPassword}
                touched={touched.confirmNewPassword}
                value={values.confirmNewPassword}
                handleChange={handleChange("confirmNewPassword")}
                handleBlur={handleBlur("confirmNewPassword")}
                autoComplete="password"
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? "eye-off" : "eye"}
                onPressRightIcon={() => setShowPassword(!showPassword)}
              />

              <CustomButton
                loading={loading}
                text={t("signUp.signUp")}
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>

        <BreakerText text={t("signIn.or")} />
        <SocialLogin />

        <PrivacyTerms />

        {/* Verification Modal */}
      </ScrollView>
      <Modal
        visible={verifying}
        transparent
        animationType="fade"
        onDismiss={() => setVerifying(false)}
        onRequestClose={() => setVerifying(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setVerifying(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <CustomText style={styles.modalTitle}>Verify Your Email</CustomText>
            <CustomInput
              placeholder="Enter verification code"
              value={code}
              handleChange={setCode}
              keyboardType="numeric"
              rightIcon="key"
              style={styles.input}
            />
            <CustomButton
              text="Verify"
              onPress={handleVerify}
              loading={loading}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default SignUpScreen;

const stylesheet = createStyleSheet((theme) => ({
  screen: {
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

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    padding: theme.margins.lg,
    backgroundColor: theme.Colors.background,
    borderRadius: theme.border.md,
    alignItems: "center",
    gap: 20,
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontFamily: theme.fonts.SemiBold,
    color: Colors.primary,
  },
  input: {
    width: "100%",
  },
}));
