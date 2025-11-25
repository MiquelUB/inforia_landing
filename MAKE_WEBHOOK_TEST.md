# 🧪 Verificación del Webhook de Make.com

## 📋 ¿Qué hace el webhook de Make.com?

El webhook de Make.com captura los leads (clientes potenciales) que se registran en tu landing page a través del formulario de "Demo Gratis" o lead magnet.

---

## ✅ Verificación Rápida

### **Opción 1: Verificar Configuración (GET)**

Abre en tu navegador o usa curl:

```bash
curl https://inforia.pro/api/test-make
```

**Respuesta esperada si está configurado:**
```json
{
  "status": "success",
  "message": "Make.com webhook está configurado",
  "configured": true,
  "webhookUrl": "https://hook.us1.make.com/...",
  "timestamp": "2025-11-25T10:15:00.000Z"
}
```

**Respuesta esperada si NO está configurado:**
```json
{
  "status": "error",
  "message": "MAKE_WEBHOOK_LEAD no está configurado",
  "configured": false,
  "instructions": [...]
}
```

---

### **Opción 2: Enviar Datos de Prueba (POST)**

```bash
curl -X POST https://inforia.pro/api/test-make
```

Esto enviará datos de prueba a Make.com:
- Nombre: "Test Usuario - Verificación"
- Email: "test-verificacion@inforia.pro"
- Role: "Test"

**Respuesta esperada si funciona:**
```json
{
  "status": "success",
  "message": "Datos de prueba enviados a Make.com",
  "testData": {...},
  "makeResponse": {
    "status": 200,
    "statusText": "OK"
  }
}
```

---

## 🔧 Configuración en Vercel

Si el webhook NO está configurado, sigue estos pasos:

### **1. Obtén la URL del webhook en Make.com:**

1. Ve a [Make.com](https://make.com)
2. Abre tu escenario (o crea uno nuevo)
3. Añade un módulo **"Webhook" → "Custom webhook"**
4. Copia la URL generada (ej: `https://hook.us1.make.com/xxxxx`)

### **2. Configura la variable en Vercel:**

1. Ve a [Vercel Dashboard](https://vercel.com)
2. Selecciona tu proyecto **inforia-landing-next**
3. Ve a **Settings** → **Environment Variables**
4. Añade la variable:
   - **Name:** `MAKE_WEBHOOK_LEAD`
   - **Value:** `https://hook.us1.make.com/xxxxx` (tu URL)
   - **Environments:** Production, Preview, Development
5. Haz clic en **Save**
6. **Redespliega** el proyecto para que tome la variable

---

## 🧪 Probar con el Formulario Real

### **Opción 3: Usar el endpoint de lead-magnet**

```bash
curl -X POST https://inforia.pro/api/lead-magnet \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "role": "Psicólogo"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Lead capturado correctamente. ¡Revisa tu email!",
  "data": {
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

---

## 📊 Verificar en Make.com

Después de enviar datos de prueba:

1. Ve a Make.com
2. Abre tu escenario
3. Haz clic en **"Run once"** o revisa el historial
4. Deberías ver los datos recibidos en el webhook

**Estructura de datos que llega a Make:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "role": "Psicólogo",
  "timestamp": "2025-11-25T10:15:00.000Z",
  "source": "landing-page"
}
```

---

## 🐛 Solución de Problemas

### **Error: "MAKE_WEBHOOK_LEAD no está configurado"**

✅ **Solución:** Configura la variable de entorno en Vercel (ver arriba)

### **Error: "Error al procesar la solicitud"**

Posibles causas:
- ❌ El escenario en Make.com está desactivado
- ❌ La URL del webhook es incorrecta
- ❌ Make.com tiene problemas temporales

✅ **Solución:** 
1. Ve a Make.com y verifica que el escenario esté activo
2. Verifica que la URL del webhook sea correcta
3. Revisa los logs en Make.com

### **Error: Status 500 desde Make.com**

✅ **Solución:** Revisa los logs de ejecución en Make.com para ver el error específico

---

## 🎯 Flujo Completo

```
Usuario → Rellena formulario en landing
    ↓
API /api/lead-magnet recibe datos
    ↓
Valida con Zod (nombre, email, role)
    ↓
Envía a Make.com webhook
    ↓
Make.com procesa (envía email, guarda en CRM, etc)
    ↓
Usuario recibe email de bienvenida
```

---

## 📝 Notas Importantes

- 🔒 **Seguridad:** La URL del webhook es sensible, no la compartas públicamente
- 📧 **Emails:** Si tienes un flujo de emails en Make, recibirás emails de prueba
- 🧹 **Limpieza:** Puedes borrar los datos de prueba de tu CRM después
- 🚀 **Producción:** Una vez verificado, ya está listo para recibir leads reales

---

## 📞 Si necesitas ayuda

Revisa los logs en:
- **Vercel:** Functions → Ver logs de `/api/test-make` o `/api/lead-magnet`
- **Make.com:** Scenario → Execution history

¿Quieres que te ayude a configurar el escenario en Make.com también?
