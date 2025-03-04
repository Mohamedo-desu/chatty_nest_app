import Following from "@/components/screens/Followings";
import ForYou from "@/components/screens/ForYou";
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

const Home = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <Tabs.Container
      containerStyle={styles.container}
      initialTabName={"For You"}
      renderTabBar={tabBar}
      headerContainerStyle={{ elevation: 0 }}
    >
      <Tabs.Tab name="For You">
        <ForYou />
      </Tabs.Tab>
      <Tabs.Tab name="Followings">
        <Following />
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
    elevation: 0,
  },
}));
export default Home;
