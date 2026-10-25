import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  signInAccount,
  signOutAccount,
  waitForAccount,
} from '@/features/auth/data/account';
import { loginDirectory } from '@/features/auth/data/loginDirectory';
import { ensureGuardians } from '@/features/auth/hooks/useGuardians';
import { findUser } from '@/features/auth/session/findUser';
import {
  clearSession,
  readSession,
  saveSession,
} from '@/features/auth/session/sessionStorage';
import type { Session } from '@/features/auth/types';
import {
  assessLogin,
  loginMessages,
  messageForRemoteFailure,
  sessionFromGuardian,
  type LoginResult,
} from '@/features/auth/validation/login.validation';
import { isOffline } from '@/shared/lib/reachability';

type SessionContextValue = {
  session: Session | null;
  isReady: boolean;
  isSigningIn: boolean;
  signIn: (identifier: string, password: string) => Promise<LoginResult>;
  signOut: () => Promise<void>;
  selectStudent: (studentRm: number) => Promise<boolean>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const RESTORE_TIMEOUT_MS = 3000;

export function SessionProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const signingIn = useRef<Promise<LoginResult> | null>(null);
  const hadSession = useRef(false);
  const sessionRef = useRef<Session | null>(null);
  const storageQueue = useRef<Promise<void>>(Promise.resolve());

  const enqueueStorage = useCallback((task: () => Promise<void>) => {
    const run = storageQueue.current.then(task);
    storageQueue.current = run.catch(() => undefined);
    return run;
  }, []);

  useEffect(() => {
    let settled = false;
    let stored: Session | null = null;
    const timeout = setTimeout(() => finish(stored), RESTORE_TIMEOUT_MS);

    function finish(value: Session | null) {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      sessionRef.current = value;
      setSession(value);
      setIsReady(true);
    }

    readSession()
      .catch(() => null)
      .then(async value => {
        if (settled) {
          return;
        }
        if (!value) {
          finish(null);
          return;
        }
        stored = value;
        try {
          await waitForAccount();
          if (settled) {
            return;
          }
          const guardians = await ensureGuardians(queryClient);
          if (settled) {
            return;
          }
          if (findUser(value, guardians)) {
            finish(value);
            return;
          }
          await signOutAccount().catch(() => undefined);
          if (!settled) {
            await enqueueStorage(clearSession).catch(() => undefined);
          }
          finish(null);
        } catch {
          finish(value);
        }
      });

    return () => {
      settled = true;
      clearTimeout(timeout);
    };
  }, [enqueueStorage, queryClient]);

  useEffect(() => {
    if (session) {
      hadSession.current = true;
      return;
    }
    if (!hadSession.current) {
      return;
    }
    hadSession.current = false;
    queryClient.clear();
  }, [queryClient, session]);

  const signIn = useCallback(
    (identifier: string, password: string) => {
      if (signingIn.current) {
        return signingIn.current;
      }
      const pending = (async (): Promise<LoginResult> => {
        try {
          if (await isOffline()) {
            return { ok: false, message: loginMessages.offline };
          }
          const attempt = assessLogin(identifier, password, loginDirectory);
          if (!attempt.ok) {
            return attempt;
          }
          setIsSigningIn(true);
          const mismatch =
            attempt.kind === 'email'
              ? loginMessages.emailCredentials
              : loginMessages.credentials;
          try {
            await signInAccount(attempt.email, password);
            queryClient.removeQueries({ queryKey: ['guardians'] });
            const guardians = await ensureGuardians(queryClient);
            const guardian = guardians.find(
              item => item.email.toLowerCase() === attempt.email,
            );
            const result = sessionFromGuardian(guardian, mismatch);
            if (!result.ok) {
              await signOutAccount().catch(() => undefined);
              queryClient.removeQueries({ queryKey: ['guardians'] });
              return result;
            }
            await enqueueStorage(() => saveSession(result.session)).catch(
              () => undefined,
            );
            sessionRef.current = result.session;
            setSession(result.session);
            return result;
          } catch (error) {
            await signOutAccount().catch(() => undefined);
            queryClient.removeQueries({ queryKey: ['guardians'] });
            return {
              ok: false,
              message: messageForRemoteFailure(error, attempt.kind),
            };
          }
        } finally {
          signingIn.current = null;
          setIsSigningIn(false);
        }
      })();
      signingIn.current = pending;
      return pending;
    },
    [enqueueStorage, queryClient],
  );

  const signOut = useCallback(() => {
    sessionRef.current = null;
    return enqueueStorage(async () => {
      await signOutAccount().catch(() => undefined);
      await clearSession();
    })
      .catch(() => undefined)
      .then(() => {
        setSession(null);
      });
  }, [enqueueStorage]);

  const selectStudent = useCallback(
    async (studentRm: number) => {
      const current = sessionRef.current;
      if (!current || current.studentRm === studentRm) {
        return false;
      }
      const next: Session = { guardianId: current.guardianId, studentRm };
      const guardians = await ensureGuardians(queryClient).catch(() => null);
      if (!guardians || !findUser(next, guardians)) {
        return false;
      }
      if (sessionRef.current !== current) {
        return false;
      }
      sessionRef.current = next;
      setSession(next);
      enqueueStorage(async () => {
        if (sessionRef.current === next) {
          await saveSession(next);
        }
      }).catch(() => undefined);
      return true;
    },
    [enqueueStorage, queryClient],
  );

  const value = useMemo(
    () => ({ session, isReady, isSigningIn, signIn, signOut, selectStudent }),
    [isReady, isSigningIn, selectStudent, session, signIn, signOut],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession precisa do SessionProvider');
  }
  return value;
}
