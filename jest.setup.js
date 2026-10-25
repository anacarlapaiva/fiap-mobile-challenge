require('react-native-reanimated').setUpTests();

const mockAccountState =
  require('./src/features/auth/data/accountState').accountState;

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

jest.mock('@react-native-firebase/app', () => ({
  getApp: () => ({}),
}));

jest.mock('@react-native-firebase/auth', () => ({
  getAuth: () => ({
    get currentUser() {
      return mockAccountState.email ? { email: mockAccountState.email } : null;
    },
  }),
  onAuthStateChanged: (_auth, listener) => {
    listener(mockAccountState.email ? { email: mockAccountState.email } : null);
    return () => undefined;
  },
  signInWithEmailAndPassword: (_auth, email) => {
    mockAccountState.email = String(email).toLowerCase();
    return Promise.resolve({});
  },
  signOut: () => {
    mockAccountState.email = null;
    return Promise.resolve();
  },
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  getFirestore: () => ({}),
  collection: () => ({}),
  where: () => ({}),
  limit: () => ({}),
  query: () => ({}),
  getDocs: () => {
    const { readGuardians } = require('./src/shared/mocks');
    const email = mockAccountState.email;
    const match = readGuardians().find(
      item => item.email.toLowerCase() === email,
    );
    if (!match) {
      return Promise.resolve({ docs: [] });
    }
    return Promise.resolve({ docs: [{ data: () => match }] });
  },
}));
