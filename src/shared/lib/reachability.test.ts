import NetInfo from '@react-native-community/netinfo';

import { isOffline } from './reachability';

type NetInfoState = Awaited<ReturnType<typeof NetInfo.fetch>>;

function networkState(
  isConnected: boolean | null,
  isInternetReachable: boolean | null,
): NetInfoState {
  return { isConnected, isInternetReachable } as NetInfoState;
}

describe('dado o estado da rede', () => {
  test('quando a interface ou a internet está indisponível, então está sem internet', async () => {
    jest.mocked(NetInfo.fetch).mockResolvedValueOnce(networkState(false, true));
    await expect(isOffline()).resolves.toBe(true);

    jest.mocked(NetInfo.fetch).mockResolvedValueOnce(networkState(true, false));
    await expect(isOffline()).resolves.toBe(true);
  });

  test('quando a rede ainda é desconhecida ou está disponível, então não está sem internet', async () => {
    jest.mocked(NetInfo.fetch).mockResolvedValueOnce(networkState(null, null));
    await expect(isOffline()).resolves.toBe(false);

    jest.mocked(NetInfo.fetch).mockResolvedValueOnce(networkState(true, null));
    await expect(isOffline()).resolves.toBe(false);

    jest.mocked(NetInfo.fetch).mockResolvedValueOnce(networkState(true, true));
    await expect(isOffline()).resolves.toBe(false);
  });
});

describe('dado que a leitura da rede falha', () => {
  test('quando o estado não volta, então o resultado não é sem internet', async () => {
    jest.mocked(NetInfo.fetch).mockRejectedValueOnce(new Error('native'));

    await expect(isOffline()).resolves.toBe(false);
  });
});
