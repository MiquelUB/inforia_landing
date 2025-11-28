import { createClient } from '@supabase/supabase-js';

import { Database } from './database.types';

// Definición de tipos genérica hasta que generes los database.types.ts
// Esto evita errores de TS inmediatos mientras permite compilar
// type Database = any;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Validación en desarrollo para DX (Developer Experience)
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (typeof window !== 'undefined') {
        console.warn(
            '⚠️ ADVERTENCIA: Faltan variables de entorno de Supabase (NEXT_PUBLIC_...). Usando valores placeholder.'
        );
    }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});
