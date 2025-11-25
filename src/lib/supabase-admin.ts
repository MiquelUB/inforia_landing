import { createClient } from '@supabase/supabase-js';

// Nota: Usamos la SERVICE_ROLE_KEY, no la anon key.
// Esta clave NUNCA debe exponerse en el lado del cliente.
// Evitamos que el build falle si faltan las variables (común en Vercel durante el build step)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ ADVERTENCIA: Faltan variables de entorno de Supabase. Las funciones de administración fallarán en runtime.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
