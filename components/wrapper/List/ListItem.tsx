import { MotiView } from "moti";
import { ReactNode } from "react";

import { Box } from "@/components/ui/box";
import type { UIIcon } from "@/components/ui/icon";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

interface Props {
  title: string;
  desc?: string;
  icon?: typeof UIIcon;
  append?: ReactNode | string;
  showChevron?: boolean;
  onPress?: () => void;
}

export function ListItem({ title, desc, icon, append, showChevron, onPress }: Props) {
  const appendNode =
    typeof append === "string" ? (
      <Text bold className="text-typography-900">
        {append}
      </Text>
    ) : (
      append
    );

  const shouldShowChevron = showChevron === undefined ? !append : showChevron;

  return (
    <Pressable onPress={onPress} >
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed ? 0.985 : 1, opacity: pressed ? 0.97 : 1 }}
          transition={{ type: "timing", duration: 120 }}
          style={{ borderRadius: 18, overflow: "hidden" }}
        >
          <Box
            className={`flex-row items-center gap-4 py-3 px-4 ${
              pressed ? "bg-background-100" : "bg-transparent"
            }`}
          >
            {icon && <Icon as={icon} className="" />}
            <Box className="flex-1">
              <Text size="lg" className="font-semibold">
                {title}
              </Text>
              {desc && (
                <Text desc className=" mt-0.5">
                  {desc}
                </Text>
              )}
            </Box>

            <Box className="flex-row items-center gap-2">
              {appendNode}
              {shouldShowChevron && (
                <Icon as={ChevronRightIcon} size="sm" className="text-typography-400" />
              )}
            </Box>
          </Box>
        </MotiView>
      )}
    </Pressable>
  );
}
