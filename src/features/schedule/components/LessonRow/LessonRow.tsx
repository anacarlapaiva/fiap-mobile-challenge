import { useTheme } from '@shopify/restyle';

import { Box, Text } from '@/shared/components';
import type { AulaDto } from '@/shared/dto';
import type { Theme } from '@/shared/theme';

type LessonRowProps = {
  aula: AulaDto;
};

export function LessonRow({ aula }: LessonRowProps) {
  const theme = useTheme<Theme>();

  return (
    <Box
      height={theme.sizes.lessonRowHeight}
      flexDirection="row"
      alignItems="center"
      paddingHorizontal="l"
    >
      <Box
        width={theme.sizes.bullet}
        height={theme.sizes.bullet}
        borderRadius="bullet"
        borderWidth={theme.borderWidths.thin}
        borderColor="bulletBorder"
        marginRight="s"
      />
      <Box>
        <Text variant="caption">{aula.horario}</Text>
        <Text variant="bodySemiBold">{aula.disciplina}</Text>
      </Box>
    </Box>
  );
}
