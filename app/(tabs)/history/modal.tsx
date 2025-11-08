import { Box } from "@/components/ui/box";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";

export default function ModalScreen() {
  return (
    <Box style={styles.container}>
      <Text>Modal</Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
