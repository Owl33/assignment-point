import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { UIIcon } from "@/components/ui/icon";

interface Props {
  icon?: typeof UIIcon;
  title: string;
  desc?: string;
  onPress?: () => void;
}

export function ListItem({ icon, title, desc, onPress }: Props) {
  const scale = useSharedValue(1);
  const overlayOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.985, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
    overlayOpacity.value = withTiming(0.12, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
    overlayOpacity.value = withTiming(0, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}>
      <Animated.View
        className="flex-row items-center gap-6 px-4 py-4 rounded-xl bg-transparent"
        style={[animatedStyle, { overflow: "hidden" }]}>
        {icon && (
          <Icon
            as={icon}
            className="w-10 h-10"
          />
        )}
        <Box className="flex-1">
          <Text size="lg">{title}</Text>
          {desc && <Text desc>{desc}</Text>}
        </Box>

        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "#000",
            },
            overlayStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
