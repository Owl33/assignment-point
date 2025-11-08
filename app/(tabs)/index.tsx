import { StyleSheet } from "react-native";

import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon, ArrowRightIcon, ChevronRightIcon } from "@/components/ui/icon";
import { useState } from "react";
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

export default function TabOneScreen() {
  const [point, setPoint] = useState(1);
  return (
    <ScrollView>
      <Box className="p-4">
        <VStack space="xl">
          <Box className="">
            <Card
              size="lg"
              className="">
              <Text desc>
                오늘 총
                <Text
                  bold
                  className="text-xs text-blue-500">
                  {point}
                </Text>
                원을 적립했어요!
              </Text>

              <Box className="mt-2 flex-row gap-2 items-center">
                <Box className="bg-blue-300 w-6 h-6 rounded-full flex items-center justify-center">
                  <Text bold>P</Text>
                </Box>
                <Heading>내 포인트</Heading>
              </Box>

              <Box className="mt-2 flex-row items-center cursor-pointer">
                <Heading size="xl">{point}원 </Heading>
                <Icon
                  size="xl"
                  as={ChevronRightIcon}></Icon>
              </Box>
            </Card>
            <Button
              variant="solid"
              className="mt-4 rounded-xl data-[active=true]:scale-y-[1.05]"
              size="xl"
              onPress={() => {
                setPoint(point + 1);
              }}>
              <ButtonText>포인트 적립</ButtonText>
            </Button>
          </Box>

          <VStack space="md">
            <Box className="flex-row justify-between items-center">
              <Heading size="sm">더 많은 포인트를 적립할 수 있어요</Heading>
              <Button
                size="xs"
                variant="link">
                <ButtonText>더보기</ButtonText>
                <ButtonIcon as={ChevronRightIcon}></ButtonIcon>
              </Button>
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

          <VStack space="md">
            <Box className="flex-row justify-between">
              <Text bold>더 많은 포인트를 적립할 수 있어요</Text>
              <Button
                size="xs"
                variant="link">
                <ButtonText>더보기</ButtonText>
                <ButtonIcon as={ChevronRightIcon}></ButtonIcon>
              </Button>
            </Box>
            <List>
              <ListItem
                icon={ClosedCaption}
                title="Dummy 12"
                desc="Dummy...Dummy,,,Dummy...."
              />
              <ListItem
                icon={CloudDownload}
                title="Dummy 1"
                desc="Dummy...Dummy,,,Dummy...."
              />
              <ListItem
                icon={IceCream}
                title="더미 2"
                desc="Dummy...Dummy,,,Dummy...."
              />
            </List>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
