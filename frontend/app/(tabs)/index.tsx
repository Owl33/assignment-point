import * as Haptics from "expo-haptics";
import { Coffee, HardDrive, ShoppingBag, Spade, SparklesIcon, Train } from "lucide-react-native";
import { useCallback } from "react";
import { Alert, ScrollView } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { List } from "@/components/wrapper/List/List";
import { ListItem } from "@/components/wrapper/List/ListItem";
import { PointSummaryCard } from "@/components/wrapper/PointSummaryCard";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/http";

const sample1 = [
  {
    id: 1234,
    title: "스타벅스 앱 결제",
    desc: "결제 시 추가 5%",
    point: 800,
    icon: Coffee,
  },
  {
    id: 11111102,
    title: "지하철 QR 승차",
    desc: "출퇴근 더블 적립",
    point: 300,
    icon: Train,
  },
  {
    id: 42303,
    title: "무신사 위켄드",
    desc: "D-2 마감 20만 원 이상",
    point: 2000,
    icon: ShoppingBag,
  },
];
const sample2 = [
  {
    id: 1234,
    title: "네이버 스토어 적립",
    desc: "결제 시 추가 5%",
    point: 800,
    icon: Spade,
  },
  {
    id: 11111102,
    title: "삼성 오딧세이 G9 특별 구매",
    desc: "적립 10%",
    point: 300,
    icon: HardDrive,
  },
  {
    id: 42303,
    title: "타로카드 보기",
    desc: "한번만 보더라도 적립",
    point: 2000,
    icon: SparklesIcon,
  },
];

export default function HomeScreen() {
  const status = useAuthStore((state) => state.status);
  const queryClient = useQueryClient();

  const { data: balanceData, refetch: refetchBalance } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => (await api.get<{ balance: number }>("/api/balance")).data,
    enabled: status === "authenticated",
  });

  const earnMutation = useMutation({
    mutationFn: async (payload: { amount: number; description: string }) =>
      (await api.post<{ balance: number }>("/api/earn", payload)).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["balance"] });
      await queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const handleAddPoint = useCallback(async () => {
    Haptics.selectionAsync();
    try {
      await earnMutation.mutateAsync({ amount: 100, description: "홈 화면 버튼 적립" });
      await refetchBalance();
    } catch (error) {
      console.warn("포인트 적립 실패", error);
    }
  }, [earnMutation, refetchBalance, status]);

  return (
    <Box className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space="xl">
          <PointSummaryCard
            totalPoint={balanceData?.balance ?? 0}
            footer={
              <Button
                onPress={handleAddPoint}
                className="rounded-2xl"
                size="lg"
                isDisabled={earnMutation.isPending || status !== "authenticated"}>
                <ButtonText>
                  {status !== "authenticated"
                    ? "로그인 필요"
                    : earnMutation.isPending
                    ? "적립 중"
                    : "포인트 적립하기"}
                </ButtonText>
              </Button>
            }
          />

          <List
            title="오늘의 추천 적립"
            append={
              <Text
                className="text-info-600"
                bold>
                최대 +2,304P
              </Text>
            }
            space="sm">
            {sample1.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                desc={item.desc}
                showChevron={true}
                append={`+${item.point}P`}
                icon={item.icon}
              />
            ))}
          </List>

          <List
            title="주간 인기 적립"
            append={`총 ${sample2.length}건`}
            space="sm">
            {sample2.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                showChevron={true}
                desc={item.desc}
                append={`+${item.point}P`}
                icon={item.icon}
              />
            ))}
          </List>

          <Box className="rounded-2xl ">
            <Text bold>Tip</Text>
            <Text
              desc
              className=" mt-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt at voluptatum quasi
              aperiam neque fu
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
