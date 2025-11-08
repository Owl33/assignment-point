import { Card } from "@/components/ui/card";

import { VStack } from "@/components/ui/vstack";
import { ReactNode } from "react";

interface props {
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
  space?: "sm" | "md" | "lg" | "xs" | "xl" | "2xl" | "3xl" | "4xl";
}
export function List({ size = "lg", children, className, space = "md" }: props) {
  return (
    <Card
      size={size}
      className={className}>
      <VStack space={space}>{children}</VStack>
    </Card>
  );
}
