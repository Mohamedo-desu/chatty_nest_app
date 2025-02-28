import { UnistylesRegistry } from "react-native-unistyles";
import { breakpoints } from "./breakpoints";
import { darkTheme, lightTheme } from "./theme";

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

UnistylesRegistry.addThemes({
  dark: darkTheme,
  light: lightTheme,
}).addConfig({
  adaptiveThemes: true,
});
