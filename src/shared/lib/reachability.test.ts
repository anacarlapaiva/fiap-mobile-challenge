import NetInfo from '@react-native-community/netinfo';
import { NativeModules } from 'react-native';

import { isOffline, readReachability } from './reachability';

describe('dado o estado da rede', () => {
  test('quando a interface ou a internet está indisponível, então está sem internet', () => {
    expect(isOffline({ isConnected: false, isInternetReachable: true })).toBe(
      true,
    );
    expect(isOffline({ isConnected: true, isInternetReachable: false })).toBe(
      true,
    );
  });

  test('quando a rede ainda é desconhecida ou está disponível, então não está sem internet', () => {
    expect(isOffline({ isConnected: null, isInternetReachable: null })).toBe(
      false,
    );
    expect(isOffline({ isConnected: true, isInternetReachable: null })).toBe(
      false,
    );
    expect(isOffline({ isConnected: true, isInternetReachable: true })).toBe(
      false,
    );
  });
});

describe('dado o módulo nativo ausente', () => {
  test('quando a leitura acontece, então ela não quebra', async () => {
    const previous = NativeModules.RNCNetInfo;
    NativeModules.RNCNetInfo = null;

    await expect(readReachability()).resolves.toEqual({
      isConnected: null,
      isInternetReachable: null,
    });

    NativeModules.RNCNetInfo = previous;
  });
});

describe('dado que a leitura da rede falha', () => {
  test('quando o estado não volta, então o resultado não é sem internet', async () => {
    jest.mocked(NetInfo.fetch).mockRejectedValueOnce(new Error('native'));

    await expect(readReachability()).resolves.toEqual({
      isConnected: null,
      isInternetReachable: null,
    });
  });
});
