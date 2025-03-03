import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import * as Yup from "yup";

// Define form values interface (bio added)
interface EditProfileFormValues {
  displayName: string;
  username: string;
  birthdate: string;
  bio: string;
}

// Validation schema (bio is optional)
const validationSchema = Yup.object().shape({
  displayName: Yup.string().required("Display name is required"),
  username: Yup.string()
    .matches(/^\S*$/, "Username should not contain white space")
    .required("Username is required"),
  birthdate: Yup.string().required("Birthdate is required"),
  bio: Yup.string(), // Optional bio field
});

const EditProfile: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");

  // Moves a local image to the "chattyNest Images" directory
  const moveImageToChattyNest = async (uri: string): Promise<string> => {
    try {
      const directory = FileSystem.documentDirectory + "chattyNest Images/";
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }
      const fileName = uri.split("/").pop();
      const newUri = directory + fileName;
      await FileSystem.moveAsync({ from: uri, to: newUri });
      return newUri;
    } catch (error) {
      console.error("Error moving image:", error);
      return uri; // fallback to original uri if moving fails
    }
  };

  // Prompts the user to pick an image and updates the provided state setter
  const selectImage = async (
    setImage: (value: string) => void
  ): Promise<void> => {
    Alert.alert("Select Image", "Choose an option", [
      {
        text: "Camera",
        onPress: async () => {
          const cameraPermission =
            await ImagePicker.requestCameraPermissionsAsync();
          if (!cameraPermission.granted) {
            Alert.alert("Permission to access camera is required!");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.5,
          });
          if (!result.canceled && result.assets && result.assets.length > 0) {
            const newUri = await moveImageToChattyNest(result.assets[0].uri);
            setImage(newUri);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const libraryPermission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!libraryPermission.granted) {
            Alert.alert("Permission to access gallery is required!");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.5,
          });
          if (!result.canceled && result.assets && result.assets.length > 0) {
            const newUri = await moveImageToChattyNest(result.assets[0].uri);
            setImage(newUri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <ScrollView
      style={styles.page}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: moderateScale(20) }}
    >
      {/* Profile and Cover Image Pickers */}
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => selectImage(setProfileImage)}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.imagePreview} />
          ) : (
            <CustomText style={styles.imagePlaceholder} variant="h7">
              Select Profile Image
            </CustomText>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => selectImage(setCoverImage)}
        >
          {coverImage ? (
            <Image source={{ uri: coverImage }} style={styles.imagePreview} />
          ) : (
            <CustomText style={styles.imagePlaceholder} variant="h7">
              Select Cover Image
            </CustomText>
          )}
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <Formik
        initialValues={{
          displayName: "",
          username: "",
          birthdate: "",
          bio: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(
          values: EditProfileFormValues,
          helpers: FormikHelpers<EditProfileFormValues>
        ) => {
          // Handle form submission (e.g., API call)
          console.log("Form values:", values);
          console.log("Profile Image:", profileImage);
          console.log("Cover Image:", coverImage);
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
          setFieldValue,
        }) => (
          <View style={styles.formContainer}>
            <CustomInput
              placeholder="Display Name"
              errors={errors.displayName}
              touched={touched.displayName}
              value={values.displayName}
              handleChange={handleChange("displayName")}
              handleBlur={handleBlur("displayName")}
              autoComplete="additional-name"
              rightIcon="account"
            />
            <CustomInput
              placeholder="User Name"
              errors={errors.username}
              touched={touched.username}
              value={values.username}
              handleChange={handleChange("username")}
              handleBlur={handleBlur("username")}
              rightIcon="account"
            />
            {/* Bio Editor */}
            <CustomInput
              placeholder="Bio"
              errors={errors.bio}
              touched={touched.bio}
              value={values.bio}
              handleChange={handleChange("bio")}
              handleBlur={handleBlur("bio")}
              style={{ height: moderateScale(80) }}
            />
            {/* Birthdate Picker */}
            <TouchableOpacity
              style={[styles.input, { justifyContent: "center" }]}
              onPress={() => setShowDatePicker(true)}
            >
              <CustomText
                style={{
                  color: values.birthdate
                    ? theme.Colors.typography
                    : theme.Colors.gray[400],
                  fontSize: RFValue(16),
                }}
                variant="h7"
              >
                {values.birthdate ? values.birthdate : "Select Birthdate"}
              </CustomText>
            </TouchableOpacity>
            {touched.birthdate && errors.birthdate && (
              <Text style={styles.errorText}>{errors.birthdate}</Text>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={
                  values.birthdate ? new Date(values.birthdate) : new Date()
                }
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={(event, selectedDate?: Date) => {
                  if (Platform.OS !== "ios") {
                    setShowDatePicker(false);
                  }
                  if (selectedDate) {
                    const formattedDate = selectedDate
                      .toISOString()
                      .split("T")[0];
                    setFieldValue("birthdate", formattedDate);
                  }
                }}
              />
            )}
            <CustomButton text="Save" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default EditProfile;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    padding: moderateScale(16),
    backgroundColor: theme.Colors.background,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(15),
  },
  imagePicker: {
    flex: 1,
    height: moderateScale(150),
    borderWidth: 2,
    borderColor: theme.Colors.gray[200],
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    marginHorizontal: moderateScale(5),
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(8),
  },
  imagePlaceholder: {
    color: theme.Colors.gray[300],
    fontSize: moderateScale(16),
  },
  formContainer: {
    width: "100%",
    gap: moderateScale(15),
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.Colors.gray[50],
    borderRadius: theme.border.xs,
    borderWidth: 1,
    borderColor: theme.Colors.gray[200],
    paddingHorizontal: theme.margins.md,
    height: moderateScale(50),
  },
  errorText: {
    color: Colors.error,
    marginBottom: moderateScale(8),
    fontSize: moderateScale(12),
  },
}));
