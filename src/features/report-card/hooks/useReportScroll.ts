import { useTheme } from '@shopify/restyle';
import {
  type ComponentRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
  View,
} from 'react-native';

import {
  listEndSpace,
  scrollOffsetReady,
  subjectScrollTarget,
  termScrollTarget,
} from '@/features/report-card/reportListSpace';
import type { Theme } from '@/shared/theme';

type HostView = ComponentRef<typeof View>;

export function useReportScroll(openTerm: number | undefined) {
  const { spacing } = useTheme<Theme>();
  const [viewport, setViewport] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [anchorTop, setAnchorTop] = useState<number | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const contentRef = useRef<HostView>(null);
  const termNodes = useRef(new Map<number, HostView>());
  const offset = useRef(0);
  const viewportSize = useRef(0);
  const contentSize = useRef(0);
  const pending = useRef<number | null>(null);

  const flush = useCallback(() => {
    const target = pending.current;
    if (
      target === null ||
      !scrollOffsetReady(target, contentSize.current, viewportSize.current)
    ) {
      return;
    }
    pending.current = null;
    scrollRef.current?.scrollTo({ y: target, animated: true });
  }, []);

  const queue = useCallback(
    (target: number | null) => {
      pending.current = target;
      flush();
    },
    [flush],
  );

  const measure = useCallback(
    (
      node: HostView | null,
      onMeasure: (top: number, height: number) => void,
    ) => {
      const content = contentRef.current;
      if (!node || !content) {
        return;
      }
      node.measureLayout(
        content,
        (_x, top, _width, height) => onMeasure(top, height),
        () => undefined,
      );
    },
    [],
  );

  useEffect(() => {
    pending.current = null;
    setAnchorTop(null);
    if (openTerm === undefined) {
      return;
    }
    measure(termNodes.current.get(openTerm) ?? null, top => {
      setAnchorTop(top);
      queue(termScrollTarget(top, offset.current));
    });
  }, [measure, openTerm, queue]);

  const revealSubject = useCallback(
    (node: HostView | null) => {
      if (viewportSize.current === 0) {
        return;
      }
      measure(node, (top, height) => {
        const target = subjectScrollTarget(
          top,
          height,
          offset.current,
          viewportSize.current,
        );
        if (target !== null) {
          queue(target);
        }
      });
    },
    [measure, queue],
  );

  const registerTerm = useCallback(
    (trimestre: number) => (node: HostView | null) => {
      if (node) {
        termNodes.current.set(trimestre, node);
        return;
      }
      termNodes.current.delete(trimestre);
    },
    [],
  );

  const bottomSpace = listEndSpace(
    anchorTop,
    viewport,
    contentHeight,
    spacing.m,
  );

  useEffect(() => {
    flush();
  }, [anchorTop, bottomSpace, flush]);

  return {
    registerTerm,
    revealSubject,
    scrollProps: {
      ref: scrollRef,
      contentContainerStyle: { paddingBottom: bottomSpace },
      scrollEventThrottle: 16,
      onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        offset.current = event.nativeEvent.contentOffset.y;
      },
      onContentSizeChange: (_width: number, height: number) => {
        contentSize.current = height;
        flush();
      },
      onLayout: (event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height;
        viewportSize.current = height;
        setViewport(current => (current === height ? current : height));
      },
    },
    contentProps: {
      ref: contentRef,
      onLayout: (event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height;
        setContentHeight(current => (current === height ? current : height));
      },
    },
  };
}
