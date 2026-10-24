import {
  createRestyleComponent,
  createVariant,
  type VariantProps,
} from '@shopify/restyle';
import { Image, type ImageProps } from 'react-native';

import logo from '@/assets/images/logo.png';
import type { Theme } from '@/shared/theme';

type LogoImageProps = VariantProps<Theme, 'logoVariants'> &
  Omit<ImageProps, 'source'> & { source: ImageProps['source'] };

const LogoImage = createRestyleComponent<LogoImageProps, Theme>(
  [createVariant({ themeKey: 'logoVariants' })],
  Image,
);

type LogoProps = {
  size: keyof Theme['logoVariants'];
};

export function Logo({ size }: LogoProps) {
  return (
    <LogoImage
      variant={size}
      source={logo}
      resizeMode="contain"
      accessible={false}
      importantForAccessibility="no"
    />
  );
}
