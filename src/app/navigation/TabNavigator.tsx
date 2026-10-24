import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import { TabBar } from '@/app/navigation/TabBar';
import { LoggedScreen } from '@/features/auth';
import { ReportCardScreen } from '@/features/report-card';
import { theme } from '@/shared/theme';

export type PrivateTabParamList = {
  Agenda: undefined;
  ReportCard: undefined;
};

const Tab = createBottomTabNavigator<PrivateTabParamList>();

function renderTabBar(props: BottomTabBarProps) {
  return <TabBar {...props} />;
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tab.Screen name="Agenda" component={LoggedScreen} />
      <Tab.Screen name="ReportCard" component={ReportCardScreen} />
    </Tab.Navigator>
  );
}
