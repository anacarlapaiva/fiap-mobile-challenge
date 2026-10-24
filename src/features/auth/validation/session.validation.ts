import { z } from 'zod';

import type { Session } from '@/features/auth/types';

const sessionSchema = z.object({
  guardianId: z.number().int(),
  studentRm: z.number().int(),
}) satisfies z.ZodType<Session>;

export function parseSession(input: unknown): Session | null {
  const parsed = sessionSchema.safeParse(input);
  if (!parsed.success) {
    return null;
  }
  return parsed.data;
}
