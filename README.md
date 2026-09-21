# Portfolio Library

Un hub tipo "Steam Library" que reúne y da acceso a varios portfolios personales temáticos de videojuegos.

## Características

- **Sidebar izquierda ("BIBLIOTECA")** con lista de proyectos, iconos, nombres e indicadores de estado
- **Panel principal estilo Steam Store** con banner, descripción, tecnologías y botón de acceso
- **Barra superior estilo Steam** con logo, navegación y buscador
- **Estética 100% Steam**: fondo azul oscuro, acentos azul claro y verde, tipografía sans-serif
- **Datos tipados** en archivo separado, fácil de ampliar
- **Iconografía SVG inline** sin librerías externas
- **Responsive**: sidebar colapsable en móvil
- **Despliegue**: GitHub Pages vía GitHub Actions

## Stack

- Vite 8
- React 19
- TypeScript
- npm

## Estructura del proyecto

```
src/
├── components/
│   ├── Icons.tsx        # Iconos SVG inline
│   ├── MainPanel.tsx    # Panel principal (página de tienda)
│   ├── Sidebar.tsx      # Sidebar izquierda (Biblioteca)
│   └── TopBar.tsx       # Barra superior estilo Steam
├── data/
│   └── projects.tsx     # Datos de proyectos (tipados)
├── App.tsx              # Componente principal
├── App.css              # Estilos Steam-inspired
└── main.tsx             # Entry point
```

## Estados de proyecto

- `completed` - Completado (verde)
- `in-development` - En desarrollo (azul)
- `paused` - Pausado (amarillo)
- `coming-soon` - Próximamente (gris)

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
  shortDescription: 'Descripción corta',
  status: 'in-development',
  tags: ['Tag1', 'Tag2'],
  technologies: ['Tech1', 'Tech2'],
  url: 'https://tu-url.com',
  bannerColor: '#1a2a3a',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {/* Tu SVG aquí */}
    </svg>
  ),
}
```

## Despliegue

El proyecto está configurado para GitHub Pages en `MarioMunPeq/Portfolio`.

El workflow de GitHub Actions (`.github/workflows/deploy.yml`) hace deploy automático al hacer push a `main`.

URL de producción: `https://mariomunpeq.github.io/Portfolio/`