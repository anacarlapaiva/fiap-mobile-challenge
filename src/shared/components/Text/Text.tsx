import { createText } from '@shopify/restyle';
import type { ComponentProps } from 'react';

import type { Theme } from '@/shared/theme';

const ThemedText = createText<Theme>();

type TextProps = ComponentProps<typeof ThemedText>;

export function Text(props: TextProps) {
  return <ThemedText {...props} allowFontScaling={false} />;
}
