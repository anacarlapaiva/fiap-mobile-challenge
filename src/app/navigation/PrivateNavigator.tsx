import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  TabNavigator,
  type PrivateTabParamList,
} from '@/app/navigation/TabNavigator';
import { Header } from '@/features/auth';
import { Box } from '@/shared/components';
import { theme } from '@/shared/theme';

export type PrivateStackParamList = {
  Main: NavigatorScreenParams<PrivateTabParamList>;
};

const Stack = createNativeStackNavigator<PrivateStackParamList>();

function MainScreen() {
  return (
    <Box flex={1} backgroundColor="background">
      <Header />
      <TabNavigator />
    </Box>
  );
}

export function PrivateNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
  );
}
