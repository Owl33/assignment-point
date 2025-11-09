import { ReactNode } from "react";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

type StackSpace = "sm" | "md" | "lg" | "xs" | "xl" | "2xl" | "3xl" | "4xl";

interface Props {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  append?: ReactNode | string;
  titlePlacement?: "in" | "out";
  space?: StackSpace;
  className?: string;
  cardClassName?: string;
  contentClassName?: string;
}

export function List({
  children,
  title,
  subtitle,
  append,
  titlePlacement = "out",
  space = "md",
  className,
  cardClassName,
}: Props) {
  const appendNode =
    typeof append === "string" ? (
      <Text bold >
        {append}
      </Text>
    ) : (
      append
    );

  const hasHeader = Boolean(title || subtitle || append);

  const Header = () => (
    <Box className="flex-row justify-between items-start gap-3">
      <Box className="flex-1">
        {title && (
          <Text bold className="text-typography-900">
            {title}
          </Text>
        )}
        {subtitle && (
          <Text desc className="text-typography-500 mt-1">
            {subtitle}
          </Text>
        )}
      </Box>
      {appendNode}
    </Box>
  );

  return (
    <VStack space={space} className={className}>
      {hasHeader && titlePlacement === "out" && <Header />}
      <Card
  size="sm"

        className={`${cardClassName}`}
      >
          {hasHeader && titlePlacement === "in" && (
              <Header />
          )}
          {children}
      </Card>
    </VStack>
  );
}
