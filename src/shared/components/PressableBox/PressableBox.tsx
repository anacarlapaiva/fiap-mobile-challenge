import { createBox } from '@shopify/restyle';
import { Pressable, type PressableProps } from 'react-native';

import type { Theme } from '@/shared/theme';

export const PressableBox = createBox<Theme, PressableProps>(Pressable);
