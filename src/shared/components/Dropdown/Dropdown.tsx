import { useTheme } from '@shopify/restyle';
import { type ComponentRef, useEffect, useRef, useState } from 'react';
import {
  Modal,
  ScrollView,
  useWindowDimensions,
  type View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Box } from '@/shared/components/Box';
import { createVariantBox } from '@/shared/lib/createVariantBox';
import { Icon } from '@/shared/components/Icon';
import { PressableBox } from '@/shared/components/PressableBox';
import { PressableOpacity } from '@/shared/components/PressableOpacity';
import { Text } from '@/shared/components/Text';
import type { Theme } from '@/shared/theme';

const DropdownBox = createVariantBox('dropdownVariants');
const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedDropdownBox = Animated.createAnimatedComponent(DropdownBox);

export type DropdownOption<T> = {
  label: string;
  value: T;
};

type DropdownProps<T> = {
  value: T;
  options: readonly DropdownOption<T>[];
  onSelect: (option: DropdownOption<T>) => void;
  textInset?: 's' | 'm';
  testID?: string;
};

type Anchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function Dropdown<T>({
  value,
  options,
  onSelect,
  textInset = 'm',
  testID,
}: DropdownProps<T>) {
  const theme = useTheme<Theme>();
  const { motion } = theme;
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const fieldRef = useRef<ComponentRef<typeof View>>(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const progress = useSharedValue(0);

  const selected = options.find(option => option.value === value);

  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
    if (open) {
      progress.value = withTiming(1, { duration: motion.medium });
      return;
    }
    progress.value = withTiming(0, { duration: motion.medium }, finished => {
      if (finished) {
        scheduleOnRN(hideIfClosed);
      }
    });
  }, [motion.medium, open, progress]);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const listStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [-theme.spacing.xs, 0]),
      },
    ],
  }));

  const openList = () => {
    if (options.length === 0) {
      return;
    }
    setAnchor(null);
    setVisible(true);
    setOpen(true);
    fieldRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
    });
  };

  function hideIfClosed() {
    if (!openRef.current) {
      setVisible(false);
    }
  }

  const close = () => setOpen(false);

  const select = (option: DropdownOption<T>) => {
    onSelect(option);
    setOpen(false);
  };

  const listPadding = theme.spacing.m * 2;
  const listMinHeight = theme.sizes.optionRowHeight + listPadding;
  const listMaxHeight = anchor
    ? Math.max(
        listMinHeight,
        windowHeight -
          anchor.y -
          anchor.height -
          theme.spacing.xs -
          insets.bottom -
          theme.spacing.l,
      )
    : undefined;
  const listPosition = anchor
    ? {
        top: anchor.y + anchor.height + theme.spacing.xs,
        left: anchor.x,
        width: anchor.width,
        maxHeight: listMaxHeight,
      }
    : undefined;

  return (
    <Box ref={fieldRef} collapsable={false}>
      <PressableOpacity
        testID={testID}
        onPress={openList}
        accessibilityRole="button"
        accessibilityLabel={selected?.label}
        accessibilityState={{ expanded: open }}
      >
        <DropdownBox variant="field" paddingLeft={textInset}>
          <Text variant="body">{selected?.label ?? ''}</Text>
          <AnimatedBox style={arrowStyle}>
            <Icon name="arrow" color="accent" size="m" />
          </AnimatedBox>
        </DropdownBox>
      </PressableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={close}
        statusBarTranslucent
      >
        <PressableBox
          testID="dropdown-backdrop"
          flex={1}
          onPress={close}
          accessible={false}
          importantForAccessibility="no"
        />
        <DropdownBox
          variant="overlay"
          opacity={anchor ? 1 : 0}
          pointerEvents="box-none"
        >
          <AnimatedDropdownBox
            variant="list"
            testID="dropdown-list"
            onAccessibilityEscape={close}
            style={[listPosition, listStyle]}
          >
            <ScrollView
              nestedScrollEnabled
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {options.map((option, index) => (
                <PressableOpacity
                  key={String(option.value)}
                  testID={`dropdown-option-${index}`}
                  onPress={() => select(option)}
                  height={theme.sizes.optionRowHeight}
                  justifyContent="center"
                  paddingHorizontal={textInset}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                >
                  <Text variant="body">{option.label}</Text>
                </PressableOpacity>
              ))}
            </ScrollView>
          </AnimatedDropdownBox>
        </DropdownBox>
      </Modal>
    </Box>
  );
}
