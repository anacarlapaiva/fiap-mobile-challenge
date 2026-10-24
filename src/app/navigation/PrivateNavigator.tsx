import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoggedScreen } from '@/features/auth';
import { theme } from '@/shared/theme';

export type PrivateStackParamList = {
  Logged: undefined;
};

const Stack = createNativeStackNavigator<PrivateStackParamList>();

export function PrivateNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Logged" component={LoggedScreen} />
    </Stack.Navigator>
  );
}
