import React from "react";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { useColorScheme } from "@/components/useColorScheme";
import { Camera } from "lucide-react-native";
import { HapticTab } from "@/components/HapticTab";
// import { SpecialTabButton } from "@/components/SpecialTabButton";
import { Platform } from "react-native";
import { Route } from "expo-router/build/Route";
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const user = true;
  return (
    <Tabs
      screenOptions={{
        tabBarButton: HapticTab,
        animation: "fade",
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: "홈" }}></Tabs.Screen>
      <Tabs.Screen
        name="dummy1"
        options={{ title: "더미1" }}></Tabs.Screen>
      <Tabs.Protected guard={user}>
        <Tabs.Screen
          name="(auth)/profile"
          options={{ title: "유저있음" }}></Tabs.Screen>
      </Tabs.Protected>
      <Tabs.Protected guard={!user}>
        <Tabs.Screen
          name="(auth)/sign-in"
          options={{ title: "유저없음" }}></Tabs.Screen>
      </Tabs.Protected>
    </Tabs>
  );
}
