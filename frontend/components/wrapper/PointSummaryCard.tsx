import { ReactNode } from "react";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/store/auth";

interface StatBoxProps {
  label: string;
  value: string;
  accentClass?: string;
}

interface PointSummaryCardProps {
  title?: string;
  totalPoint: number;
  footer?: ReactNode;
}

export function PointSummaryCard({
  title = "내 포인트",
  totalPoint,

  footer,
}: PointSummaryCardProps) {
  const user = useAuthStore((state) => state.user);
  const displayValue = user ? `${totalPoint.toLocaleString("ko-KR")}P` : "???";

  return (
    <Card size="lg">
      <Text desc className="text-typography-500">
        {title}
      </Text>
      <Heading size="xl" className="mt-1">
        {displayValue}
      </Heading>
  
      {footer && <Box className="mt-4">{footer}</Box>}
    </Card>
  );
}
