import { supabase as newSupabase } from '@/lib/supabase';

console.warn('⚠️ DEPRECATED: Importing from @/integrations/supabase/client is deprecated. Use @/lib/supabase instead.');

export const supabase = newSupabase;
