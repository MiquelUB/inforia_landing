import { createClient } from '@supabase/supabase-js';

// Nota: Usamos la SERVICE_ROLE_KEY, no la anon key.
// Esta clave NUNCA debe exponerse en el lado del cliente.
// Evitamos que el build falle si faltan las variables (común en Vercel durante el build step)
// Usamos valores dummy si no existen para que createClient no lance error al inicializarse
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key-for-build';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ ADVERTENCIA: Faltan variables de entorno de Supabase. Usando valores dummy para el build.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
