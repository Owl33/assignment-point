import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function TabLayout() {
  const user = true;
      const insets = useSafeAreaInsets();
    const headerContentHeight = 36; // 원하는 실제 헤더 콘텐츠 높이
  return (
    <Tabs
      screenOptions={{
        animation: "fade",
        headerShadowVisible: false,
headerStyle: { backgroundColor: 'transparent',
              height: insets.top + headerContentHeight,
  elevation: 0, shadowOpacity: 0 },  
        headerTintColor: "#111",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "700",
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: "홈" }}></Tabs.Screen>
      <Tabs.Screen
        name="history"
        options={{ title: "내역 조회" }}></Tabs.Screen>
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
