import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { useTheme } from '@shopify/restyle';
import { useReducedMotion } from 'react-native-reanimated';

import { TabBar } from '@/app/navigation/TabBar';
import { useCurrentUser } from '@/features/auth';
import { ReportCardScreen } from '@/features/report-card';
import { ScheduleScreen } from '@/features/schedule';
import type { Theme } from '@/shared/theme';

export type PrivateTabParamList = {
  Agenda: undefined;
  ReportCard: undefined;
};

const Tab = createBottomTabNavigator<PrivateTabParamList>();

function renderTabBar(props: BottomTabBarProps) {
  return <TabBar {...props} />;
}

function useStudentKey() {
  const currentUser = useCurrentUser();
  return currentUser.status === 'ready'
    ? String(currentUser.user.student.rm)
    : currentUser.status;
}

function AgendaTab() {
  const studentKey = useStudentKey();
  return <ScheduleScreen key={studentKey} />;
}

function ReportCardTab() {
  const studentKey = useStudentKey();
  return <ReportCardScreen key={studentKey} />;
}

export function tabSceneAnimation(reduceMotion: boolean) {
  return reduceMotion ? 'none' : 'fade';
}

export function TabNavigator() {
  const theme = useTheme<Theme>();
  const reduceMotion = useReducedMotion();

  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        animation: tabSceneAnimation(reduceMotion),
        transitionSpec: {
          animation: 'timing',
          config: { duration: theme.motion.short },
        },
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tab.Screen name="Agenda" component={AgendaTab} />
      <Tab.Screen name="ReportCard" component={ReportCardTab} />
    </Tab.Navigator>
  );
}
