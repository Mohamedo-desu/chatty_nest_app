import CustomText from "@/components/CustomText";
import UserMedia from "@/components/screens/UserMedia";
import UserPosts from "@/components/screens/UserPosts";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useUserStore } from "@/store/userStore";
import { capitalizeWords, shortenNumber } from "@/utils/functions";
import { dateFormatWithYear } from "@/utils/timeUtils";
import dayjs from "dayjs";
import { router } from "expo-router";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";
import {
  CakeIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
} from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { moderateScale } from "react-native-size-matters";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const Header = () => {
  const { styles } = useStyles(stylesheet);

  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <View style={styles.header}>
      <ImageBackground
        style={styles.imageBackground}
        source={{
          uri:
            currentUser.cover_url ||
            "https://static.vecteezy.com/system/resources/thumbnails/049/855/259/small_2x/nature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-photo.jpg",
        }}
        resizeMode="cover"
      >
        <Image
          source={{ uri: currentUser.photo_url || "https://i.pravatar.cc/200" }}
          resizeMode="contain"
          style={styles.profileImage}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={20}
          style={styles.editButton}
          onPress={() => router.navigate("/(authenticated)/edit_profile")}
        >
          <PencilSquareIcon color={Colors.primary} size={RFValue(20)} />
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.profileDetailsContainer}>
        <View>
          <CustomText fontFamily={Fonts.SemiBold} variant="h4">
            {capitalizeWords(currentUser.display_name)}
          </CustomText>
          <CustomText fontSize={14} style={styles.username}>
            @{currentUser.user_name}
          </CustomText>
        </View>
        <View style={styles.profileDetailsContainerRow}>
          <CakeIcon color={Colors.primary} size={RFValue(20)} />
          <CustomText fontSize={14} style={styles.profileDetail}>
            Birth date{" "}
            {dayjs(currentUser.birth_date).format(dateFormatWithYear) || "N/A"}
          </CustomText>
        </View>
        <View style={styles.profileDetailsContainerRow}>
          <CalendarDaysIcon color={Colors.primary} size={RFValue(20)} />
          <CustomText fontSize={14} style={styles.profileDetail}>
            Joined in {dayjs(currentUser.created_at).format(dateFormatWithYear)}
          </CustomText>
        </View>

        <CustomText
          fontSize={RFValue(14)}
          style={[styles.profileDetail, { marginTop: 10 }]}
        >
          {currentUser.user_bio}
        </CustomText>

        <View style={styles.followStatsContainer}>
          <CustomText style={styles.countText}>
            {shortenNumber(currentUser.user_followings?.length)}{" "}
            <CustomText style={styles.followStatLabel}>Followings</CustomText>
          </CustomText>
          <CustomText style={styles.countText}>
            {shortenNumber(currentUser.user_followers?.length)}{" "}
            <CustomText style={styles.followStatLabel}>Followers</CustomText>
          </CustomText>
        </View>
      </View>
    </View>
  );
};

const tabBar = (props) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <MaterialTabBar
      {...props}
      indicatorStyle={styles.indicator}
      activeColor={Colors.primary}
      inactiveColor={theme.Colors.gray[300]}
      pressColor="transparent"
      labelStyle={styles.tabBarLabelStyle}
      style={styles.tabBarStyle}
    />
  );
};

const ProfileScreen = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <Tabs.Container
      renderHeader={Header}
      containerStyle={styles.container}
      initialTabName="Posts"
      renderTabBar={tabBar}
      headerContainerStyle={{ elevation: 0 }}
    >
      <Tabs.Tab name="Posts">
        <UserPosts />
      </Tabs.Tab>
      <Tabs.Tab name="Media">
        <UserMedia />
      </Tabs.Tab>
    </Tabs.Container>
  );
};

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    paddingTop: rt.insets.top,
  },
  header: {
    width: "100%",
    backgroundColor: theme.Colors.background,
  },
  imageBackground: {
    backgroundColor: theme.Colors.gray[100],
    width: "100%",
    height: moderateScale(150),
  },
  headerIconsContainer: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 20,
    width: 40,
    aspectRatio: 1,
    marginHorizontal: 15,
    marginTop: 10,
  },
  profileImage: {
    backgroundColor: theme.Colors.primary,
    width: 80,
    aspectRatio: 1,
    borderRadius: 50,
    position: "absolute",
    bottom: -40,
    left: 15,
    borderWidth: 3,
    borderColor: theme.Colors.white,
  },
  profileDetailsContainer: {
    marginTop: 50,
    marginBottom: rt.insets.top,
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    gap: 10,
  },
  username: {
    color: theme.Colors.gray[400],
  },
  profileDetail: {
    color: theme.Colors.gray[400],
  },
  followStatsContainer: {
    flexDirection: "row",
    gap: 25,
  },
  countText: {
    fontFamily: Fonts.Medium,
    fontSize: RFValue(20),
  },
  followStatLabel: {
    color: theme.Colors.gray[400],
    fontSize: RFValue(16),
  },

  indicator: {
    backgroundColor: theme.Colors.primary,
    height: 2,
  },
  tabBarLabelStyle: {
    textTransform: "capitalize",
    fontFamily: theme.fonts.Medium,
    fontSize: RFValue(16),
  },
  editButton: {
    position: "absolute",
    bottom: -50,
    right: 15,
  },
  tabBarStyle: {
    backgroundColor: theme.Colors.background,
  },
  profileDetailsContainerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
}));

export default ProfileScreen;
