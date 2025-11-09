//app/(tabs)/history/index.tsx

import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { BottomSheet, useBottomSheet } from "@/components/wrapper/BottomSheet/index";
import { List } from "@/components/wrapper/List/List";
import { ListItem } from "@/components/wrapper/List/ListItem";
import {
  Bus,
  IndianRupeeIcon,
  Sparkle,
  Sparkles
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView } from "react-native";

export default function TabTwoScreen() {
  const [point, setPoint] = useState(1);
  const sheet = useBottomSheet(); // BottomSheet 마운트 후 controller 반환

  return (
    <Box className="flex-1">
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
                <Pressable onPress={() => sheet?.present()}>
                  <Text>최근 3개월</Text>
                </Pressable>
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
        <BottomSheet>
          <Button onPress={() => sheet?.dismiss()}>
            <Text>hI</Text>
          </Button>
        </BottomSheet>
      </ScrollView>
    </Box>
  );
}
