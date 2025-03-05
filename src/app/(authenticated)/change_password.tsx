import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomText from "@/components/CustomText";
import { showToast } from "@/components/toast/ShowToast";
import { Colors } from "@/constants/Colors";
import { useUserStore } from "@/store/userStore";
import { useSignIn } from "@clerk/clerk-expo";
import { Formik } from "formik";
import React, { useState } from "react";
import { Modal, ScrollView, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import * as Yup from "yup";

interface ChangePasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

const ChangePassword: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  // Save form values to use later in the verification step.
  const [passwordValues, setPasswordValues] =
    useState<ChangePasswordFormValues | null>(null);

  const currentUser = useUserStore((state) => state.currentUser);

  // Called when user submits the new password form.
  // It sends an OTP (reset password email code) to the user's email.
  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    try {
      setLoading(true);
      if (!isLoaded) return;

      // Save the new password for later verification.
      setPasswordValues(values);

      // Send OTP to the user's email.
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: currentUser?.email_address,
      });

      // Show the OTP verification modal.
      setVerifying(true);
    } catch (error: any) {
      console.log(error);
      showToast("error", "Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Once the user enters the OTP, this function verifies it and updates the password.
  const handleVerify = async () => {
    try {
      if (!isLoaded) return;
      setLoading(true);

      const newPassword = passwordValues?.newPassword;
      if (!newPassword) {
        throw new Error("New password is not available.");
      }

      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      // if (result?.status === "complete") {
      //   showToast("success", "Success", "Password reset successfully!");
      //   await setActive({ session: result.createdSessionId });
      // } else {
      //   console.log("Reset password result:", result);
      // }
    } catch (error: any) {
      showToast("error", "Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.page}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1, padding: moderateScale(16) }}
      showsVerticalScrollIndicator={false}
    >
      <Formik
        initialValues={{
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleChangePassword}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            <CustomInput
              placeholder="New Password"
              secureTextEntry
              errors={errors.newPassword}
              touched={touched.newPassword}
              value={values.newPassword}
              handleChange={handleChange("newPassword")}
              handleBlur={handleBlur("newPassword")}
              rightIcon="lock"
            />
            <CustomInput
              placeholder="Confirm Password"
              secureTextEntry
              errors={errors.confirmPassword}
              touched={touched.confirmPassword}
              value={values.confirmPassword}
              handleChange={handleChange("confirmPassword")}
              handleBlur={handleBlur("confirmPassword")}
              rightIcon="lock"
            />

            <CustomButton
              text="Change Password"
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        )}
      </Formik>

      {/* Verification Modal */}
      <Modal visible={verifying} transparent animationType="fade">
        <View style={styles.modalOverlay}>
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
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ChangePassword;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  formContainer: {
    width: "100%",
    gap: moderateScale(15),
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
    marginVertical: moderateScale(15),
  },
}));
