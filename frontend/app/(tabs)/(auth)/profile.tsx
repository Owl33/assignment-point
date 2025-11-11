import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuthStore } from "@/store/auth";
import { ActivityIndicator } from "react-native";

export default function ProfileScreen() {
  const status = useAuthGuard();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (status === "idle" || status === "authenticating") {
    return (
      <Box className="flex-1 items-center justify-center gap-3">
        <ActivityIndicator size="large" />
        <Text>세션 확인 중</Text>
      </Box>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box className="p-4 flex-1">
      <Card className="gap-4">
        <Box>
          <Text>이름</Text>
          <Text>{user?.name}</Text>
        </Box>
        <Box>
          <Text>이메일</Text>
          <Text>{user?.email}</Text>
        </Box>
        <Button onPress={handleLogout}>
          <Text className="text-white">로그아웃</Text>
        </Button>
      </Card>
    </Box>
  );
}
