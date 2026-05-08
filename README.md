# FortEvent - Document Coordination Frontend

A React-based frontend for managing multi-stage document approvals and event coordination. FortEvent provides a complete workflow for reviewing, approving, and tracking documents across a 6-stage approval process (Functional, Compliance, Sponsor, Operational, Coordination, Executive).

## Features

- **Approval Queue** - Multi-stage approval workflow with filtering by stage and reviewer
- **Document Comparison** - Side-by-side diff viewer for comparing document versions
- **Dependency Graph** - Visual network graph showing document relationships using Cytoscape
- **Audit Trail** - Chronological timeline of all document changes with export options
- **Real-time Status** - Live dashboard with progress metrics and WebSocket feed
- **Multi-Event Dashboard** - Overview of all events with conflict analysis

## Tech Stack

- React 18 + TypeScript (strict mode)
- Vite 6 for fast development and building
- React Router 6 for navigation
- TanStack Query v5 for server state management
- Zustand v5 for global client state
- Tailwind CSS for styling
- Cytoscape for dependency visualization
- Recharts for data visualization

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8000` (API base: `/api/v1`)

## Development

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Deployment

### Development/Local

```bash
npm run dev
```

The frontend runs on port 3000 with Vite proxy forwarding `/api` requests to the backend at `http://localhost:8000`.

### Production

```bash
npm run build
```

This generates static files in the `dist/` directory. Serve these with any static file server (nginx, Apache, Netlify, Vercel, etc.):

```bash
# Preview production build locally
npm run preview
```

### Docker

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Cloudflare Pages

```bash
# Build with your backend URL
VITE_API_BASE_URL=https://your-backend.workers.dev npm run build

# In Cloudflare Pages settings:
# - Build command: npm run build
# - Build output directory: dist
# - Add environment variable: VITE_API_BASE_URL = https://your-backend.workers.dev
```

For client-side routing (SPA mode), Cloudflare Pages handles this automatically.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `/api/v1` (relative path) |

Set `VITE_API_BASE_URL` for production deployments where the API is hosted separately.

## Architecture

- **API Layer** (`src/api/`) - Axios client with centralized error handling and auth interceptors
- **Pages** (`src/pages/`) - Route-based components for each major feature
- **Components** (`src/components/`) - Reusable UI components
- **Hooks** (`src/hooks/`) - Data-fetching hooks wrapping Zustand/TanStack Query
- **Store** (`src/store/`) - Zustand stores for global state

## API Proxy

During development, Vite proxies all `/api` requests to `http://localhost:8000`. The backend should expose:
- `GET /api/v1/approvals`
- `GET /api/v1/documents`
- `GET /api/v1/events`
- `GET /api/v1/audit`
- And other endpoints as defined in the API files
