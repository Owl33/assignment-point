import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Box>
        <Text>This screen doesn't exist.</Text>

        <Link href="/">
          <Text>Go to home screen!</Text>
        </Link>
      </Box>
    </>
  );
}
