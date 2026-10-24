import type { PropsWithChildren } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/shared/components/Box';

type Edge = 'top' | 'bottom' | 'left' | 'right';

type ScreenProps = PropsWithChildren<{
  edges?: readonly Edge[];
  testID?: string;
}>;

const defaultEdges: readonly Edge[] = ['top', 'bottom'];

export function Screen({
  children,
  edges = defaultEdges,
  testID,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const safeAreaPadding = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <Box
      testID={testID}
      flex={1}
      backgroundColor="background"
      style={safeAreaPadding}
    >
      {children}
    </Box>
  );
}
