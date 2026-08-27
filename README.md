# Globe Connect

Interactive 3D WebGL globe for live data exploration. Built with React, Three.js, and TypeScript. Projects real-time data onto a navigable sphere — making datasets feel like places you can explore.

## Features

- **WebGL Globe Rendering** — Smooth 60 FPS globe using Three.js with custom shaders
- **Live Data Projection** — REST API integration for real-time data overlay
- **Interactive Exploration** — Orbit, zoom, and click to inspect data points
- **Responsive Design** — Works across desktop and mobile viewports
- **TypeScript** — Full type safety across the codebase

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript |
| 3D Rendering | Three.js (r158+) |
| Build | Vite 5 |
| Styling | CSS Modules / Tailwind |
| Data | REST APIs, GeoJSON |

## Quick Start

```bash
git clone https://github.com/DeKairos/Globe.git
cd Globe
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Project Structure

```
globe/
├── src/
│   ├── components/
│   │   ├── Globe.tsx          # Three.js globe component
│   │   ├── DataLayer.tsx      # Data visualization layer
│   │   └── Controls.tsx       # UI controls
│   ├── hooks/
│   │   └── useGlobe.ts        # Globe lifecycle hook
│   ├── services/
│   │   └── api.ts             # Data fetching
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── textures/              # Globe textures
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Data Format

Expects GeoJSON FeatureCollection:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "properties": {
        "value": 42,
        "label": "Sample Point"
      }
    }
  ]
}
```

## Customization

| Config | Location |
|--------|----------|
| Globe radius | `src/components/Globe.tsx:12` |
| Color scale | `src/components/DataLayer.tsx:24` |
| API endpoint | `src/services/api.ts:8` |
| Camera limits | `src/hooks/useGlobe.ts:15` |

## Deployment

```bash
npm run build
# Deploy dist/ to Vercel, Netlify, or GitHub Pages
```

## License

MIT License