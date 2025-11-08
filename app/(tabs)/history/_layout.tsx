import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "내역 조회" }}></Stack.Screen>
      <Stack.Screen
        name="modal"
        options={{ title: "설정" }}></Stack.Screen>
    </Stack>
  );
}
