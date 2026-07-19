import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;

export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const FONT_SIZE = {
  xs: moderateScale(9),
  small: moderateScale(11),
  body: moderateScale(13),
  subtitle: moderateScale(15),
  title: moderateScale(20),
  heading: moderateScale(24),
};

export const SPACING = {
  xs: moderateScale(2),
  sm: moderateScale(6),
  md: moderateScale(12),
  lg: moderateScale(18),
  xl: moderateScale(24),
};

export const RADIUS = {
  sm: moderateScale(6),
  md: moderateScale(10),
  lg: moderateScale(14),
  xl: moderateScale(18),
  full: 999,
};

export const ICON_SIZE = {
  sm: moderateScale(14),
  md: moderateScale(18),
  lg: moderateScale(22),
  xl: moderateScale(32),
};

export const BUTTON = {
  height: verticalScale(49),
  borderRadius: moderateScale(12),
};

export const CARD = {
  padding: moderateScale(12),
  borderRadius: moderateScale(14),
};
