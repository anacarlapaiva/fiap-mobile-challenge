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
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const signingIn = useRef<Promise<LoginResult> | null>(null);
  const hadSession = useRef(false);

  useEffect(() => {
    let active = true;
    readSession()
      .then(async stored => {
        if (!stored) {
          return null;
        }
        const guardians = await ensureGuardians(queryClient);
        if (findUser(stored, guardians)) {
          return stored;
        }
        await clearSession().catch(() => undefined);
        return null;
      })
      .then(value => {
        if (!active) {
          return;
        }
        setSession(value);
        setIsReady(true);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setSession(null);
        setIsReady(true);
      });
    return () => {
      active = false;
    };
  }, [queryClient]);

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
          await saveSession(result.session);
          setSession(result.session);
          const user = findUser(result.session, guardians);
          if (user) {
            console.log({
              session: result.session,
              guardian: {
                id: user.guardian.id,
                cpf: user.guardian.cpf,
                email: user.guardian.email,
                primeiroNome: user.guardian.primeiroNome,
                sobrenome: user.guardian.sobrenome,
              },
              student: {
                rm: user.student.rm,
                primeiroNome: user.student.primeiroNome,
                sobrenome: user.student.sobrenome,
                turma: user.student.turma,
                periodo: user.student.periodo,
              },
              students: user.guardian.alunos.map(aluno => ({
                rm: aluno.rm,
                primeiroNome: aluno.primeiroNome,
                sobrenome: aluno.sobrenome,
                turma: aluno.turma,
                periodo: aluno.periodo,
              })),
            });
          }
          return result;
        } finally {
          signingIn.current = null;
          setIsSigningIn(false);
        }
      })();
      signingIn.current = pending;
      return pending;
    },
    [queryClient],
  );

  const signOut = useCallback(() => {
    return clearSession()
      .catch(() => undefined)
      .then(() => {
        setSession(null);
      });
  }, []);

  const value = useMemo(
    () => ({ session, isReady, isSigningIn, signIn, signOut }),
    [isReady, isSigningIn, session, signIn, signOut],
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
