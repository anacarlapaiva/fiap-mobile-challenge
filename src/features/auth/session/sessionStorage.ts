import * as Keychain from 'react-native-keychain';

import type { Session } from '@/features/auth/types';
import { parseSession } from '@/features/auth/validation/session.validation';

const service = 'br.com.fiap.school.session';
const account = 'session';

export async function readSession(): Promise<Session | null> {
  const stored = await Keychain.getGenericPassword({ service });
  if (!stored) {
    return null;
  }
  return parseSession(parsePayload(stored.password));
}

export async function saveSession(session: Session): Promise<void> {
  await Keychain.setGenericPassword(account, JSON.stringify(session), {
    service,
  });
}

export async function clearSession(): Promise<void> {
  await Keychain.resetGenericPassword({ service });
}

function parsePayload(password: string): unknown {
  try {
    return JSON.parse(password) as unknown;
  } catch {
    return null;
  }
}
