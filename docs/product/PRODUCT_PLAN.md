# Plan de Producto: Ideas de Planes

## Vision

Una web app para guardar ideas de cosas que hacer con amigos y recibir sugerencias utiles cuando llegue el momento de decidir: hoy, manana, este fin de semana o una fecha especifica.

La idea central es que la app funcione como una memoria inteligente de planes. No solo guarda restaurantes, eventos, sitios o actividades, sino que los vuelve a traer cuando tienen sentido segun fecha, clima, estado e historial.

## Frase de Producto

Guarda ideas de planes y recibelas justo cuando tiene sentido hacerlas.

## Problema

Las ideas de planes aparecen en momentos aleatorios y quedan dispersas en notas, screenshots, WhatsApp, Instagram, TikTok, Google Maps o la memoria.

Cuando llega el momento de decidir que hacer, muchas de esas ideas ya no estan presentes, se olvidan, expiran o cuesta encontrarlas.

## Propuesta de Valor

La app permite capturar rapidamente cualquier idea y despues responde la pregunta:

```txt
Vamos!
```

Con sugerencias como:

```txt
Picnic en el parque
Recomendado porque hoy hara buen clima y esta pendiente desde hace 2 meses.
```

```txt
Exhibicion de fotografia
Recomendada porque termina en 10 dias y el domingo va a llover.
```

```txt
Restaurante coreano
Recomendado porque esta pendiente y no han probado comida coreana recientemente.
```

## Enfoque Inicial

La vision final es para grupos de amigos, pero la V1 empieza como una experiencia personal para validar el comportamiento principal.

La app debe sentirse desde el inicio como una lista viva de ideas para hacer con gente, no como una app privada de notas.

## Hipotesis a Validar

1. Una persona guarda ideas de planes espontaneamente si la captura es rapida.
2. Esa persona vuelve a consultar la app cuando necesita decidir que hacer.
3. Las sugerencias contextuales son suficientemente utiles para que la app se vuelva recurrente.
4. Despues de recibir valor personal, el usuario quiere compartir ideas o sugerencias con amigos.

## Objeto Principal

Todo lo que se guarda es una `Idea`.

Una idea puede representar un restaurante, evento, sitio, actividad o cualquier plan posible.

Ejemplos:

```txt
Restaurante japones nuevo
Exhibicion de fotografia en agosto
Museo que queremos visitar
Jugar Nintendo Switch en mi casa
Picnic en el parque cuando haga buen clima
```

## Categorias

La V1 usa pocas categorias, sin subcategorias.

```txt
Comida
Sitios
Eventos
Planes
Otro
```

### Comida

Ideas donde el foco es comer o tomar algo.

Ejemplos:

```txt
Restaurante
Brunch
Cafe
Postre
Cena
```

### Sitios

Lugares interesantes para visitar o tener en radar.

Ejemplos:

```txt
Museo
Bar
Discoteca
Rooftop
Parque
Mirador
Mercado
```

### Eventos

Cosas con fecha, rango temporal o programacion.

Ejemplos:

```txt
Exhibicion
Concierto
Festival
Pop-up
Obra de teatro
Feria
```

### Planes

Actividades o ideas mas flexibles.

Ejemplos:

```txt
Picnic
Noche de juegos
Cocinar en casa
Jugar Nintendo Switch
Roadtrip corto
Caminar
Plan de lluvia
```

### Otro

Fallback para ideas incompletas, mixtas o dificiles de clasificar.

## Estados

```txt
Pendiente
Hecha
Repetible
Descartada
```

### Pendiente

Idea que nunca se ha hecho.

### Hecha

Idea que se hizo y no se quiere o no se puede repetir.

### Repetible

Idea que se hizo, gusto y puede volver a sugerirse en el futuro.

Regla V1:

```txt
Una idea repetible puede volver a sugerirse despues de 15 dias.
```

### Descartada

Idea que ya no interesa o que expiro.

La app puede descartar automaticamente ideas con fecha fija 1 o 2 dias despues de que pasen, si no fueron marcadas como `Hecha` o `Repetible`.

No se deben borrar automaticamente. Internamente conviene guardar la razon:

```txt
manual
expired
```

## Fechas

La V1 debe soportar:

```txt
Sin fecha
Fecha especifica
Rango de fechas
Fecha flexible
```

Ejemplos:

```txt
Sin fecha: Restaurante pendiente.
Fecha especifica: Concierto el 12 de junio.
Rango de fechas: Exhibicion del 1 al 30 de agosto.
Fecha flexible: Picnic cuando haga buen clima.
```

## Ubicacion

La ubicacion es opcional.

Cuando exista, debe ser un pin en mapa. La V1 deberia guardar:

```txt
location_name
latitude
longitude
address opcional
```

## Clima

La V1 usa el GPS del navegador para obtener el clima local del usuario.

La recomendacion tecnica inicial es usar Open-Meteo porque tiene una API gratuita util para clima por coordenadas y no requiere API key para muchos casos.

`wttr.in` puede servir para prototipo, pero Open-Meteo parece mejor base para MVP.

## Captura de Ideas

La captura principal es:

```txt
Texto libre obligatorio
Link opcional
```

Campos opcionales/editables despues de guardar:

```txt
Categoria
Fecha
Ubicacion
Condiciones ideales
Notas
```

La regla de producto es:

```txt
Guardar primero, enriquecer despues.
```

La captura nunca debe bloquearse porque la app no entendio una fecha, categoria o link.

Al crear una idea, reglas simples proponen categoria y condiciones ideales. Esas sugerencias aparecen seleccionadas en edicion, pero el usuario puede cambiarlas. La app no debe reclasificar automaticamente una idea editada salvo que exista una accion explicita de reclasificar.

Tocar una idea abre primero el detalle read-only. Desde ese detalle se puede entrar al formulario de edicion, compartir, borrar definitivamente o cambiar estado.

## Pantalla Principal

La pantalla principal debe ser `Vamos!`, no una lista de ideas.

La app debe abrir en el momento de valor: ayudar a decidir.

Opciones iniciales:

```txt
Hoy
Manana
Este finde
Elegir fecha
```

Filtros opcionales:

```txt
Comida
Sitios
Eventos
Planes
Cerca
Indoor
Outdoor
Barato
Noche
```

Resultado esperado:

```txt
3 a 5 ideas sugeridas con una razon clara.
```

## Sugerencias

La V1 no debe depender de IA para sugerir. Puede usar un sistema simple de scoring.

Factores de scoring:

```txt
Compatibilidad con fecha elegida
Compatibilidad con clima
Urgencia de eventos
Antiguedad de ideas pendientes
Ideas repetibles despues de 15 dias
Categoria/mood seleccionado
Evitar ideas hechas no repetibles
Evitar ideas descartadas
```

Ejemplo conceptual:

```txt
score = fecha
      + clima
      + urgencia
      + tiempo_pendiente
      + match_categoria
      + repetible_si_pasaron_15_dias
      - incompatibilidades
```

## Condiciones Ideales

Las condiciones pueden ser tags o flags opcionales para mejorar recomendaciones.

Iniciales:

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

## Compartir

La V1 debe permitir compartir una idea o sugerencia por:

```txt
Link compartible
WhatsApp
```

Ejemplo de mensaje:

```txt
Hacemos esto?
Picnic en el parque este sabado.
La app lo sugirio porque va a hacer buen clima.
```

Esto permite validar comportamiento grupal sin construir grupos completos todavia.

## Login

Recomendacion para V1:

```txt
Modo invitado inicial
Login con Google o email magic link
Sin usuario/password tradicional
```

El usuario puede probar la app y guardar algunas ideas localmente. Cuando quiera conservarlas, volver otro dia o compartir mejor, se le pide crear cuenta.

Motivos para tener login:

```txt
Las ideas deben persistir a futuro
El usuario no deberia perder datos al cambiar dispositivo
Compartir funciona mejor
Los grupos futuros requieren identidad
```

## IA

La IA es util, pero no debe ser dependencia critica en V1 por costos.

### V1

Usar reglas simples para clasificar texto libre.

Ejemplos:

```txt
restaurante, brunch, cafe -> Comida
museo, bar, parque -> Sitios
concierto, exhibicion, festival -> Eventos
picnic, jugar, cocinar, caminar -> Planes
```

### V1.5 o V2

Agregar IA opcional para:

```txt
Clasificar mejor texto libre
Extraer fechas
Detectar condiciones como cuando haga sol
Resumir links
Generar razones mas naturales
```

Para controlar costos, usar IA solo al crear o editar una idea, no cada vez que se carga la pantalla principal.

Un modelo local en navegador no se recomienda para V1 porque puede complicar demasiado la experiencia y el rendimiento.

## Modelo de Datos Inicial

```txt
ideas
- id
- raw_text
- title
- link
- category
- status
- discarded_reason
- date_type
- date_start
- date_end
- flexible_note
- location_name
- latitude
- longitude
- address
- ideal_conditions
- created_by_user_id
- owner_user_id
- group_id nullable
- created_at
- updated_at
- completed_at
- last_suggested_at
- last_repeated_at
```

Notas:

```txt
group_id nullable deja preparada la app para grupos futuros.
discarded_reason permite diferenciar descartada manualmente vs expirada.
ideal_conditions puede empezar como array/lista de strings.
```

## Stack Tecnico Sugerido

```txt
Next.js para web app responsive
Supabase Auth para login con Google/email
Supabase Postgres para base de datos
Open-Meteo para clima por GPS
Leaflet o MapLibre para mapa/pin de ubicacion
Reglas simples para clasificacion y scoring
```

## MVP V1

Alcance recomendado:

```txt
Web app responsive
Pantalla principal Vamos!
Crear idea con texto libre obligatorio y link opcional
Categorias: Comida, Sitios, Eventos, Planes, Otro
Estados: Pendiente, Hecha, Repetible, Descartada
Fechas: sin fecha, especifica, rango, flexible
Ubicacion opcional con pin en mapa
Clima por GPS usando Open-Meteo
Sugerencias con scoring simple
Compartir por WhatsApp/link
Modo invitado inicial
Login con Google/email para persistencia
Datos preparados para grupos futuros
```

## Fuera de Alcance V1

No construir inicialmente:

```txt
Grupos completos
Invitaciones avanzadas
Permisos por grupo
Chat
Votaciones
Disponibilidad de amigos
Calendarios compartidos
Reservas
Pagos
Importadores avanzados de Instagram/TikTok/Maps
IA como dependencia obligatoria
```

## Roadmap

### V1

Uso personal, captura rapida, recomendaciones contextuales y compartir.

### V1.5

Mejoras de IA opcional para clasificacion, extraccion de fechas y resumen de links.

### V2

Grupos simples:

```txt
Crear grupo
Invitar amigos
Todos pueden agregar ideas
Lista compartida
```

### V3

Coordinacion grupal:

```txt
Votacion ligera
Me apunto / no puedo / me gusta
Disponibilidad
Preferencias por persona
Sugerencias grupales
```

## Metricas de Validacion

Metricas principales:

```txt
Usuarios que vuelven a pedir sugerencias
Ideas guardadas por usuario por semana
Ideas sugeridas que se marcan como hechas o repetibles
Tiempo entre guardar una idea y hacerla
Cantidad de veces que una sugerencia se comparte
Porcentaje de ideas con fecha, ubicacion o condicion util
```

La metrica mas importante no es solo cuantas ideas se guardan, sino si el usuario vuelve cuando necesita decidir que hacer.

## Riesgos

### Friccion de captura

Si guardar una idea toma demasiado tiempo, el usuario seguira usando notas, screenshots o WhatsApp.

Mitigacion:

```txt
Texto libre obligatorio
Link opcional
Guardar instantaneo
Detalles editables despues
```

### Dependencia de IA

Si el producto depende de IA pagada desde el inicio, puede aumentar costos y complejidad.

Mitigacion:

```txt
Reglas simples primero
IA opcional despues
Usar IA solo en momentos especificos
```

### Producto demasiado personal

Si la app se siente como notas privadas, despues sera mas dificil convertirla en grupal.

Mitigacion:

```txt
Lenguaje social desde V1
Pantalla principal Vamos!
Compartir por WhatsApp/link
Modelo de datos con group_id nullable
```

## Decisiones Cerradas

```txt
Objeto principal: Idea
Vision: grupos de amigos
V1: personal para validar
Web app responsive
Pantalla principal: Vamos!
Captura: texto libre obligatorio + link opcional
Categorias: Comida, Sitios, Eventos, Planes, Otro
Sin subcategorias en V1
Estados: Pendiente, Hecha, Repetible, Descartada
Repetible vuelve despues de 15 dias
Fecha: sin fecha, especifica, rango, flexible
Ubicacion opcional con pin en mapa
Clima por GPS del usuario
Compartir por WhatsApp/link
Login recomendado: invitado primero, Google/email despues
IA: no obligatoria en V1
```
