import { useState } from 'react';
import { StatusBar } from 'react-native';

import { AppProviders } from '@/app/providers';
import { SplashScreen } from '@/features/splash';
import { Box } from '@/shared/components';

function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  return (
    <AppProviders>
      <StatusBar barStyle="light-content" hidden={splashVisible} />
      <Box flex={1} backgroundColor="background" testID="app-root">
        {splashVisible ? (
          <SplashScreen onFinish={() => setSplashVisible(false)} />
        ) : null}
      </Box>
    </AppProviders>
  );
}

export default App;
