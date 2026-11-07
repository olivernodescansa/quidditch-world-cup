# Mundial de Quidditch

Next.js 15 (App Router) + Auth.js (Google) + Neon Postgres. Pensado para Vercel.

## Estructura

```
app/            páginas y API (landing, registro, jugar, ranking, perfil, admin, privacidad)
components/     Game (canvas), Loader (snitch), Crest, Avatar, formularios, AdSlot
lib/            db, auth, ip (hash anti-cheat), game-config, stats, teams, players
schema.sql      tablas de la base de datos
```

Para escalar: los datos de equipos están en `lib/teams.js` (agregar equipos = agregar un objeto
y su escudo en `components/Crest.js`), las reglas del juego en `lib/game-config.js` y las
fórmulas de stats/skills en `lib/stats.js`.

## Puesta en marcha

### 1. Subir el código a GitHub
```
cd mundial-quidditch
git init && git add . && git commit -m "Mundial de Quidditch"
```
Creá un repo en github.com y hacé `git remote add origin ... && git push -u origin main`.

### 2. Importar en Vercel
vercel.com → Add New → Project → elegí el repo → Deploy (el primer deploy va a fallar o quedar
incompleto hasta cargar las variables; es normal).

### 3. Base de datos gratis (Neon)
En el proyecto de Vercel: pestaña **Storage** → **Create Database** → **Neon (Postgres)** → plan Free.
Vercel agrega `DATABASE_URL` automáticamente a las variables de entorno.

Creá las tablas, con cualquiera de estas dos opciones:
- Desde Neon (Storage → Open in Neon → SQL Editor): pegá el contenido de `schema.sql` y ejecutá.
- O desde tu compu: `vercel env pull .env.local`, luego `npm i` y
  `DATABASE_URL="(copiala de .env.local)" npm run db:init`.

### 4. Login con Google
1. console.cloud.google.com → proyecto nuevo → APIs y servicios → Pantalla de consentimiento OAuth
   (tipo Externo, publicala para que entre cualquiera).
2. Credenciales → Crear ID de cliente OAuth → Aplicación web.
3. URI de redirección autorizado: `https://TU-DOMINIO/api/auth/callback/google`
   (y `http://localhost:3000/api/auth/callback/google` para probar en local).
4. Copiá el ID y el secreto.

### 5. Variables de entorno (Vercel → Settings → Environment Variables)
| Variable | Valor |
|---|---|
| `AUTH_SECRET` | `npx auth secret` o `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | los del paso 4 |
| `IP_SALT` | texto largo y aleatorio (no lo cambies después: invalida los hashes) |
| `ADMIN_EMAILS` | tu mail, para entrar a `/admin` |
| `NEXT_PUBLIC_ADSENSE_*` | opcional, ver monetización |

Después: Deployments → Redeploy.

### 6. Probar
- Entrá con Google, completá el registro, jugá una partida y mirá `/ranking` y `/perfil`.
- Probá el bloqueo: registrá una segunda cuenta de Google desde la misma red → debe rechazarla.
- Si bloquea a alguien legítimo (misma casa/escuela), entrá a `/admin` y tocá **Liberar IP**.

## Anti-cheat (cómo funciona)
- **1 cuenta por IP**: se guarda un hash (SHA-256 + sal) de la IP en `ip_registry` con clave primaria,
  así que dos registros simultáneos no pueden colarse. IPv6 se agrupa por /64.
- **Puntajes**: cada partida abre una sesión en el servidor. Al terminar, el servidor mide el tiempo
  real y rechaza puntajes, velocidades o esquives imposibles para ese tiempo. La sesión es de un solo uso.
- **Límite conocido**: nada del lado del cliente es 100% a prueba de bots. Si aparece un tramposo
  sofisticado, el siguiente paso es validar por replay de inputs.

## Local
```
cp .env.example .env.local   # completar
npm install
npm run dev
```

## Aviso
Los nombres de equipos y de Harry Potter pertenecen a sus titulares (Warner Bros. / J. K. Rowling).
Los escudos y gráficos de este proyecto son originales.
