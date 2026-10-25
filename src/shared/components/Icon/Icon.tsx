import { useTheme } from '@shopify/restyle';
import Svg, { Path } from 'react-native-svg';

import type { Theme } from '@/shared/theme';

import { icons, type IconName } from './icons';

type IconProps = {
  name: IconName;
  color: keyof Theme['colors'];
  size: keyof Theme['iconSizes'];
};

export function Icon({ name, color, size }: IconProps) {
  const theme = useTheme<Theme>();
  const icon = icons[name];
  const height = theme.iconSizes[size];
  const width = (height * icon.width) / icon.height;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      fill="none"
      accessible={false}
      importantForAccessibility="no"
    >
      {icon.paths.map(path => (
        <Path
          key={path.d}
          d={path.d}
          fill={theme.colors[color]}
          fillRule={'fillRule' in path ? path.fillRule : undefined}
        />
      ))}
    </Svg>
  );
}
