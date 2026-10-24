import { Screen, Text } from '@/shared/components';

export function ReportCardScreen() {
  return (
    <Screen testID="report-card-screen" edges={[]}>
      <Text variant="sectionTitle" textAlign="center" marginTop="sectionGap">
        BOLETIM
      </Text>
    </Screen>
  );
}
