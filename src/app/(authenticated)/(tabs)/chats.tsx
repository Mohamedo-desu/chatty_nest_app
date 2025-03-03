import ChatsScreen from "@/components/screens/ChatsScreen";
import GroupsScreen from "@/components/screens/GroupsScreen";
import { Colors } from "@/constants/Colors";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";
import { RFValue } from "react-native-responsive-fontsize";
import { createStyleSheet, useStyles } from "react-native-unistyles";

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

const Chats = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <Tabs.Container
      containerStyle={styles.container}
      initialTabName={"Chats"}
      renderTabBar={tabBar}
    >
      <Tabs.Tab name="Chats">
        <ChatsScreen />
      </Tabs.Tab>
      <Tabs.Tab name="Groups">
        <GroupsScreen />
      </Tabs.Tab>
    </Tabs.Container>
  );
};
const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    marginTop: rt.insets.top,
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
  tabBarStyle: {
    backgroundColor: theme.Colors.background,
  },
}));
export default Chats;
