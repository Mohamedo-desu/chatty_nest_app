import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import {
  BellIcon,
  ChevronRightIcon,
  FunnelIcon,
  InformationCircleIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface PrivacyItem {
  title: string;
  icon: React.FC<{ color: string; width: number; height: number }>;
  onPress?: () => void;
  hasSwitch?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

const PrivacyScreen: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);

  // State for toggle-based privacy options
  const [privateAccount, setPrivateAccount] = useState<boolean>(false);
  const [activityStatus, setActivityStatus] = useState<boolean>(true);
  const [readReceipts, setReadReceipts] = useState<boolean>(true);

  // Define privacy sections and items
  const sections: {
    title: string;
    data: PrivacyItem[];
  }[] = [
    {
      title: "Account Privacy",
      data: [
        {
          title: "Private Account",
          icon: ShieldCheckIcon,
          hasSwitch: true,
          value: privateAccount,
          onValueChange: setPrivateAccount,
        },
        {
          title: "Activity Status",
          icon: BellIcon,
          hasSwitch: true,
          value: activityStatus,
          onValueChange: setActivityStatus,
        },
      ],
    },
    {
      title: "Messaging Privacy",
      data: [
        {
          title: "Read Receipts",
          icon: InformationCircleIcon,
          hasSwitch: true,
          value: readReceipts,
          onValueChange: setReadReceipts,
        },
        {
          title: "Message Filtering",
          icon: FunnelIcon,
          onPress: () => {
            router.navigate("/(authenticated)/message_filtering");
          },
        },
      ],
    },
    {
      title: "Blocking & Restrictions",
      data: [
        {
          title: "Blocked Accounts",
          icon: NoSymbolIcon,
          onPress: () => {
            router.navigate("/(authenticated)/blocked_accounts");
          },
        },
        {
          title: "Restricted Accounts",
          icon: UserIcon,
          onPress: () => {
            router.navigate("/(authenticated)/restricted_accounts");
          },
        },
      ],
    },
  ];

  // Reusable list item component for privacy options
  const ListItem: React.FC<PrivacyItem> = ({
    title,
    icon: IconComponent,
    onPress,
    hasSwitch,
    value,
    onValueChange,
  }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={hasSwitch} // disable press if using switch
    >
      <View style={styles.itemIconContainer}>
        <IconComponent
          color={theme.Colors.primary}
          width={RFValue(20)}
          height={RFValue(20)}
        />
      </View>
      <View style={styles.itemTextContainer}>
        <CustomText style={styles.itemTitle}>{title}</CustomText>
      </View>
      {hasSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          thumbColor={value ? Colors.white : theme.Colors.gray[400]}
          trackColor={{
            false: theme.Colors.gray[300],
            true: theme.Colors.primary,
          }}
        />
      ) : (
        <View style={styles.itemArrowContainer}>
          <ChevronRightIcon
            color={theme.Colors.gray[400]}
            width={RFValue(20)}
            height={RFValue(20)}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.sectionContainer}>
          <CustomText style={styles.sectionTitle}>{section.title}</CustomText>
          {section.data.map((item, itemIndex) => (
            <ListItem key={itemIndex} {...item} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default PrivacyScreen;

const stylesheet = createStyleSheet((theme) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    color: theme.Colors.primary,
    fontSize: RFValue(14),
    fontFamily: Fonts.SemiBold,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.Colors.gray[200],
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemIconContainer: {
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    color: theme.Colors.typography,
    fontSize: RFValue(14),
    fontFamily: Fonts.Regular,
  },
  itemArrowContainer: {
    marginLeft: 12,
  },
}));
