import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@shopify/restyle';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PrivateTabParamList } from '@/app/navigation/TabNavigator';
import {
  Box,
  Icon,
  PressableBox,
  Text,
  type IconName,
} from '@/shared/components';
import { createVariantBox } from '@/shared/lib/createVariantBox';
import type { Theme } from '@/shared/theme';

const TabBarBox = createVariantBox('tabBarVariants');
const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedLayer = Animated.createAnimatedComponent(TabBarBox);

type TabName = keyof PrivateTabParamList;

const tabs: Record<TabName, { label: string; icon: IconName }> = {
  Agenda: { label: 'AGENDA', icon: 'calendar' },
  ReportCard: { label: 'BOLETIM', icon: 'checkFile' },
};

function isTab(name: string): name is TabName {
  return name in tabs;
}

type TabItemProps = {
  label: string;
  icon: IconName;
  focused: boolean;
  onPress: () => void;
  testID: string;
};

function TabItem({ label, icon, focused, onPress, testID }: TabItemProps) {
  const { motion } = useTheme<Theme>();
  const scale = useSharedValue(1);
  const active = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    active.value = withTiming(focused ? 1 : 0, { duration: motion.short });
  }, [active, focused, motion.short]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const accentStyle = useAnimatedStyle(() => ({ opacity: active.value }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(motion.pulseScale, { duration: motion.short }),
      withTiming(1, { duration: motion.short }),
    );
    onPress();
  };

  return (
    <PressableBox
      testID={testID}
      flex={1}
      onPress={handlePress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
    >
      <TabBarBox variant="item">
        <AnimatedBox testID={`${testID}-icon`} style={pulseStyle}>
          <Icon name={icon} color="textPrimary" size="l" />
          <AnimatedLayer
            testID={`${testID}-icon-accent`}
            variant="layer"
            style={accentStyle}
          >
            <Icon name={icon} color="accent" size="l" />
          </AnimatedLayer>
        </AnimatedBox>
        <TabBarBox variant="label">
          <Text variant="tabLabel">{label}</Text>
          <AnimatedLayer
            testID={`${testID}-label-accent`}
            variant="layer"
            style={accentStyle}
          >
            <Text variant="tabLabel" color="accent">
              {label}
            </Text>
          </AnimatedLayer>
        </TabBarBox>
      </TabBarBox>
    </PressableBox>
  );
}

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { spacing } = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const bottomInset = {
    paddingBottom: Math.max(insets.bottom, spacing.tabBottom),
  };

  return (
    <TabBarBox testID="tab-bar" variant="bar" style={bottomInset}>
      {state.routes.map((route, index) => {
        if (!isTab(route.name)) {
          return null;
        }
        const focused = state.index === index;
        const { label, icon } = tabs[route.name];

        const handlePress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabItem
            key={route.key}
            testID={`tab-${route.name}`}
            label={label}
            icon={icon}
            focused={focused}
            onPress={handlePress}
          />
        );
      })}
    </TabBarBox>
  );
}
