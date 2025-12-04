-- Script para arreglar permisos RLS en Supabase
-- Copia y pega esto en el SQL Editor de Supabase

-- 1. Limpiar políticas antiguas (para evitar el error "policy already exists")
drop policy if exists "Public prices" on prices;
drop policy if exists "Public products" on products;

-- 2. Asegurar que RLS está activado
alter table prices enable row level security;
alter table products enable row level security;

-- 3. Crear las políticas de lectura pública
create policy "Public prices" on prices for select using ( true );
create policy "Public products" on products for select using ( true );

-- 4. Verificar que hay datos (Opcional)
select count(*) as total_prices from prices;
select count(*) as total_products from products;
