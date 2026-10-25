import { NativeModules } from 'react-native';

export type Reachability = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
};

const unknownReachability: Reachability = {
  isConnected: null,
  isInternetReachable: null,
};

type NetInfoModule = {
  fetch?: () => Promise<Reachability>;
  default?: {
    fetch?: () => Promise<Reachability>;
  };
};

function readNetworkState(): Promise<Reachability> | null {
  if (NativeModules.RNCNetInfo == null) {
    return null;
  }
  const loaded = require('@react-native-community/netinfo') as NetInfoModule;
  const fetch = loaded.default?.fetch ?? loaded.fetch;
  if (typeof fetch !== 'function') {
    return null;
  }
  return fetch();
}

export function isOffline(reachability: Reachability): boolean {
  return (
    reachability.isConnected === false ||
    reachability.isInternetReachable === false
  );
}

export async function readReachability(): Promise<Reachability> {
  try {
    const state = await readNetworkState();
    if (state == null) {
      return unknownReachability;
    }
    return {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
    };
  } catch {
    return unknownReachability;
  }
}
