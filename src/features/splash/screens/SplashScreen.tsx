import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Video, {
  MixWithOthersType,
  ResizeMode,
  type OnProgressData,
} from 'react-native-video';

import { splashVideoSource } from '@/features/splash/splashVideo';
import type { SplashScreenProps } from '@/features/splash/types';
import { Box } from '@/shared/components';
import { theme } from '@/shared/theme';

export const SPLASH_START_TIMEOUT_MS = 4000;
export const SPLASH_CAP_TIMEOUT_MS = 12000;

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: theme.spacing.none,
    right: theme.spacing.none,
    bottom: theme.spacing.none,
    left: theme.spacing.none,
    backgroundColor: theme.colors.background,
  },
});

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const onFinishRef = useRef(onFinish);
  const finishedRef = useRef(false);
  const startedRef = useRef(false);

  onFinishRef.current = onFinish;

  const finish = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    onFinishRef.current();
  }, []);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      if (!startedRef.current) {
        finish();
      }
    }, SPLASH_START_TIMEOUT_MS);
    const capTimer = setTimeout(finish, SPLASH_CAP_TIMEOUT_MS);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(capTimer);
    };
  }, [finish]);

  const onLoad = () => {
    startedRef.current = true;
  };

  const onProgress = (event: OnProgressData) => {
    if (event.currentTime > 0) {
      startedRef.current = true;
    }
  };

  return (
    <Box
      flex={1}
      backgroundColor="background"
      testID="splash-screen"
      accessible
      accessibilityRole="image"
      accessibilityLabel="Animação de abertura da FIAP"
      accessibilityViewIsModal
    >
      <Video
        testID="splash-video"
        source={splashVideoSource}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        repeat={false}
        muted
        volume={0}
        paused={false}
        controls={false}
        pointerEvents="none"
        playInBackground={false}
        playWhenInactive={false}
        allowsExternalPlayback={false}
        enterPictureInPictureOnLeave={false}
        mixWithOthers={MixWithOthersType.MIX}
        shutterColor={theme.colors.background}
        progressUpdateInterval={250}
        onLoad={onLoad}
        onProgress={onProgress}
        onEnd={finish}
        onError={finish}
      />
    </Box>
  );
}
