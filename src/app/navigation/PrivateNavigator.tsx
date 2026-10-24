import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Header, LoggedScreen } from '@/features/auth';
import { Box } from '@/shared/components';
import { theme } from '@/shared/theme';

export type PrivateStackParamList = {
  Logged: undefined;
};

const Stack = createNativeStackNavigator<PrivateStackParamList>();

export function PrivateNavigator() {
  return (
    <Box flex={1} backgroundColor="background">
      <Header />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="Logged" component={LoggedScreen} />
      </Stack.Navigator>
    </Box>
  );
}
