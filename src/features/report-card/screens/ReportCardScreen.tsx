import { useTheme } from '@shopify/restyle';
import {
  type ComponentRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewInstance,
} from 'react-native';

import { useCurrentUser } from '@/features/auth';
import { TermSection } from '@/features/report-card/components/TermSection';
import {
  formatYearLabel,
  yearKey,
} from '@/features/report-card/formatReportCard';
import { Box, Dropdown, Empty, Screen, Text } from '@/shared/components';
import type { Theme } from '@/shared/theme';

const styles = StyleSheet.create({
  terms: { flex: 1 },
});

type HostView = ComponentRef<typeof View>;

function ReportTitle() {
  return (
    <Text variant="sectionTitle" textAlign="center" marginTop="sectionGap">
      BOLETIM
    </Text>
  );
}

export function ReportCardScreen() {
  const theme = useTheme<Theme>();
  const currentUser = useCurrentUser();
  const [pickedKey, setPickedKey] = useState<string | undefined>(undefined);
  const [openTerm, setOpenTerm] = useState<number | undefined>(undefined);
  const [openSubjects, setOpenSubjects] = useState<readonly string[]>([]);
  const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [anchor, setAnchor] = useState<{ top: number } | null>(null);
  const pendingScroll = useRef<number | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const contentRef = useRef<HostView>(null);
  const scrollOffset = useRef(0);
  const scrollAreaRef = useRef(0);
  const termNodes = useRef(new Map<number, HostView>());

  const alignTop = useCallback(
    (node: HostView | null) => {
      const content = contentRef.current;
      if (!node || !content) {
        return;
      }
      node.measureLayout(
        content,
        (_x, y, _width, height) => {
          const offset = scrollOffset.current;
          const viewHeight = scrollAreaRef.current;
          const cardBottom = y + Math.min(height, theme.sizes.cardHeight);
          if (
            viewHeight > 0 &&
            y >= offset &&
            cardBottom <= offset + viewHeight
          ) {
            return;
          }
          pendingScroll.current = y;
          setAnchor({ top: y });
        },
        () => undefined,
      );
    },
    [theme.sizes.cardHeight],
  );

  const revealSubject = useCallback((node: HostView | null) => {
    const content = contentRef.current;
    const viewHeight = scrollAreaRef.current;
    if (!node || !content || viewHeight === 0) {
      return;
    }
    node.measureLayout(
      content,
      (_x, y, _width, height) => {
        const offset = scrollOffset.current;
        if (height >= viewHeight) {
          scrollRef.current?.scrollTo({ y, animated: true });
          return;
        }
        const bottom = y + height;
        if (bottom > offset + viewHeight) {
          scrollRef.current?.scrollTo({
            y: bottom - viewHeight,
            animated: true,
          });
        }
      },
      () => undefined,
    );
  }, []);

  useEffect(() => {
    pendingScroll.current = null;
    setAnchor(null);
    if (openTerm === undefined) {
      return;
    }
    alignTop(termNodes.current.get(openTerm) ?? null);
  }, [alignTop, openTerm]);

  const bottomSpace =
    anchor === null
      ? theme.spacing.m
      : Math.max(
          theme.spacing.m,
          anchor.top + scrollAreaHeight - contentHeight,
        );

  useEffect(() => {
    const target = pendingScroll.current;
    if (target === null) {
      return;
    }
    pendingScroll.current = null;
    scrollRef.current?.scrollTo({ y: target, animated: true });
  }, [anchor, bottomSpace]);

  if (currentUser.status !== 'ready') {
    return (
      <Screen testID="report-card-screen" edges={[]}>
        <ReportTitle />
      </Screen>
    );
  }

  const reports = currentUser.user.student.boletim;
  const selected =
    reports.find(item => yearKey(item.turma, item.ano) === pickedKey) ??
    reports[0];

  if (!selected) {
    return (
      <Screen testID="report-card-screen" edges={[]}>
        <ReportTitle />
        <Empty message="Nenhum boletim disponível." />
      </Screen>
    );
  }

  const selectedKey = yearKey(selected.turma, selected.ano);

  const toggleTerm = (trimestre: number) => {
    setOpenTerm(current => (current === trimestre ? undefined : trimestre));
    setOpenSubjects([]);
  };

  const toggleSubject = (nome: string) => {
    setOpenSubjects(current =>
      current.includes(nome)
        ? current.filter(item => item !== nome)
        : [...current, nome],
    );
  };

  return (
    <Screen testID="report-card-screen" edges={[]}>
      <ReportTitle />
      <Box paddingHorizontal="m" marginTop="m">
        <Dropdown
          testID="report-year"
          value={selectedKey}
          textInset="s"
          options={reports.map(item => ({
            label: formatYearLabel(item.turma, item.ano),
            value: yearKey(item.turma, item.ano),
          }))}
          onSelect={option => {
            if (option.value === selectedKey) {
              return;
            }
            setPickedKey(option.value);
            setOpenTerm(undefined);
            setOpenSubjects([]);
          }}
        />
      </Box>
      <Box flex={1}>
        <ScrollView
          ref={scrollRef}
          testID="report-terms"
          style={styles.terms}
          contentContainerStyle={{ paddingBottom: bottomSpace }}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          scrollEventThrottle={16}
          onScroll={event => {
            scrollOffset.current = event.nativeEvent.contentOffset.y;
          }}
          onLayout={event => {
            const height = event.nativeEvent.layout.height;
            scrollAreaRef.current = height;
            setScrollAreaHeight(current =>
              current === height ? current : height,
            );
          }}
        >
          <View
            ref={contentRef}
            collapsable={false}
            onLayout={event => {
              const height = event.nativeEvent.layout.height;
              setContentHeight(current =>
                current === height ? current : height,
              );
            }}
          >
            <Box paddingHorizontal="m" paddingTop="m">
              {selected.trimestres.map((term, index) => (
                <TermSection
                  key={term.trimestre}
                  trimestre={term.trimestre}
                  disciplinas={term.disciplinas}
                  open={openTerm === term.trimestre}
                  openSubjects={openSubjects}
                  spaced={index > 0}
                  onToggle={() => toggleTerm(term.trimestre)}
                  onToggleSubject={toggleSubject}
                  onRevealSubject={revealSubject}
                  sectionRef={node => {
                    if (node) {
                      termNodes.current.set(term.trimestre, node);
                      return;
                    }
                    termNodes.current.delete(term.trimestre);
                  }}
                />
              ))}
            </Box>
          </View>
        </ScrollView>
      </Box>
    </Screen>
  );
}
