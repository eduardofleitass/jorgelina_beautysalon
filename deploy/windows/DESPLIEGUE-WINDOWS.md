# Despliegue en Windows — Jorgelina Coiffure

Guía para dejar el sitio corriendo **en tu PC como servidor**, igual que el
Portal de Herramientas: sin costo, accesible desde la red local (Wi-Fi de la
oficina/local).

---

## ¿Cómo funciona?

El backend NestJS hace **dos cosas a la vez**:

1. Responde la API (`/api/reservas`, `/api/health`, etc.)
2. **Sirve el sitio web compilado** (el HTML, CSS y JS del frontend)

Entonces con **un solo proceso** en tu PC alcanza: nadie más necesita instalar
nada. Los demás equipos solo abren el navegador y entran a una dirección.

```
   Tu PC (servidor)                        Otros equipos
   ┌─────────────────────┐                 ┌──────────────┐
   │  Node.js            │   red local     │  Navegador   │
   │  puerto 3001        │◄───────────────►│              │
   │  API + sitio web    │   Wi-Fi/LAN     │  sin instalar│
   └─────────────────────┘                 └──────────────┘
```

---

## Instalación paso a paso

### Paso 1 — Compilar

Abrir PowerShell en esta carpeta (`deploy\windows`) y correr:

```powershell
.\build.ps1
```

Esto:
- Detecta y ofrece cerrar procesos que puedan bloquear archivos
- Instala dependencias y compila frontend + backend
- Crea `backend\.env` en modo producción

> Si da error de permisos al ejecutar scripts, correr una vez:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

### Paso 2 — Probar que funciona

```powershell
.\iniciar-sitio.bat
```

Abrir en el navegador: **http://localhost:3001**

Si se ve el sitio → todo bien. Cerrar la ventana para detenerlo.

### Paso 3 — Verificar

```powershell
.\verificar.ps1
```

Revisa 5 cosas: puerto, frontend, API, servicio, y acceso desde la red.

### Paso 4 — Abrir el firewall (para otros equipos)

Abrir PowerShell **como Administrador** y correr:

```powershell
.\abrir-firewall.ps1
```

Esto permite el acceso **solo desde la red local** (no desde Internet).

### Paso 5 — Instalar como servicio (arranca solo con la PC)

Abrir PowerShell **como Administrador** y correr:

```powershell
.\instalar-servicio.ps1
```

Esto hace que el sitio **arranque automáticamente** al encender la PC, se
**reinicie solo** si se cae, y corra en segundo plano (sin ventana).

**Requiere NSSM** (gratis, convierte programas en servicios de Windows):

```powershell
winget install NSSM.NSSM
```

O descargarlo de https://nssm.cc/download y copiar `nssm.exe` (carpeta `win64`)
a `C:\Windows\System32\`.

---

## Acceso desde otros equipos

Después de los pasos anteriores, los demás entran con:

```
http://192.168.100.46:3001
```

> La IP puede cambiar. Ver la actual con `.\verificar.ps1` o
> `ipconfig`.

---

## Comandos del día a día

| Quiero... | Comando |
|---|---|
| Ver si está funcionando | `.\verificar.ps1` |
| Ver el estado del servicio | `Get-Service JorgelinaCoiffure` |
| Reiniciar el servicio | `Restart-Service JorgelinaCoiffure` |
| Detener el servicio | `Stop-Service JorgelinaCoiffure` |
| Ver los logs | `Get-Content ..\..\logs\sitio-salida.log -Tail 50` |
| Ver errores | `Get-Content ..\..\logs\sitio-error.log -Tail 50` |
| Respaldar los datos | `.\backup.ps1` |
| Actualizar el sitio | `.\build.ps1` + `Restart-Service JorgelinaCoiffure` |
| Quitar el servicio | `.\instalar-servicio.ps1 -Desinstalar` (como Admin) |
| Cerrar el firewall | `.\abrir-firewall.ps1 -Cerrar` (como Admin) |

---

## Los 3 errores que hacen fallar esto

### 1. La red está marcada como "Pública"

Windows **bloquea las conexiones entrantes** aunque la regla de firewall exista.

**Arreglo:** Configuración → Red e Internet → Wi-Fi → Propiedades → Perfil de red
→ **Privada**.

### 2. La IP cambia al reiniciar

Con IP por DHCP (automática), el router puede dar otra dirección y nadie entra.

**Arreglo:** Reservar la IP en el router, o configurar una IP fija.

### 3. La PC entra en suspensión

Si la PC se duerme, el sitio deja de responder.

**Arreglo:** Configuración → Sistema → Energía → **Suspender: Nunca**.
Si es notebook, además: "No hacer nada" al cerrar la tapa.

---

## Preguntas frecuentes

**¿Y si quiero ver el sitio yo también mientras edito código?**
```powershell
npm run dev        # desde la raíz del proyecto
```
Eso levanta el modo desarrollo (Vite en 5174 + backend en 3001).

**¿Se puede chocar con el Portal de Herramientas?**
Sí — **el Portal también usa el 3001**. Solo uno de los dos puede estar
encendido a la vez. Si querés los dos simultáneos, cambiar el puerto:

```powershell
.\build.ps1 -Puerto 3002
.\instalar-servicio.ps1 -Puerto 3002
.\abrir-firewall.ps1 -Puerto 3002
```

El sitio de Jorgelina quedaría en `http://192.168.100.46:3002`.

**¿Dónde se guardan las reservas?**
En `backend\data\reservas.json`. Está **excluido del repositorio** (privacidad
de los datos de clientes). Usar `.\backup.ps1` para respaldarlas.

**¿Cómo activo la notificación por WhatsApp?**
Pegar el apikey de CallMeBot en `backend\.env`:
```
CALLMEBOT_APIKEY=tu_clave_aqui
```
Y reiniciar el servicio. Ver `backend\.env.example` para cómo obtenerlo.

---

## Archivos de esta carpeta

| Archivo | Para qué |
|---|---|
| `build.ps1` | Compila frontend + backend y genera el `.env` |
| `iniciar-sitio.bat` | Arranque manual (para probar) |
| `instalar-servicio.ps1` | Instala/quita el servicio de Windows (Admin) |
| `abrir-firewall.ps1` | Abre/cierra el puerto en el firewall (Admin) |
| `verificar.ps1` | Comprueba que todo funcione |
| `backup.ps1` | Respalda las reservas (retención: 30) |
