import {
  createRestyleComponent,
  createVariant,
  type VariantProps,
} from '@shopify/restyle';
import { Image, type ImageProps } from 'react-native';

import empty from '@/assets/images/empty.png';
import { Text } from '@/shared/components/Text';
import { createVariantBox } from '@/shared/lib/createVariantBox';
import type { Theme } from '@/shared/theme';

type EmptyImageProps = VariantProps<Theme, 'emptyImageVariants'> &
  Omit<ImageProps, 'source'> & { source: ImageProps['source'] };

const EmptyRoot = createVariantBox('emptyVariants');
const EmptyImage = createRestyleComponent<EmptyImageProps, Theme>(
  [createVariant({ themeKey: 'emptyImageVariants' })],
  Image,
);

type EmptyProps = {
  message: string;
  testID?: string;
};

export function Empty({ message, testID }: EmptyProps) {
  return (
    <EmptyRoot variant="root" testID={testID}>
      <EmptyImage
        variant="illustration"
        source={empty}
        resizeMode="contain"
        accessible={false}
        importantForAccessibility="no"
      />
      <EmptyRoot variant="message">
        <Text variant="inputLabel" textAlign="center">
          {message}
        </Text>
      </EmptyRoot>
    </EmptyRoot>
  );
}
