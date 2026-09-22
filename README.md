# Portfolio Library

Un hub tipo "Steam client" que reúne y da acceso a varios portfolios personales temáticos de videojuegos. Replica la distribución del cliente de escritorio de Steam, no la web.

## Características

- **Shell calcado del cliente de escritorio de Steam** con medidas exactas:
  - Barra de menú superior (26px): Steam ▾ / Ver / Amigos ▾ / Productos ▾ / Ayuda ▾
  - Barra de navegación principal (50px): flechas atrás/adelante, tabs TIENDA / BIBLIOTECA (activo con borde inferior azul) / COMUNIDAD, avatar + usuario, iconos de amigos/notificaciones/pantalla y controles de ventana (46×50 hover `#2a3f52`, cerrar rojo `#e81123`)
  - Sidebar izquierda (340px fija): "Página principal", "Mis Proyectos", buscador con lupa y filtro, lista plana de proyectos (icono 24px + nombre, seleccionado `#3E4F69`), y fila "Herramientas"
  - Área de contenido principal (flexible, `#242830`, scrollable)
  - Barra inferior (40px): "Añadir un producto", estado de descargas y botón "Amigos y chat" que abre el panel de amigos como overlay
- **Componente `<ProjectStorePage />`** montado en el área de contenido (banner + JUGAR + stats + tabs + capturas + actividad) — construido por separado
- **`<FriendsPanel />`** como overlay fijo en la esquina inferior derecha, abierto/cerrado desde el footer
- **Tipografía**: "Motiva Sans" con fallback a Arial — todo texto de interfaz sans-serif
- **Datos tipados** en `src/data/projects.tsx`, fácil de ampliar
- **Iconografía SVG inline** sin librerías externas

## Stack

- Vite 8
- React 19
- TypeScript
- npm

## Estructura del proyecto

```
src/
├── components/
│   ├── ActivityFeed.tsx      # Sección "Actividad"
│   ├── Footer.tsx            # Barra inferior / footer (40px)
│   ├── FriendsPanel.tsx      # Panel de amigos (overlay, WIP)
│   ├── Icons.tsx             # Iconos SVG inline
│   ├── MenuBar.tsx           # Barra de menú superior (26px)
│   ├── NavBar.tsx            # Barra de navegación principal (50px)
│   ├── ProjectHeader.tsx     # Banner grande + título + botón JUGAR
│   ├── ProjectStats.tsx      # Fila de stats (cloud, sesión, tiempo, logros)
│   ├── ProjectStorePage.tsx  # Contenido del área principal (store page)
│   ├── ProjectTabs.tsx       # Pestañas de la store page
│   ├── ScreenshotsRow.tsx    # Capturas scrolleables
│   └── Sidebar.tsx           # Sidebar izquierda (340px, lista plana)
├── data/
│   ├── projects.tsx          # Datos de proyectos (tipados)
│   ├── friends.ts            # Datos de amigos (WIP)
│   └── portfolioStore.ts     # Índice de portfolios (WIP)
├── App.tsx                   # Compone el shell completo
├── App.css                   # Estilos del shell y la store page
├── index.css                 # Tokens, reset y medidas del shell
└── main.tsx                  # Entry point
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Lint
npm run lint

# Deploy a GitHub Pages
npm run deploy
```

## Añadir nuevos proyectos

Edita `src/data/projects.tsx` y añade un nuevo objeto al array `projects`:

```typescript
{
  id: 'nuevo-proyecto',
  name: 'Nombre del Proyecto',
  description: 'Descripción larga...',
  tags: ['Tag1', 'Tag2'],
  url: 'https://tu-url.com',
  bannerColor: '#1a2a3a',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {/* Tu SVG aquí */}
    </svg>
  ),
  stats: {
    cloudStatus: 'ok',
    cloudLabel: 'OK',
    lastSession: 'hace 2 d',
    playtime: '38,2 h',
    achievements: { unlocked: 34, total: 50 },
  },
  screenshots: [
    { id: 'ss1', title: 'Gameplay', gradient: 'linear-gradient(...)' },
    // ...o usa `src` para una imagen real
  ],
  activity: [
    { id: 'a1', kind: 'achievement', text: 'desbloqueó el logro «...»', date: 'hace 2 d' },
    { id: 'a2', kind: 'play', text: 'jugó a Title — 25 min', date: 'hace 2 d' },
  ],
}
```

## Despliegue

El proyecto está configurado para GitHub Pages en `MarioMunPeq/Repository-Library`.

El workflow de GitHub Actions (`.github/workflows/deploy.yml`) hace deploy automático al hacer push a `main`.