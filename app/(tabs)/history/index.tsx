import { StyleSheet } from "react-native";

import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon, ArrowRightIcon, ChevronRightIcon } from "@/components/ui/icon";
import { useCallback, useMemo, useRef, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import {
  Sparkle,
  Sparkles,
  IceCream,
  Bus,
  IndianRupeeIcon,
  CloudDownload,
  ClosedCaption,
} from "lucide-react-native";
import { List } from "@/components/wrapper/List/List";
import { ListItem } from "@/components/wrapper/List/ListItem";
import { ScrollView } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Link } from "expo-router";

export default function TabTwoScreen() {
  const [point, setPoint] = useState(1);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const snapPoints = useMemo(() => ["50%"], []);

  return (
    <Box className="h-full">
      <ScrollView>
        <Box className="p-4">
          <VStack space="xl">
            <Box className="">
              <Card size="lg">
                <Box className="mt-2 flex-row gap-2 items-center">
                  <Heading>내 포인트</Heading>
                  <Box className="bg-primary-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <Text
                      bold
                      className="text-white">
                      P
                    </Text>
                  </Box>
                </Box>
                <Box className="mt-2 flex-row items-center ">
                  <Heading size="xl">{point}원 </Heading>
                </Box>
              </Card>
            </Box>

            <VStack space="md">
              <Box className="flex-row justify-between">
                <Text>총 23건</Text>
                <Button onPress={handlePresentModalPress}>modal</Button>
              </Box>
              <List>
                <ListItem
                  icon={Sparkle}
                  title="Dummy 12"
                  desc="Dummy...Dummy,,,Dummy...."
                />
                <ListItem
                  icon={Sparkles}
                  title="Dummy 1"
                  desc="Dummy...Dummy,,,Dummy...."
                />
                <ListItem
                  icon={IndianRupeeIcon}
                  title="더미 2"
                  desc="Dummy...Dummy,,,Dummy...."
                />
                <ListItem
                  icon={Bus}
                  title="더미 2"
                  desc="Dummy...Dummy,,,Dummy...."
                />
              </List>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          onChange={handleSheetChanges}>
          <BottomSheetView style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </Box>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
