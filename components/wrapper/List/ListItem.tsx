import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";

import { UIIcon } from "@/components/ui/icon";

interface props {
  icon?: typeof UIIcon;
  className?: string;
  title: string;
  desc?: string;
}

export function ListItem({ icon, title, desc }: props) {
  return (
    <Pressable>
      {({ pressed }) => (
        <Box
          className={`
            flex-row items-center gap-6 p-4 rounded-xl
            transition-all duration-150 ease-out
            ${pressed ? "bg-background-200  scale-[0.98] px-4" : "bg-transparent scale-100"}
          `}>
          {icon && (
            <Icon
              as={icon}
              className="w-10 h-10"
            />
          )}
          <Box className="flex-1">
            <Text size="lg">{title}</Text>
            {desc && <Text desc>{desc}</Text>}
          </Box>
        </Box>
      )}
    </Pressable>
  );
}
