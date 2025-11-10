import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, TextInput } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [email, setEmail] = useState('demo@asd.com');
  const [password, setPassword] = useState('1234');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && user) {
      router.navigate('/(tabs)/(auth)/profile');
    }
  }, [router, status, user]);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('로그인', '이메일과 비밀번호를 모두 입력하세요.');
      return;
    }
    try {
      setPending(true);
      await login({ email, password });
      router.navigate('/(tabs)/(auth)/profile');
    } catch (error) {
      Alert.alert('로그인 실패');
    } finally {
      setPending(false);
    }
  };

  return (
    <Box className="flex-1 gap-6 p-6">
      <Heading className="">로그인</Heading>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="이메일"
        className="rounded-2xl border border-gray-200 p-4"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="비밀번호"
        className="rounded-2xl border border-gray-200 p-4"
      />
      <Button
        className="mt-2"
        onPress={handleSubmit}
        isDisabled={pending || status === 'authenticating'}
      >
        <Text className="text-white">로그인</Text>
      </Button>
    </Box>
  );
}
