import { createClient } from '@supabase/supabase-js';

// Nota: Usamos la SERVICE_ROLE_KEY, no la anon key.
// Esta clave NUNCA debe exponerse en el lado del cliente.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Faltan variables de entorno de Supabase (URL o Service Key)');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
