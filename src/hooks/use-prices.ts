import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ProductPrice {
  id: string; // price_id de Stripe
  amount: number;
  interval: string;
  name: string;
  description: string;
  features: string[];
  popular: boolean;
  target: string;
  reports_limit: string;
  users_limit: string;
}

export const usePrices = () => {
  const [plans, setPlans] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        console.log('🔌 Conectando a Supabase para obtener precios...');

        // Consulta a la BD espejo (tablas prices y products)
        const { data, error } = await supabase
          .from('prices')
          .select(`
            id, 
            unit_amount, 
            interval, 
            products (
              name, 
              description, 
              metadata
            )
          `)
          .eq('active', true)
          .eq('products.active', true);

        if (error) {
          console.error('❌ Error fetching prices:', error);
          setLoading(false);
          return;
        }

        const formattedPlans = data.map((price: any) => {
          const metadata = price.products?.metadata || {};

          return {
            id: price.id,
            amount: (price.unit_amount || 0) / 100,
            interval: price.interval,
            name: price.products?.name || 'Plan',
            description: price.products?.description || '',
            // Mapeo inteligente de metadata (definida en Stripe Dashboard)
            features: metadata.features ? metadata.features.split(',') : [],
            target: metadata.target || 'General',
            reports_limit: metadata.reports_limit || '0',
            users_limit: metadata.users_limit || '1',
            popular: metadata.popular === 'true'
          };
        });

        // Ordenar por precio ascendente
        setPlans(formattedPlans.sort((a, b) => a.amount - b.amount));
      } catch (err) {
        console.error('❌ Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, []);

  return { plans, loading };
};
