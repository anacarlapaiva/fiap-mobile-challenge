import type { NavigatorScreenParams } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import {
  TabNavigator,
  type PrivateTabParamList,
} from '@/app/navigation/TabNavigator';
import { Header, StudentSelectionScreen } from '@/features/auth';
import { Box } from '@/shared/components';
import { theme } from '@/shared/theme';

export type PrivateStackParamList = {
  Main: NavigatorScreenParams<PrivateTabParamList>;
  StudentSelection: undefined;
};

const Stack = createNativeStackNavigator<PrivateStackParamList>();

function MainScreen({
  navigation,
}: NativeStackScreenProps<PrivateStackParamList, 'Main'>) {
  const openStudentSelection = useCallback(() => {
    navigation.navigate('StudentSelection');
  }, [navigation]);

  return (
    <Box flex={1} backgroundColor="background">
      <Header onSwitchProfile={openStudentSelection} />
      <TabNavigator />
    </Box>
  );
}

function StudentSelectionRoute({
  navigation,
}: NativeStackScreenProps<PrivateStackParamList, 'StudentSelection'>) {
  const close = useCallback(() => {
    if (navigation.isFocused() && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return <StudentSelectionScreen onClose={close} />;
}

export function PrivateNavigator() {
  const reduceMotion = useReducedMotion();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen
        name="StudentSelection"
        component={StudentSelectionRoute}
        options={{
          animation: reduceMotion ? 'none' : 'slide_from_bottom',
          gestureDirection: 'vertical',
        }}
      />
    </Stack.Navigator>
  );
}
