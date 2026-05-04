# Wireframes V1: Ideas de Planes

## Objetivo

Definir la estructura de baja fidelidad para la V1 de la web app.

Estos wireframes priorizan jerarquia, navegacion, contenido y acciones. No definen visual final, colores ni estilo de marca.

## Principios UX

```txt
Mobile-first.
La home es Que hacemos?, no la biblioteca.
Guardar una idea debe estar siempre a un toque.
El usuario puede probar sin login.
Cada sugerencia debe explicar por que aparece.
La edicion avanzada ocurre despues de guardar.
```

## Navegacion Mobile

### Bottom Tabs

```txt
( Que hacemos )   Ideas   Cuenta
```

La bottom nav mobile se presenta como una pastilla flotante con todas las esquinas redondeadas. El tab activo usa una pastilla oscura con icono y texto.

### Floating Action Button

```txt
+
```

El FAB abre la pantalla o modal de `Guardar idea`.

Reglas:

```txt
Visible en Que hacemos?, Ideas y Cuenta.
Puede ocultarse en Detalle de idea, Guardar idea y Compartir.
Debe estar optimizado para uso con una mano.
```

En `Guardar idea` y detalle de idea se ocultan tanto la bottom nav como el FAB para mantener el foco.

## Navegacion Desktop

Desktop puede usar sidebar o top navigation.

Opcion sugerida:

```txt
Sidebar izquierda:
- Que hacemos?
- Ideas
- Cuenta

Boton destacado:
+ Guardar idea
```

El contenido principal usa mayor ancho para mostrar sugerencias y paneles secundarios.

## Screen: Que Hacemos?

### Objetivo

Ayudar al usuario a decidir que hacer en una fecha o momento especifico.

### Mobile Layout

```txt
┌─────────────────────────────┐
│ Cuando: [ Hoy v ]           │
├─────────────────────────────┤
│                             │
│         (spinner)           │
│   Buscando planes para ti   │
│ Estamos encontrando ideas   │
│        para tu dia.         │
│                             │
├─────────────────────────────┤
│ FAB: +                      │
│ Tabs: Que hacemos Ideas Cta │
└─────────────────────────────┘
```

Cuando hay sugerencias, el area central reemplaza el estado de carga por un carrusel horizontal de tarjetas visuales. Cada tarjeta es tappable completa; el detalle se abre al tocar cualquier zona que no sea la accion de compartir.

### Tarjeta de Sugerencia

```txt
┌─────────────────────────────┐
│ [Categoria]            [↥]  │
│                             │
│       visual/foto           │
│                             │
├─────────────────────────────┤
│ Picnic en el parque         │
│ Razon de recomendacion      │
└─────────────────────────────┘
```

La categoria usa un badge claro/palido sobre la imagen. El boton superior derecho usa icono de compartir y no navega al detalle.

### Desktop Layout

```txt
┌──────────────┬────────────────────────────────────────┐
│ Sidebar      │ Cuando: [Hoy v]                        │
│ Que hacemos  │                                        │
│ Ideas        │ Clima: 22 C · Sin lluvia                │
│ Cuenta       │                                        │
│ + Guardar    │                                        │
│              │ ┌──────────────┐ ┌──────────────┐     │
│              │ │ Picnic       │ │ Restaurante  │     │
│              │ │ razon        │ │ razon        │     │
│              │ └──────────────┘ └──────────────┘     │
└──────────────┴────────────────────────────────────────┘
```

### Estados

#### Cargando

```txt
(loader circular)
Buscando planes para ti
Estamos encontrando las mejores ideas para tu dia.
```

#### Sin Ideas

```txt
Aqui apareceran tus planes
Guarda tu primera idea y te ayudamos a decidir cuando hacerla.

FAB global: +
```

#### Sin Permiso de Ubicacion

```txt
Activa tu ubicacion para usar el clima en las sugerencias.

[Usar ubicacion]
[Ahora no]
```

#### Sin Sugerencias Para Esa Fecha

```txt
No hay planes listos para este momento
Prueba otro momento o guarda una nueva idea.

Selector Cuando
FAB global: +
```

### Acciones

```txt
Seleccionar fecha
Compartir sugerencia
Abrir detalle tocando la tarjeta
Guardar nueva idea
```

## Screen: Guardar Idea

### Objetivo

Capturar una idea con minima friccion.

### Mobile Layout

```txt
┌─────────────────────────────┐
│ Guardar idea                │
│ Tira cualquier plan aqui.   │
├─────────────────────────────┤
│ Que idea quieres guardar?   │
│ ┌─────────────────────────┐ │
│ │ Picnic en el parque     │ │
│ │ cuando haga buen clima  │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Link opcional               │
│ ┌─────────────────────────┐ │
│ │ https://...             │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ [Guardar idea]              │
│ [Cancelar]                  │
└─────────────────────────────┘
```

### Despues de Guardar

Mostrar confirmacion editable.

```txt
┌─────────────────────────────┐
│ Idea guardada               │
│ Puedes completarla ahora o  │
│ dejarla asi.                │
├─────────────────────────────┤
│ Titulo                      │
│ Picnic en el parque         │
│                             │
│ Categoria                   │
│ [Planes v]                  │
│                             │
│ Estado                      │
│ [Pendiente v]               │
│                             │
│ Fecha                       │
│ [Sin fecha v]               │
│                             │
│ Ubicacion                   │
│ [Agregar pin en mapa]       │
│                             │
│ Condiciones ideales         │
│ [Buen clima] [Outdoor]      │
│                             │
│ Notas                       │
│ [Opcional]                  │
├─────────────────────────────┤
│ [Guardar cambios]           │
│ [Listo]                     │
└─────────────────────────────┘
```

### Acciones

```txt
Guardar idea
Cancelar
Editar titulo
Cambiar categoria
Cambiar estado
Agregar fecha
Agregar ubicacion
Agregar condiciones
Guardar cambios
```

## Screen: Ideas

### Objetivo

Revisar y mantener la biblioteca de ideas.

### Mobile Layout

```txt
┌─────────────────────────────┐
│ Ideas                       │
│ Tu backlog de cosas por hacer│
├─────────────────────────────┤
│ Estados                     │
│ [Todas] [Pendientes]        │
│ [Repetibles] [Hechas]       │
│ [Descartadas]               │
├─────────────────────────────┤
│ Categorias                  │
│ [Comida] [Sitios] [Eventos] │
│ [Planes] [Otro]             │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Restaurante coreano     │ │
│ │ Comida · Pendiente      │ │
│ │ Sin fecha               │ │
│ │ [Borrar]                │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Exhibicion foto         │ │
│ │ Eventos · Pendiente     │ │
│ │ Termina el 30 ago       │ │
│ │ [Borrar]                │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Tabs: Que hacemos Ideas Cta │
│ FAB: +                      │
└─────────────────────────────┘
```

### Estado Vacio

```txt
Aun no hay ideas en esta vista.
Guarda algo que quieras hacer despues.

[Guardar idea]
```

### Acciones

```txt
Filtrar por estado
Filtrar por categoria
Abrir detalle tocando la tarjeta
Borrar idea
Guardar nueva idea
```

## Screen: Detalle de Idea

### Objetivo

Ver y editar todos los datos de una idea.

### Mobile Layout

```txt
┌─────────────────────────────┐
│ < Ideas                     │
│ Restaurante coreano         │
│ Comida · Pendiente          │
├─────────────────────────────┤
│ Texto original              │
│ Restaurante coreano que vi  │
│ en TikTok                   │
├─────────────────────────────┤
│ Link                        │
│ https://...                 │
├─────────────────────────────┤
│ Fecha                       │
│ Sin fecha                   │
│ [Editar]                    │
├─────────────────────────────┤
│ Ubicacion                   │
│ [Mapa / pin]                │
│ [Cambiar ubicacion]         │
├─────────────────────────────┤
│ Condiciones ideales         │
│ [Noche] [Fin de semana]     │
├─────────────────────────────┤
│ Notas                       │
│ Opcional                    │
├─────────────────────────────┤
│ Acciones                    │
│ [Compartir]                 │
│ [Marcar hecha]              │
│ [Marcar repetible]          │
│ [Descartar]                 │
└─────────────────────────────┘
```

### Desktop Layout

```txt
┌──────────────┬───────────────────────┬─────────────────┐
│ Sidebar      │ Detalle               │ Acciones         │
│              │ Titulo                │ Compartir        │
│              │ Campos editables      │ Hecha            │
│              │ Mapa                  │ Repetible        │
│              │ Notas                 │ Descartar        │
└──────────────┴───────────────────────┴─────────────────┘
```

### Acciones

```txt
Volver
Editar campos
Guardar cambios
Compartir
Marcar como Hecha
Marcar como Repetible
Descartar
```

## Screen: Compartir

### Objetivo

Permitir enviar una idea o sugerencia a amigos sin construir grupos completos.

### Mobile Layout

```txt
┌─────────────────────────────┐
│ Compartir                   │
├─────────────────────────────┤
│ Preview                     │
│ Hacemos esto?               │
│ Picnic en el parque este    │
│ sabado.                     │
│ La app lo sugirio porque va │
│ a hacer buen clima.         │
├─────────────────────────────┤
│ [Compartir por WhatsApp]    │
│ [Copiar link]               │
│ [Cancelar]                  │
└─────────────────────────────┘
```

### Vista Publica del Link

El receptor no necesita cuenta.

```txt
┌─────────────────────────────┐
│ Idea compartida             │
│ Picnic en el parque         │
│ Planes                      │
│                             │
│ Razon                       │
│ Buen clima este sabado.     │
│                             │
│ [Abrir en app]              │
└─────────────────────────────┘
```

### Acciones

```txt
Compartir por WhatsApp
Copiar link
Abrir vista publica
Cancelar
```

## Screen: Cuenta

### Objetivo

Permitir persistencia sin bloquear el primer uso.

### Modo Invitado Layout

```txt
┌─────────────────────────────┐
│ Cuenta                      │
│ Estas usando modo invitado. │
├─────────────────────────────┤
│ Guarda tus ideas para no    │
│ perderlas si cambias de     │
│ dispositivo o navegador.    │
├─────────────────────────────┤
│ [Continuar con Google]      │
│ [Entrar con email]          │
├─────────────────────────────┤
│ Tus datos locales           │
│ 7 ideas guardadas en este   │
│ navegador.                  │
└─────────────────────────────┘
```

### Email Magic Link Layout

```txt
┌─────────────────────────────┐
│ Entrar con email            │
├─────────────────────────────┤
│ Email                       │
│ [tu@email.com]              │
│ [Enviar link]               │
├─────────────────────────────┤
│ Te enviaremos un link para  │
│ entrar sin password.        │
└─────────────────────────────┘
```

### Usuario Autenticado Layout

```txt
┌─────────────────────────────┐
│ Cuenta                      │
│ Nombre / email              │
├─────────────────────────────┤
│ Ideas guardadas             │
│ 24 ideas                    │
├─────────────────────────────┤
│ Preferencias                │
│ Ciudad/clima: GPS           │
│ Compartir: links publicos   │
├─────────────────────────────┤
│ [Cerrar sesion]             │
└─────────────────────────────┘
```

## Screen: Ubicacion con Pin

### Objetivo

Agregar ubicacion opcional a una idea.

### Mobile Layout

```txt
┌─────────────────────────────┐
│ Agregar ubicacion           │
├─────────────────────────────┤
│ Buscar sitio                │
│ [Nombre o direccion]        │
├─────────────────────────────┤
│ Mapa                        │
│                             │
│        [pin]                │
│                             │
├─────────────────────────────┤
│ Nombre del lugar            │
│ [Opcional]                  │
│ [Guardar ubicacion]         │
└─────────────────────────────┘
```

### Acciones

```txt
Buscar direccion
Mover pin
Usar ubicacion actual
Guardar ubicacion
Quitar ubicacion
```

## Flujo Principal: Crear y Sugerir

```txt
1. Usuario entra a Que hacemos?.
2. Toca +.
3. Escribe: Picnic en el parque cuando haga buen clima.
4. Opcionalmente agrega link.
5. Toca Guardar idea.
6. La app clasifica como Planes y sugiere condicion Buen clima.
7. Usuario toca Listo.
8. Otro dia entra a Que hacemos?.
9. Selecciona Este finde.
10. La app revisa clima y scoring.
11. Sugiere Picnic en el parque con razon.
12. Usuario comparte por WhatsApp.
```

## Flujo: Modo Invitado a Cuenta

```txt
1. Usuario usa la app en modo invitado.
2. Guarda varias ideas localmente.
3. Al compartir o volver a la app, ve prompt de cuenta.
4. Elige Google o email magic link.
5. La app migra ideas locales a la cuenta.
6. Las ideas quedan disponibles en otros dispositivos.
```

## Componentes Reutilizables

```txt
BottomNav
FloatingSaveButton
IdeaCard
SuggestionCard
DateSelector
FilterChips
StatusBadge
CategoryBadge
WeatherSummary
ShareSheet
EmptyState
LocationPicker
LoginPrompt
```

## Jerarquia de Acciones

### Accion Primaria Global

```txt
+
```

### Accion Primaria en Home

```txt
Selector Cuando
```

### Accion Primaria en Card de Sugerencia

```txt
Compartir
```

### Acciones Secundarias en Card

```txt
Ver detalle
```

## Copy Base

### Home

```txt
Que hacemos?
Elige cuando y te sugerimos ideas guardadas que tienen sentido.
```

### Guardar

```txt
Tira cualquier idea aqui.
Puede ser un restaurante, evento, sitio o plan para despues.
```

### Login

```txt
Crea cuenta para no perder tus ideas.
```

### Empty State

```txt
Todavia no tienes ideas.
Guarda cosas que algun dia quieras hacer con amigos.
```

## Decisiones Cerradas

```txt
Mobile usa bottom tabs: Que hacemos, Ideas, Cuenta.
Guardar idea vive como FAB global.
Que hacemos es la pantalla inicial.
Cards de sugerencia deben incluir razon.
Login no bloquea primer uso.
Detalle avanzado ocurre despues de guardar.
```
