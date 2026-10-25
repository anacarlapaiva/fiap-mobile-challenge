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
  type LoginResult,
} from '@/features/auth/validation/login.validation';

type SessionContextValue = {
  session: Session | null;
  isReady: boolean;
  isSigningIn: boolean;
  signIn: (cpf: string, password: string) => Promise<LoginResult>;
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
    const timeout = setTimeout(() => finish(null), RESTORE_TIMEOUT_MS);

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
      .then(async stored => {
        if (!stored || settled) {
          return null;
        }
        const guardians = await ensureGuardians(queryClient);
        if (findUser(stored, guardians)) {
          return stored;
        }
        if (!settled) {
          await enqueueStorage(clearSession).catch(() => undefined);
        }
        return null;
      })
      .catch(() => null)
      .then(finish);

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
    (cpf: string, password: string) => {
      if (signingIn.current) {
        return signingIn.current;
      }
      const pending = (async (): Promise<LoginResult> => {
        try {
          const guardians = await ensureGuardians(queryClient);
          const result = assessLogin(cpf, password, guardians);
          if (!result.ok) {
            return result;
          }
          setIsSigningIn(true);
          await enqueueStorage(() => saveSession(result.session)).catch(
            () => undefined,
          );
          sessionRef.current = result.session;
          setSession(result.session);
          return result;
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
    return enqueueStorage(clearSession)
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
