import { SessionCountdown } from "@/components/SessionCountdown";
import { useAuthStore } from "@/store/auth";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, StickyNote, User, LogIn } from "lucide-react-native";
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const headerContentHeight = 44;

  useEffect(() => {
    if (status === "idle") {
      restoreSession();
    }
  }, [restoreSession, status]);

  return (
    <Tabs
      screenOptions={{
        animation: "fade",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "transparent",
          height: insets.top + headerContentHeight,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#111",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "700",
        },
        headerRight: () => <SessionCountdown />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: "내역 조회", tabBarIcon: ({ color }) => <StickyNote color={color} /> }}
      />

      <Tabs.Protected guard={user ? true : false}>
        <Tabs.Screen
          name="(auth)/profile"
          options={{ title: "프로필", tabBarIcon: ({ color }) => <User color={color} /> }}
        />
      </Tabs.Protected>
      <Tabs.Protected guard={!user ? true : false}>
        <Tabs.Screen
          name="(auth)/sign-in"
          options={{ title: "로그인", tabBarIcon: ({ color }) => <LogIn color={color} /> }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
