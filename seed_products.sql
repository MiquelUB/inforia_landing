-- Script para poblar los 5 Planes de Inforia en Supabase
-- IMPORTANTE: Reemplaza los 'price_...' con tus IDs reales de Stripe.

-- 1. Limpiar datos existentes (Opcional)
-- DELETE FROM prices;
-- DELETE FROM products;

-- 2. Insertar Productos (Los 5 Planes)
INSERT INTO products (id, active, name, description, metadata) VALUES
('prod_esencial', true, 'Plan Esencial', 'Para Solo-preneurs', '{"target": "Solo-preneur", "reports_limit": "50", "users_limit": "1", "features": "Transcripción Whisper,Generación IA (GPT-4o),Almacenamiento Drive,1 Usuario", "popular": "false"}'),

('prod_duo', true, 'Plan Dúo', 'Para Socios', '{"target": "Socios / Parejas", "reports_limit": "110", "users_limit": "2", "features": "2 Usuarios,Panel de equipo,Facturación unificada,Soporte Prioritario", "popular": "true"}'),

('prod_profesional', true, 'Plan Profesional', 'Pequeñas Consultas', '{"target": "Consulta Activa", "reports_limit": "220", "users_limit": "3", "features": "3 Usuarios,Gestión de roles,Onboarding asistido,Soporte Prioritario", "popular": "false"}'),

('prod_clinica', true, 'Plan Clínica', 'Equipos en Crecimiento', '{"target": "Clínica", "reports_limit": "400", "users_limit": "4", "features": "4 Usuarios,Gestión centralizada,Acceso API (Bajo demanda),Soporte Dedicado", "popular": "false"}'),

('prod_centro', true, 'Plan Centro', 'Instituciones', '{"target": "Gran Centro", "reports_limit": "650", "users_limit": "5", "features": "5 Usuarios,Auditoría de uso,Contrato DPA personalizado,Soporte 24/7", "popular": "false"}')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata;

-- 3. Insertar Precios (Asegúrate de cambiar los IDs 'price_...' por los de tu Stripe)
INSERT INTO prices (id, product_id, active, unit_amount, currency, type, interval) VALUES
('price_esencial_test', 'prod_esencial', true, 4900, 'eur', 'recurring', 'month'),
('price_duo_test', 'prod_duo', true, 9900, 'eur', 'recurring', 'month'),
('price_profesional_test', 'prod_profesional', true, 18900, 'eur', 'recurring', 'month'),
('price_clinica_test', 'prod_clinica', true, 29900, 'eur', 'recurring', 'month'),
('price_centro_test', 'prod_centro', true, 45000, 'eur', 'recurring', 'month')
ON CONFLICT (id) DO UPDATE SET unit_amount = EXCLUDED.unit_amount;

-- 4. Verificar inserción
SELECT name, metadata->>'target' as target, metadata->>'reports_limit' as reports FROM products;
