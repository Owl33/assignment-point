import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const user = true;
  return (
    <Tabs
      screenOptions={{
        animation: "fade",
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: "홈" }}></Tabs.Screen>
      <Tabs.Screen
        name="history"
        options={{ title: "내역 조회"  }}></Tabs.Screen>
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
