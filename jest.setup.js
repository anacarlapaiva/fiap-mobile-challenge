require('react-native-reanimated').setUpTests();

const { NativeModules } = require('react-native');
NativeModules.RNCNetInfo = {};

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn(() =>
      Promise.resolve({
        isConnected: true,
        isInternetReachable: true,
      }),
    ),
  },
}));
