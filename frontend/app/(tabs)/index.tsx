import * as Haptics from "expo-haptics";
import { Coffee, HardDrive, ShoppingBag, Spade, SparklesIcon, Train } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { List } from "@/components/wrapper/List/List";
import { ListItem } from "@/components/wrapper/List/ListItem";
import { PointSummaryCard } from "@/components/wrapper/PointSummaryCard";

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
] ;
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
] ;



export default function HomeScreen() {
  const [total, setTotal] = useState(128300);

  const handleAddPoint = () => {
    Haptics.selectionAsync();
    setTotal((prev) => prev + 100);
  };

  return (
    <Box className="p-4">
    <ScrollView     showsVerticalScrollIndicator={false}>
      <VStack space="xl">
        <PointSummaryCard
          totalPoint={total}
          footer={
            <Button onPress={handleAddPoint} className="rounded-2xl" size="lg">
              <ButtonText>포인트 적립하기</ButtonText>
            </Button>
          }
        />

        <List title="오늘의 추천 적립"     append={
                  <Text className="text-info-600" bold>
                    최대 +2,304P
                  </Text>
                } space="sm">
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

        <List title="주간 인기 적립" append={`총 ${sample2.length}건`} space="sm">
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
          <Text desc className=" mt-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt at voluptatum quasi aperiam neque fu
          </Text>
        </Box>
      </VStack>
    </ScrollView>
    </Box>

  );
}
