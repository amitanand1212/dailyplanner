/// <reference types="nativewind/types" />

// NativeWind ships its className typings via `react-native-css-interop`, but in this
// Expo SDK 54 / RN 0.81 setup that package is nested and its augmentation doesn't get
// applied through the reference chain. We declare the same augmentation here so that
// `className` is typed on React Native components. (Runtime className handling is done
// by the nativewind babel preset + metro, independent of these types.)
import "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImagePropsBase {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
    indicatorClassName?: string;
  }
  interface TextInputProps {
    className?: string;
    placeholderClassName?: string;
  }
  interface SwitchProps {
    className?: string;
  }
  interface TouchableWithoutFeedbackProps {
    className?: string;
  }
  interface StatusBarProps {
    className?: string;
  }
}
