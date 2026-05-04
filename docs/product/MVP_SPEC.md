# MVP Spec: Ideas de Planes

## Objetivo

Construir una V1 de web app responsive que permita guardar ideas de planes, recibir sugerencias contextuales y compartirlas con amigos.

La V1 valida el uso personal, pero debe estar preparada para grupos en el modelo de datos y lenguaje de producto.

## Principios de Producto

```txt
Guardar primero, enriquecer despues.
La pantalla principal es Que hacemos?, no una lista.
Todo se guarda como una Idea.
La app debe funcionar sin IA obligatoria.
La experiencia debe sentirse social aunque la V1 sea personal.
```

## Alcance V1

Incluye:

```txt
Web app responsive
Modo invitado
Login con Google/email magic link
Crear idea con texto libre y link opcional
Editar detalles de una idea
Estados: Pendiente, Hecha, Repetible, Descartada
Categorias: Comida, Sitios, Eventos, Planes, Otro
Fechas: sin fecha, especifica, rango, flexible
Ubicacion opcional con pin en mapa
Clima por GPS del navegador
Sugerencias por scoring simple
Compartir idea o sugerencia por WhatsApp/link
```

No incluye:

```txt
Grupos completos
Votaciones
Chat
Disponibilidad de amigos
Calendarios compartidos
Reservas
Pagos
Importadores de redes sociales
IA como dependencia critica
```

## Navegacion Principal

La app tiene cuatro areas principales:

```txt
Que hacemos?
Guardar idea
Ideas
Cuenta
```

En mobile, `Que hacemos?`, `Ideas` y `Cuenta` viven en una bottom nav tipo pastilla flotante. `Guardar idea` vive como accion global `+` flotante.

En desktop, pueden vivir en sidebar o top navigation.

## Pantalla: Que Hacemos?

Esta es la pantalla inicial.

### Objetivo

Ayudar al usuario a decidir que hacer en una fecha o momento especifico.

### Elementos

```txt
Selector Cuando: Hoy, Manana, Fin de semana, Fecha
Estado de carga mientras se leen ideas locales
Carrusel horizontal de hasta 5 sugerencias validas
Estado vacio/onboarding cuando no hay ideas guardadas
Estado sin sugerencias cuando existen ideas pero ninguna aplica
Acceso rapido a Guardar idea mediante FAB global `+`
```

### Estado Cargando

Mientras la app lee datos locales:

```txt
Buscando planes para ti
Estamos encontrando las mejores ideas para tu dia.
```

Debe mostrarse con un loader circular visible.

### Estado Vacio / Onboarding

Si no hay ideas guardadas:

```txt
Aqui apareceran tus planes
Guarda tu primera idea y te ayudamos a decidir cuando hacerla.
```

CTA:

```txt
FAB global `+`
```

### Sin Sugerencias Valididas

Si hay ideas guardadas pero ninguna puede sugerirse para el momento seleccionado:

```txt
No hay planes listos para este momento
Prueba otro momento o guarda una nueva idea.
```

### Resultado de Sugerencias

Cada sugerencia muestra:

```txt
Placeholder visual tipo foto segun categoria
Titulo
Categoria
Razon de recomendacion
Fecha si aplica
Distancia aproximada si hay ubicacion
Acciones: Compartir, Ver detalle
```

Ejemplo:

```txt
Picnic en el parque
Planes
Hoy hace buen clima y esta idea lleva 2 meses pendiente.
```

## Pantalla: Guardar Idea

### Objetivo

Capturar una idea con la menor friccion posible.

### Campos Iniciales

```txt
Texto libre obligatorio
Link opcional
```

### CTA Principal

```txt
Guardar idea
```

### Comportamiento

Al guardar:

```txt
La idea se crea inmediatamente.
La app intenta clasificarla con reglas simples.
La app muestra una pantalla de confirmacion editable.
```

### Confirmacion Editable

Campos editables despues de guardar:

```txt
Titulo
Categoria
Estado
Fecha
Ubicacion
Condiciones ideales
Notas
Link
```

Regla:

```txt
Ningun campo extra debe ser obligatorio.
```

## Pantalla: Ideas

### Objetivo

Permitir revisar, filtrar y mantener la biblioteca de ideas.

### Filtros

```txt
Todas
Pendientes
Repetibles
Hechas
Descartadas
Comida
Sitios
Eventos
Planes
Otro
```

### Orden Default

```txt
Pendientes mas recientes primero
Eventos proximos arriba
Repetibles disponibles arriba
Descartadas al final
```

### Tarjeta de Idea

```txt
Titulo
Categoria
Estado
Fecha si aplica
Ubicacion si aplica
Link si aplica
Acciones rapidas
```

## Pantalla: Detalle de Idea

### Objetivo

Ver y editar todos los datos de una idea.

### Campos

```txt
Titulo
Texto original
Categoria
Estado
Link
Fecha
Ubicacion
Condiciones ideales
Notas
Fecha de creacion
Ultima vez sugerida
Fecha en que se hizo
```

### Acciones

```txt
Guardar cambios
Marcar como hecha
Marcar como repetible
Descartar
Compartir
```

## Pantalla: Cuenta

### Objetivo

Permitir persistencia sin crear friccion inicial.

### Modo Invitado

El usuario puede probar la app sin cuenta.

Debe poder:

```txt
Crear ideas locales
Ver sugerencias locales
Editar ideas locales
```

Limitaciones sugeridas:

```txt
Aviso de que las ideas pueden perderse si no crea cuenta
Prompt de login al compartir o al guardar varias ideas
```

### Login

Opciones recomendadas:

```txt
Google
Email magic link
```

No usar password propio en V1.

## Tipos y Estados

### Categorias

```txt
Comida
Sitios
Eventos
Planes
Otro
```

### Estados

```txt
Pendiente
Hecha
Repetible
Descartada
```

### Tipos de Fecha

```txt
none
single
range
flexible
```

### Condiciones Ideales

```txt
Buen clima
Indoor
Outdoor
Dia
Noche
Fin de semana
Barato
Reserva necesaria
```

## Reglas de Estado

### Pendiente

Una idea nueva empieza como `Pendiente` salvo que el usuario indique otra cosa.

### Hecha

Una idea `Hecha` no debe volver a sugerirse.

### Repetible

Una idea `Repetible` puede volver a sugerirse si pasaron al menos 15 dias desde `completed_at` o `last_repeated_at`.

### Descartada

Una idea `Descartada` no debe sugerirse.

Debe guardarse la razon cuando sea posible:

```txt
manual
expired
```

### Expiracion Automatica

Una idea con fecha fija o rango puede pasar a `Descartada` automaticamente si:

```txt
La fecha termino hace 1 o 2 dias.
La idea sigue Pendiente.
No fue marcada como Hecha o Repetible.
```

Internamente:

```txt
status = Descartada
discarded_reason = expired
```

## Clasificacion Inicial Sin IA

La V1 usa reglas simples basadas en palabras clave.

### Comida

```txt
restaurante
cena
brunch
cafe
cafeteria
postre
helado
comida
almuerzo
```

### Sitios

```txt
museo
bar
discoteca
rooftop
parque
mirador
mercado
tienda
playa
```

### Eventos

```txt
evento
concierto
exhibicion
exposicion
festival
teatro
obra
feria
pop-up
```

### Planes

```txt
picnic
jugar
nintendo
switch
cocinar
caminata
caminar
roadtrip
noche de juegos
pelicula
cine en casa
```

Si no hay match claro:

```txt
Otro
```

## Clima

### Permiso GPS

La app debe pedir permiso de ubicacion solo cuando sea necesario para sugerencias basadas en clima o cercania.

Texto sugerido:

```txt
Usamos tu ubicacion aproximada para revisar el clima y sugerir mejores ideas.
```

### API

Usar Open-Meteo con latitud/longitud del navegador.

Datos minimos:

```txt
Temperatura
Probabilidad de lluvia
Condicion general
Velocidad de viento opcional
```

### Interpretacion Simple

```txt
Buen clima: sin lluvia significativa y temperatura agradable
Lluvia: probabilidad alta de precipitacion
Frio/calor: umbrales configurables por ciudad despues
```

## Reglas de Sugerencia

El motor de sugerencias debe ser deterministico y explicable.

### Exclusiones

No sugerir:

```txt
Ideas Hechas
Ideas Descartadas
Ideas Repetibles antes de 15 dias
Eventos vencidos
Ideas con fecha incompatible con la fecha elegida
```

### Scoring Base

```txt
+40 si evento ocurre en la fecha seleccionada
+30 si evento termina en los proximos 7 dias
+25 si la idea coincide con el clima actual
+20 si la categoria coincide con filtro seleccionado
+15 si la idea lleva mas de 30 dias pendiente
+10 si tiene ubicacion cercana
+10 si es repetible y ya pasaron 15 dias
-20 si requiere buen clima y va a llover
-20 si es outdoor y va a llover
-10 si fue sugerida recientemente
```

### Resultado

Ordenar por score descendente y devolver maximo 5 ideas.

### Explicaciones

Cada sugerencia debe mostrar la razon principal.

Ejemplos:

```txt
Termina pronto.
Buen clima para hacerlo hoy.
Lleva tiempo pendiente.
Es repetible y ya pasaron mas de 15 dias.
Coincide con el tipo de plan que elegiste.
```

## Compartir

### Compartir Por WhatsApp

Generar un mensaje con:

```txt
Titulo
Fecha sugerida si aplica
Razon breve
Link a la idea o sugerencia
```

Ejemplo:

```txt
Hacemos esto?
Picnic en el parque este sabado.
La app lo sugirio porque va a hacer buen clima.
```

### Link Compartible

El link debe abrir una vista publica basica de la idea o sugerencia.

Para V1, el receptor no necesita cuenta para ver el contenido compartido.

## Modelo de Datos

### users

```txt
id
email
name
avatar_url
created_at
updated_at
```

### ideas

```txt
id
raw_text
title
link
category
status
discarded_reason
date_type
date_start
date_end
flexible_note
location_name
latitude
longitude
address
ideal_conditions
notes
created_by_user_id
owner_user_id
group_id
created_at
updated_at
completed_at
last_suggested_at
last_repeated_at
```

### shared_links

```txt
id
idea_id
token
created_by_user_id
created_at
expires_at nullable
```

### future_groups

No construir en V1, pero reservar mentalmente:

```txt
groups
group_members
group_invitations
```

## Auth y Persistencia

### Invitado

Guardar datos en local storage o IndexedDB.

Al crear cuenta, migrar ideas locales al usuario autenticado.

### Autenticado

Guardar ideas en Postgres.

### Prompt de Login

Mostrar prompt cuando:

```txt
El usuario intenta compartir
El usuario creo 3 ideas
El usuario vuelve otro dia
El usuario quiere sincronizar datos
```

## Responsive

La V1 debe funcionar bien en mobile primero.

### Mobile

```txt
Input de guardar accesible rapidamente
Cards grandes para sugerencias
Acciones faciles de tocar
Compartir por WhatsApp prominente
```

### Desktop

```txt
Mas espacio para lista y detalle
Panel lateral opcional para filtros
```

## Orden de Implementacion

### Fase 1: Base UI Local

```txt
Crear app
Crear layout responsive
Pantalla Que hacemos?
Pantalla Guardar idea
Guardar ideas localmente
Pantalla Ideas
Detalle de idea
```

### Fase 2: Reglas Core

```txt
Clasificacion por palabras clave
Estados y transiciones
Fechas
Scoring simple
Razones de recomendacion
```

### Fase 3: Contexto

```txt
GPS del navegador
Open-Meteo
Condiciones de clima
Ubicacion con pin en mapa
```

### Fase 4: Persistencia

```txt
Supabase
Auth con Google/email
Migracion de invitado a cuenta
Postgres schema
```

### Fase 5: Compartir

```txt
Shared links
Vista publica de idea
WhatsApp share
```

### Fase 6: Pulido

```txt
Estados vacios
Loading states
Errores
Responsive QA
Metricas basicas
```

## Criterios de Aceptacion MVP

El MVP esta listo para probar con usuarios si:

```txt
Un usuario puede guardar una idea en menos de 10 segundos.
Un usuario puede pedir sugerencias para hoy o este fin de semana.
La app devuelve hasta 5 ideas con razones entendibles.
Una idea puede marcarse como Hecha, Repetible o Descartada.
Una idea Repetible vuelve a sugerirse despues de 15 dias.
Una idea con fecha pasada se descarta automaticamente segun regla.
El clima se usa cuando el usuario concede GPS.
Una sugerencia puede compartirse por WhatsApp/link.
Las ideas no se pierden si el usuario crea cuenta.
La app funciona correctamente en mobile.
```

## Preguntas Abiertas Para Diseno

```txt
Cuanto protagonismo tiene el input de guardar en la pantalla principal?
La lista de ideas debe ser tab secundaria o parte de la pantalla principal?
Como se comunica que el modo invitado puede perder datos?
Como se muestra la razon de una sugerencia sin hacer la card demasiado pesada?
```

## Preguntas Abiertas Tecnicas

```txt
Supabase o alternativa definitiva?
Leaflet o MapLibre para mapa?
Local storage o IndexedDB para modo invitado?
Cada cuanto correr expiracion automatica de eventos?
Se necesita job backend o basta con evaluar al consultar?
```

## Proximo Entregable Recomendado

Crear wireframes de baja fidelidad para:

```txt
Que hacemos?
Guardar idea
Ideas
Detalle de idea
Compartir
Cuenta/login
```
