# Technical Plan V1: Ideas de Planes

## Decision Principal

La V1 sera una web app mobile-first, optimizada para Safari/Chrome movil, con soporte desktop basico y preparada para evolucionar a PWA.

La app debe sentirse como una app movil, no como un dashboard web.

## Stack Definitivo V1

```txt
Next.js
TypeScript
Tailwind CSS
localStorage para modo invitado inicial
Open-Meteo para clima
Leaflet para mapa/pin
Supabase Auth + Postgres despues de validar flujo local
Vercel para deploy
```

## Por Que Este Stack

### Next.js

Permite construir frontend, rutas publicas compartibles y backend ligero dentro del mismo proyecto.

Beneficios:

```txt
Routing claro
Deploy simple en Vercel
Server actions/API routes si hacen falta
Buenas opciones para SEO/link previews mas adelante
```

### TypeScript

Ayuda a modelar bien estados, categorias, fechas, scoring y datos.

### Tailwind CSS

Permite construir rapido una UI mobile-first sin crear demasiada infraestructura visual.

### localStorage

Suficiente para el primer modo invitado.

Permite validar sin auth/backend.

Si el estado local crece, se puede migrar a IndexedDB.

### Open-Meteo

API gratuita y simple para clima por coordenadas.

No requiere API key en muchos casos.

### Leaflet

Mapa suficiente para seleccionar un pin en V1.

Mas simple que MapLibre para el alcance inicial.

### Supabase

Se agrega despues de que el flujo local funcione.

Usos:

```txt
Auth con Google/email magic link
Postgres para persistencia
Shared links
Base preparada para grupos futuros
```

## Estrategia de Implementacion

La app se construye local-first.

Orden general:

```txt
1. UI mobile-first sin backend
2. Persistencia local
3. Clasificacion y scoring local
4. Clima con GPS + Open-Meteo
5. Ubicacion con mapa
6. Supabase Auth + Postgres
7. Migracion guest -> cuenta
8. Compartir links publicos
9. PWA polish
```

## Arquitectura de Rutas

Usar Next.js App Router.

```txt
app/
  page.tsx
  ideas/
    page.tsx
    [id]/
      page.tsx
  save/
    page.tsx
  account/
    page.tsx
  share/
    [token]/
      page.tsx
```

### Rutas

```txt
/                  Que hacemos?
/save              Guardar idea
/ideas             Biblioteca de ideas
/ideas/[id]        Detalle de idea
/account           Cuenta/login
/share/[token]     Vista publica compartida
```

## Estructura de Proyecto Recomendada

```txt
app/
  layout.tsx
  page.tsx
  globals.css
  save/page.tsx
  ideas/page.tsx
  ideas/[id]/page.tsx
  account/page.tsx
  share/[token]/page.tsx

components/
  BottomNav.tsx
  FloatingSaveButton.tsx
  IdeaCard.tsx
  SuggestionCard.tsx
  DateSelector.tsx
  FilterChips.tsx
  WeatherSummary.tsx
  LocationPicker.tsx
  ShareSheet.tsx
  EmptyState.tsx
  LoginPrompt.tsx
  StatusBadge.tsx
  CategoryBadge.tsx

lib/
  ideas/
    types.ts
    classify.ts
    scoring.ts
    expiration.ts
    storage.ts
    dates.ts
  weather/
    openMeteo.ts
    types.ts
  location/
    browserLocation.ts
  share/
    whatsapp.ts
    tokens.ts
  supabase/
    client.ts
    server.ts
```

## Tipos Core

```ts
export type IdeaCategory = "food" | "places" | "events" | "plans" | "other";

export type IdeaStatus = "pending" | "done" | "repeatable" | "discarded";

export type DateType = "none" | "single" | "range" | "flexible";

export type DiscardedReason = "manual" | "expired" | null;

export type IdealCondition =
  | "good_weather"
  | "indoor"
  | "outdoor"
  | "day"
  | "night"
  | "weekend"
  | "cheap"
  | "reservation_needed";

export type Idea = {
  id: string;
  rawText: string;
  title: string;
  link?: string;
  category: IdeaCategory;
  status: IdeaStatus;
  discardedReason?: DiscardedReason;
  dateType: DateType;
  dateStart?: string;
  dateEnd?: string;
  flexibleNote?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  idealConditions: IdealCondition[];
  notes?: string;
  createdByUserId?: string;
  ownerUserId?: string;
  groupId?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  lastSuggestedAt?: string;
  lastRepeatedAt?: string;
};
```

## Labels de UI

El codigo puede usar enums en ingles, pero la UI V1 debe mostrar labels en espanol.

```txt
food -> Comida
places -> Sitios
events -> Eventos
plans -> Planes
other -> Otro

pending -> Pendiente
done -> Hecha
repeatable -> Repetible
discarded -> Descartada
```

## Persistencia Local

V1 inicial guarda ideas en `localStorage`.

Key sugerida:

```txt
ideas:v1
```

Funciones:

```txt
getLocalIdeas()
saveLocalIdeas(ideas)
createLocalIdea(input)
updateLocalIdea(id, patch)
deleteLocalIdea(id) opcional, no usado en UI inicial
```

Reglas:

```txt
No borrar automaticamente ideas expiradas.
Marcar como discarded con discardedReason expired.
Mantener schema versionado para migraciones futuras.
```

## Clasificacion Sin IA

Implementar `classifyIdea(rawText: string): ClassificationResult`.

Resultado:

```ts
type ClassificationResult = {
  title: string;
  category: IdeaCategory;
  idealConditions: IdealCondition[];
  dateType?: DateType;
  flexibleNote?: string;
};
```

Reglas por palabras clave:

```txt
Comida: restaurante, cena, brunch, cafe, cafeteria, postre, helado, comida, almuerzo
Sitios: museo, bar, discoteca, rooftop, parque, mirador, mercado, tienda, playa
Eventos: evento, concierto, exhibicion, exposicion, festival, teatro, obra, feria, pop-up
Planes: picnic, jugar, nintendo, switch, cocinar, caminata, caminar, roadtrip, noche de juegos, pelicula, cine en casa
```

Condiciones:

```txt
cuando haga buen clima, sol, soleado -> good_weather
lluvia, llueva -> indoor
afuera, aire libre, parque, picnic -> outdoor
noche -> night
dia, tarde -> day
barato, gratis -> cheap
reserva -> reservation_needed
```

Si no hay match claro:

```txt
category = other
```

## Expiracion

Implementar `expireIdeas(ideas, now)`.

Regla:

```txt
Si una idea esta pending y tiene fecha single/range vencida por 1 o 2 dias, marcarla discarded con reason expired.
```

Decision tecnica:

```txt
En V1 basta con correr expiracion al cargar ideas y antes de calcular sugerencias.
No se necesita cron/job backend inicialmente.
```

## Scoring

Implementar `scoreIdeas(input)`.

Input:

```ts
type SuggestionInput = {
  ideas: Idea[];
  targetDate: string;
  filters: SuggestionFilter[];
  weather?: WeatherSummary;
  userLocation?: { latitude: number; longitude: number };
};
```

Exclusiones:

```txt
Ideas done
Ideas discarded
Ideas repeatable antes de 15 dias
Eventos vencidos
Ideas con fecha incompatible con targetDate
```

Puntaje inicial:

```txt
+40 si evento ocurre en la fecha seleccionada
+30 si evento termina en los proximos 7 dias
+25 si coincide con clima
+20 si categoria coincide con filtro
+15 si lleva mas de 30 dias pendiente
+10 si tiene ubicacion cercana
+10 si es repetible y ya pasaron 15 dias
-20 si requiere buen clima y va a llover
-20 si es outdoor y va a llover
-10 si fue sugerida recientemente
```

Output:

```ts
type ScoredIdea = {
  idea: Idea;
  score: number;
  reasons: string[];
};
```

Mostrar maximo 5 sugerencias.

## Clima

### GPS

Usar Browser Geolocation API.

Flujo:

```txt
1. Pedir permiso solo cuando se necesite clima.
2. Si acepta, obtener lat/lon.
3. Consultar Open-Meteo.
4. Guardar resultado temporalmente para evitar llamadas repetidas.
5. Si rechaza, seguir sin clima.
```

### Open-Meteo

Datos necesarios:

```txt
current temperature
precipitation probability
weather code
daily forecast para targetDate
```

Interpretacion V1:

```txt
goodWeather = probabilidad de lluvia baja y temperatura moderada
rainy = probabilidad de lluvia alta
tooCold/tooHot opcional
```

## Ubicacion y Mapa

Usar Leaflet.

En V1, ubicacion es opcional y puede ser:

```txt
Pin manual
Ubicacion actual
Nombre del lugar escrito manualmente
```

Geocoding puede quedar fuera de V1 si complica demasiado.

Alternativa simple:

```txt
Permitir mover un pin en mapa y escribir nombre del lugar manualmente.
```

## Compartir

### WhatsApp

Crear helper `buildWhatsAppShareUrl`.

Formato:

```txt
https://wa.me/?text=<encoded-message>
```

Mensaje:

```txt
Hacemos esto?
{title}
{reason}
{shareUrl}
```

### Link Compartible

Fase local inicial:

```txt
Compartir sin link publico real puede usar solo texto.
```

Fase Supabase:

```txt
Crear shared_links con token.
Ruta publica /share/[token].
Mostrar vista publica de la idea.
```

## Supabase

Agregar despues de tener flujo local funcionando.

### Auth

```txt
Google OAuth
Email magic link
```

### Tablas

```sql
create table ideas (
  id uuid primary key default gen_random_uuid(),
  raw_text text not null,
  title text not null,
  link text,
  category text not null,
  status text not null,
  discarded_reason text,
  date_type text not null,
  date_start timestamptz,
  date_end timestamptz,
  flexible_note text,
  location_name text,
  latitude double precision,
  longitude double precision,
  address text,
  ideal_conditions text[] not null default '{}',
  notes text,
  created_by_user_id uuid,
  owner_user_id uuid,
  group_id uuid,
  completed_at timestamptz,
  last_suggested_at timestamptz,
  last_repeated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table shared_links (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  token text not null unique,
  created_by_user_id uuid,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
```

### RLS Basico

Cuando Supabase este activo:

```txt
Usuarios pueden leer/escribir sus propias ideas.
Links publicos pueden leer solo ideas asociadas a shared_links validos.
group_id queda reservado para V2.
```

## Migracion Guest a Cuenta

Flujo:

```txt
1. Usuario crea ideas en localStorage.
2. Usuario inicia sesion.
3. App lee ideas locales.
4. App crea esas ideas en Supabase con ownerUserId del usuario.
5. Si la migracion funciona, marca local como synced o limpia localStorage.
6. Si falla, mantiene datos locales y muestra error recuperable.
```

Regla:

```txt
Nunca borrar ideas locales antes de confirmar persistencia remota.
```

## PWA Ready

Preparar desde el inicio:

```txt
Manifest
Iconos
Theme color
Mobile viewport correcto
Safe area para iOS Safari
```

No obligatorio en V1 inicial:

```txt
Offline completo
Push notifications
Background sync
```

## Analytics Basico

No bloquear MVP por analytics complejo.

Eventos utiles despues:

```txt
idea_created
suggestions_requested
suggestion_shared
idea_marked_done
idea_marked_repeatable
idea_discarded
login_completed
guest_migrated
```

## Orden de Implementacion Detallado

### Fase 0: Setup

```txt
Crear Next.js app con TypeScript
Configurar Tailwind
Crear layout mobile-first
Crear componentes base
```

### Fase 1: Ideas Locales

```txt
Tipos core
Storage local
Crear idea
Clasificacion simple
Lista de ideas
Detalle de idea
Estados
```

### Fase 2: Que Hacemos

```txt
Date selector
Filtros
Expiration local
Scoring
Suggestion cards
Razones de recomendacion
```

### Fase 3: Contexto

```txt
GPS browser
Open-Meteo
WeatherSummary
Reglas de clima en scoring
```

### Fase 4: Ubicacion

```txt
Leaflet
Pin manual
Guardar lat/lon
Mostrar ubicacion en card/detalle
```

### Fase 5: Compartir Simple

```txt
Share sheet UI
WhatsApp text share
Copy text/link placeholder
```

### Fase 6: Supabase

```txt
Crear proyecto Supabase
Schema ideas/shared_links
Auth Google/email
Persistencia remota
Migracion guest -> cuenta
```

### Fase 7: Links Publicos

```txt
Crear shared link
Ruta /share/[token]
Vista publica
WhatsApp con link real
```

### Fase 8: PWA y QA

```txt
Manifest/icons
Mobile Safari QA
Chrome Android QA
Desktop responsive QA
Estados vacios
Errores de permisos
Errores de red
```

## Riesgos Tecnicos

### GPS en Navegador

Puede fallar o ser rechazado.

Mitigacion:

```txt
La app debe funcionar sin clima.
Mostrar CTA para activar ubicacion.
Permitir reintentar.
```

### localStorage

Puede perderse si el usuario borra datos del navegador.

Mitigacion:

```txt
Mostrar prompt de cuenta despues de varias ideas.
Migrar a Supabase cuando haya login.
```

### Mapa

Leaflet puede requerir cuidado con SSR en Next.js.

Mitigacion:

```txt
Cargar mapa solo en cliente con dynamic import.
Mantener fallback sin mapa.
```

### Supabase Auth

OAuth/magic links pueden tomar tiempo de configuracion.

Mitigacion:

```txt
No bloquear V1 local por auth.
Agregar Supabase cuando el core este funcionando.
```

## Criterios Tecnicos de Listo

```txt
La app funciona en mobile Safari y Chrome.
Se puede crear una idea sin login.
La idea persiste en localStorage.
La app sugiere hasta 5 ideas con razones.
El clima mejora sugerencias cuando hay permiso GPS.
La app sigue funcionando sin permiso GPS.
Una idea puede compartirse por WhatsApp.
El layout es usable en desktop.
No hay dependencia obligatoria de IA.
```

## Decision Final Actual

```txt
Construir web mobile-first.
Implementar local-first antes de backend.
Usar Next.js + TypeScript + Tailwind.
Agregar Supabase despues de validar el core.
Preparar PWA, pero no depender de PWA completa en V1.
```
