import { useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { navigationTheme } from '@/app/navigation/navigationTheme';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { AppProviders } from '@/app/providers';
import { useSession } from '@/features/auth';
import { SplashScreen } from '@/features/splash';
import { Box } from '@/shared/components';

function AppContent() {
  const { isReady } = useSession();
  const [splashDone, setSplashDone] = useState(false);
  const gateOpen = splashDone && isReady;

  return (
    <>
      <StatusBar barStyle="light-content" hidden={!gateOpen} />
      <Box flex={1} backgroundColor="background" testID="app-root">
        {gateOpen ? (
          <NavigationContainer theme={navigationTheme}>
            <RootNavigator />
          </NavigationContainer>
        ) : (
          <SplashScreen onFinish={() => setSplashDone(true)} />
        )}
      </Box>
    </>
  );
}

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;
