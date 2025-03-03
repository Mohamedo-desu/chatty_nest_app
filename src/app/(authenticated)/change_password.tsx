import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomText from "@/components/CustomText";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import * as Yup from "yup";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

const ChangePassword: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);

  const handleForgotPassword = () => {
    // Replace with navigation logic or any other action
    console.log("Forgot Password pressed");
  };

  return (
    <ScrollView
      style={styles.page}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        padding: moderateScale(16),
      }}
      showsVerticalScrollIndicator={false}
    >
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(
          values: ChangePasswordFormValues,
          helpers: FormikHelpers<ChangePasswordFormValues>
        ) => {
          console.log("Password change values:", values);
          // TODO: Handle password change API call here.
          helpers.resetForm();
        }}
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
              placeholder="Current Password"
              secureTextEntry
              errors={errors.currentPassword}
              touched={touched.currentPassword}
              value={values.currentPassword}
              handleChange={handleChange("currentPassword")}
              handleBlur={handleBlur("currentPassword")}
              rightIcon="lock"
            />
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

            {/* Forgot Password Link */}
            <TouchableOpacity onPress={handleForgotPassword}>
              <CustomText style={styles.forgotPasswordText} variant="body">
                Forgot Password?
              </CustomText>
            </TouchableOpacity>

            <CustomButton text="Change Password" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
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
  forgotPasswordText: {
    color: theme.Colors.primary,
    textAlign: "right",
    textDecorationLine: "underline",
    marginVertical: moderateScale(8),
  },
}));
