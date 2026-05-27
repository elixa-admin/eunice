import {
  type Database,
} from '@eunice-shared/integrations/supabase';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const PREVIEW_SUPABASE_URL = 'https://pjtmdiencpoguxasnyqx.supabase.co';
const PREVIEW_SUPABASE_ANON_KEY = 'sb_publishable__UDHmTFy5BMGYrfX5UafsA_3FhueacP';

function createUnavailableSupabaseClient(message: string) {
  const throwMissingConfig = () => {
    throw new Error(message);
  };

  const handler: ProxyHandler<(...args: unknown[]) => never> = {
    get() {
      return new Proxy(throwMissingConfig, handler);
    },
    apply() {
      throwMissingConfig();
    },
  };

  return new Proxy(throwMissingConfig, handler) as unknown as SupabaseClient<Database>;
}

export function getSupabaseIntegrationStatus() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? PREVIEW_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? PREVIEW_SUPABASE_ANON_KEY;
  const missingKeys = [
    !process.env.NEXT_PUBLIC_SUPABASE_URL ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : null,
  ].filter((key): key is string => Boolean(key));

  return {
    configured: Boolean(url && anonKey),
    missingKeys,
    url,
  };
}

const integrationStatus = getSupabaseIntegrationStatus();
export const supabase =
  integrationStatus.configured && integrationStatus.url
    ? createClient<Database>(integrationStatus.url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? PREVIEW_SUPABASE_ANON_KEY)
    : createUnavailableSupabaseClient('Supabase is not configured for the Eunice preview app.');

export type { Database };
export default supabase;
