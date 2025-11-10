import { useState } from "react";
import { Pressable, ScrollView } from "react-native";

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { BottomSheet, useBottomSheet } from "@/components/wrapper/BottomSheet";
import { List } from "@/components/wrapper/List/List";
import { ListItem } from "@/components/wrapper/List/ListItem";
import { PointSummaryCard } from "@/components/wrapper/PointSummaryCard";

const date = [
  { label: "최근 1개월", value: "1" },
  { label: "최근 3개월", value: "3" },
  { label: "최근 6개월", value: "6" },
] as const;

const sample = [
  {
    title: "2025년 11월 9일",
    total: 2400,
    items: [
      {
        id: 45231,
        title: "포인트 적립",
        desc: "2025.11.09 10:20",
        point: 1200,
      },
      {
        id: 4532432,
        title: "포인트 적립",
        desc: "2025.11.09 08:04",
        point: 1200,
      },
    ],
  },
  {
    title: "2025-11-12",
    total: 3600,
    items: [
      {
        id: 2323,
        title: "포인트 적립",
        desc: "2025.11.08 18:42",
        point: 1800,
      },
      {
        id: 444,
        title: "포인트 적립",
        desc: "2025.11.08 09:10",
        point: 900,
      },
      {
        id: 125,
        title: "포인트 적립",
        desc: "2025.11.08 08:37",
        point: 900,
      },
    ],
  },
  {
    title: "2025-11-07",
    total: 1950,
    items: [
      {
        id: 116,
        title: "포인트 적립",
        desc: "2025.11.07 21:05",
        point: 1500,
      },
      {
        id: 302,
        title: "포인트 적립",
        desc: "2025.11.07 12:19",
        point:450,
      },
    ],
  },
] as const;


export default function HistoryScreen() {
  const sheet = useBottomSheet();
  const [selectedMonth, setselectedMonth] = useState<typeof date[number]["value"]>("3");

  const totalCount = sample.reduce((sum, section) => sum + section.items.length, 0);

  return (
    <Box className="p-4">
      <ScrollView     showsVerticalScrollIndicator={false}>
        <VStack space="xl">
          <PointSummaryCard
            totalPoint={128300}
          />

        <Card className="rounded-2xl flex-row items-center justify-between">
              <Box>
                <Text desc>최근 적립 내역</Text>
                <Text bold className="mt-1">총 {totalCount}건</Text>
              </Box>
              <Pressable
                onPress={() => sheet.present()}
                className="flex flex-row items-center"
              >
                <Text >최근 3개월</Text>
                <Icon as={ChevronRightIcon} size="sm"  />
              </Pressable>
            </Card>

          <VStack space="lg">
            {sample.map((section) => (
              <List
                key={section.title}
                title={section.title}
                space="sm"
                append={
                  <Text className="text-success-600" bold>
                    {section.total}
                  </Text>
                }
              >
                {section.items.map((item) => (
                  <ListItem
                  showChevron={true}
                    key={item.id}
                    title={item.title}
                    desc={item.desc}
                    append={`+${item.point}P`}
                  />
                ))}
              </List>
            ))}
          </VStack>
        </VStack>
      </ScrollView>

      <BottomSheet snapPoints={["35%"]}>
        <Box className="px-5 gap-4">
          <Text bold>조회 기간 설정</Text>
          <Text desc >
            기간 선택
          </Text>

          <Box className="flex-row flex-wrap gap-2">
            {date.map((option) => {
              const isActive = option.value === selectedMonth;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setselectedMonth(option.value)}
                 className="px-4 "
                >
                  <Text className={isActive ? "text-blue-500 font-bold" : ""}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </Box>

          <VStack space="sm">
            <Text desc>직접 입력</Text>
            <Box className="flex-row gap-3">
              <Box className="flex-1  px-4 py-3">
                <Text desc >시작일</Text>
                <Text bold className=" mt-1">2024-01-23</Text>
              </Box>
              <Box className="flex-1  px-4 py-3">
                <Text desc >종료일</Text>
                <Text bold className=" mt-1">2024-11-24</Text>
              </Box>
            </Box>
          </VStack>

          <Button variant="solid" onPress={() => sheet.dismiss()}>
            <ButtonText> 적용</ButtonText>
          </Button>
        </Box>
      </BottomSheet>
    </Box>
  );
}
