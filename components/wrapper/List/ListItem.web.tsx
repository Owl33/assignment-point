import { Pressable } from "@/components/ui/pressable";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { UIIcon } from "@/components/ui/icon";

interface Props {
  icon?: typeof UIIcon;
  title: string;
  desc?: string;
}

export function ListItem({ icon, title, desc }: Props) {
  return (
    <Pressable>
      {({ pressed }) => (
        <Box
          className={`
            flex-row items-center gap-6 px-4 py-4 rounded-xl
            ${pressed ? "bg-background-100 scale-[0.985]" : "bg-transparent scale-100"}
            transition-all duration-150 ease-out
          `}
          style={{ overflow: "hidden" }}>
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
