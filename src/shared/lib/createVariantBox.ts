import {
  boxRestyleFunctions,
  createRestyleComponent,
  createVariant,
  type BoxProps,
  type VariantProps,
} from '@shopify/restyle';
import type { ViewProps } from 'react-native';

import type { Theme } from '@/shared/theme';

type VariantThemeKey =
  | 'buttonVariants'
  | 'cardVariants'
  | 'dropdownVariants'
  | 'textFieldVariants'
  | 'emptyVariants';

type VariantBoxProps<K extends VariantThemeKey> = VariantProps<Theme, K> &
  BoxProps<Theme> &
  ViewProps;

export function createVariantBox<K extends VariantThemeKey>(themeKey: K) {
  return createRestyleComponent<VariantBoxProps<K>, Theme>([
    createVariant<Theme, K>({ themeKey }),
    ...boxRestyleFunctions,
  ] as Parameters<typeof createRestyleComponent<VariantBoxProps<K>, Theme>>[0]);
}
