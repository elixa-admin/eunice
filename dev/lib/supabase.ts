import {
  getSupabaseIntegrationErrorMessage,
  getSupabaseIntegrationStatus,
  type Database,
} from '@eunice-shared/integrations/supabase';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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

const integrationStatus = getSupabaseIntegrationStatus();
export const supabase = integrationStatus.configured && integrationStatus.url && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient<Database>(integrationStatus.url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : createUnavailableSupabaseClient(getSupabaseIntegrationErrorMessage('the Eunice preview app'));

export type { Database };
export { getSupabaseIntegrationStatus };
export default supabase;
