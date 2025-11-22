#!/bin/bash

# 🔍 Script de Validación - Configuración Stripe

echo "═══════════════════════════════════════════════════════════════"
echo "🔍 VALIDACIÓN DE CONFIGURACIÓN STRIPE"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de errores
ERRORS=0

echo "📋 VALIDANDO .env.local..."
echo ""

# Función para verificar variable
check_var() {
  local VAR_NAME=$1
  local VAR_VALUE=$(grep "^${VAR_NAME}=" .env.local | cut -d'=' -f2 | tr -d '"')
  
  if [ -z "$VAR_VALUE" ]; then
    echo -e "${RED}✗${NC} ${VAR_NAME}: NO CONFIGURADA o VACÍA"
    ((ERRORS++))
    return 1
  elif [[ "$VAR_VALUE" == price_* ]]; then
    echo -e "${GREEN}✓${NC} ${VAR_NAME}: ${VAR_VALUE}"
    return 0
  else
    echo -e "${YELLOW}⚠${NC} ${VAR_NAME}: ${VAR_VALUE} (¿Es realmente un Price ID?)"
    ((ERRORS++))
    return 1
  fi
}

echo "Verificando Price IDs..."
check_var "NEXT_PUBLIC_STRIPE_ESENCIAL_PRICE_ID"
check_var "NEXT_PUBLIC_STRIPE_DUO_PRICE_ID"
check_var "NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID"
check_var "NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID"
check_var "NEXT_PUBLIC_STRIPE_CENTRO_PRICE_ID"

echo ""
echo "Verificando claves de Stripe..."
STRIPE_PUB=$(grep "^NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=" .env.local | cut -d'=' -f2 | tr -d '"')
STRIPE_SEC=$(grep "^STRIPE_SECRET_KEY=" .env.local | cut -d'=' -f2 | tr -d '"')

if [[ "$STRIPE_PUB" == pk_test_* ]] || [[ "$STRIPE_PUB" == pk_live_* ]]; then
  echo -e "${GREEN}✓${NC} NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Configurada"
else
  echo -e "${RED}✗${NC} NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: NO válida"
  ((ERRORS++))
fi

if [[ "$STRIPE_SEC" == sk_test_* ]] || [[ "$STRIPE_SEC" == sk_live_* ]]; then
  echo -e "${GREEN}✓${NC} STRIPE_SECRET_KEY: Configurada"
else
  echo -e "${RED}✗${NC} STRIPE_SECRET_KEY: NO válida"
  ((ERRORS++))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ TODAS LAS VALIDACIONES PASARON${NC}"
  echo ""
  echo "Próximos pasos:"
  echo "1. npm run build"
  echo "2. npm run dev"
  echo "3. Testear checkout en la web"
else
  echo -e "${RED}✗ SE ENCONTRARON ${ERRORS} ERRORES${NC}"
  echo ""
  echo "Soluciona los errores antes de continuar."
fi

echo "═══════════════════════════════════════════════════════════════"
