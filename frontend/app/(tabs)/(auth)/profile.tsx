import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAuthStore } from '@/store/auth';
import { ActivityIndicator } from 'react-native';

export default function ProfileScreen() {
  const status = useAuthGuard();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (status === 'idle' || status === 'authenticating') {
    return (
      <Box className="flex-1 items-center justify-center gap-3">
        <ActivityIndicator size="large" />
        <Text>세션을 확인하는 중입니다...</Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box className="flex-1 items-center justify-center gap-3">
        <Text>로그인 정보를 찾을 수 없습니다.</Text>
      </Box>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box className="flex-1 gap-4 p-6">
      <Box >
        <Text >이름</Text>
        <Text >{user.name}</Text>
      </Box>
      <Box >
        <Text >이메일</Text>
        <Text >{user.email}</Text>
      </Box>
      <Button className="mt-6" onPress={handleLogout}>
        <Text className="text-white">로그아웃</Text>
      </Button>
    </Box>
  );
}
