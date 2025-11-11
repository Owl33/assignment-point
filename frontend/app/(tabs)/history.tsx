import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useQuery } from "@tanstack/react-query";

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
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { api } from "@/lib/http";

const date = [
  { label: "최근 1개월", value: "1" },
  { label: "최근 3개월", value: "3" },
  { label: "최근 6개월", value: "6" },
] as const;

interface PointHistoryEntry = {
  userId: number;
  type: "earn" | "spend";
  amount: number;
  description: string;
  createdAt: string;
};

interface HistorySection = {
  key: string;
  title: string;
  total: number;
  items: Array<{
    id: string;
    title: string;
    desc: string;
    point: number;
  }>;
};

export default function HistoryScreen() {
  const sheet = useBottomSheet();
  const [selectedMonth, setselectedMonth] = useState<typeof date[number]["value"]>("3");
  const status = useAuthGuard();

  const {
    data: balanceData,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => (await api.get<{ balance: number }>("/api/balance")).data,
    enabled: status === "authenticated",
  });

  const {
    data: historyData,
    isPending: historyPending,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["history"],
    queryFn: async () => (await api.get<{ history: PointHistoryEntry[] }>("/api/history")).data,
    enabled: status === "authenticated",
  });

  useFocusEffect(
    useCallback(() => {
      if (status !== "authenticated") {
        return;
      }
      refetchHistory();
      refetchBalance();
    }, [refetchBalance, refetchHistory, status]),
  );

  const groupedHistory = useMemo<HistorySection[]>(
    () => groupHistory(historyData?.history ?? []),
    [historyData],
  );
  const totalCount = historyData?.history?.length ?? 0;

  if (status !== "authenticated") {
    return null;
  }

  return (
    <Box className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space="xl">
          <PointSummaryCard totalPoint={balanceData?.balance ?? 0} />

          <Card className="rounded-2xl flex-row items-center justify-between">
            <Box>
              <Text desc>최근 적립 내역</Text>
              <Text bold className="mt-1">총 {totalCount}건</Text>
            </Box>
            <Pressable onPress={() => sheet.present()} className="flex flex-row items-center">
              <Text>최근 3개월</Text>
              <Icon as={ChevronRightIcon} size="sm" />
            </Pressable>
          </Card>

          {historyPending && groupedHistory.length === 0 ? (
            <Text desc>내역을 불러오는 중입니다...</Text>
          ) : groupedHistory.length === 0 ? (
            <Text desc>적립 내역이 없습니다.</Text>
          ) : (
            <VStack space="lg">
              {groupedHistory.map((section) => (
                <List
                  key={section.key}
                  title={section.title}
                  space="sm"
                  append={
                    <Text className="text-success-600" bold>
                      {section.total > 0 ? `+${section.total}` : section.total}P
                    </Text>
                  }
                >
                  {section.items.map((item) => (
                    <ListItem
                      showChevron={true}
                      key={item.id}
                      title={item.title}
                      desc={item.desc}
                      append={`${item.point > 0 ? "+" : ""}${item.point}P`}
                    />
                  ))}
                </List>
              ))}
            </VStack>
          )}
        </VStack>
      </ScrollView>

      <BottomSheet snapPoints={["35%"]}>
        <Box className="px-5 gap-4">
          <Text bold>조회 기간 설정</Text>
          <Text desc>기간 선택</Text>

          <Box className="flex-row flex-wrap gap-2">
            {date.map((option) => {
              const isActive = option.value === selectedMonth;
              return (
                <Pressable key={option.value} onPress={() => setselectedMonth(option.value)} className="px-4">
                  <Text className={isActive ? "text-blue-500 font-bold" : ""}>{option.label}</Text>
                </Pressable>
              );
            })}
          </Box>

          <VStack space="sm">
            <Text desc>직접 입력</Text>
            <Box className="flex-row gap-3">
              <Box className="flex-1 px-4 py-3">
                <Text desc>시작일</Text>
                <Text bold className="mt-1">2024-01-23</Text>
              </Box>
              <Box className="flex-1 px-4 py-3">
                <Text desc>종료일</Text>
                <Text bold className="mt-1">2024-11-24</Text>
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

function groupHistory(entries: PointHistoryEntry[]): HistorySection[] {
  const sections: HistorySection[] = [];
  const sectionMap = new Map<string, HistorySection>();

  entries.forEach((entry, index) => {
    const created = new Date(entry.createdAt);
    const key = created.toISOString().slice(0, 10);
    let section = sectionMap.get(key);
    if (!section) {
      section = {
        key,
        title: formatFullDate(created),
        total: 0,
        items: [],
      };
      sectionMap.set(key, section);
      sections.push(section);
    }
    const signedAmount = entry.type === "earn" ? entry.amount : -entry.amount;
    section.total += signedAmount;
    section.items.push({
      id: `${key}-${index}`,
      title: entry.description || (entry.type === "earn" ? "포인트 적립" : "포인트 사용"),
      desc: formatDateTime(created),
      point: signedAmount,
    });
  });

  return sections;
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function formatDateTime(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${d} ${hh}:${mm}`;
}
