# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - Start Vite dev server on port 3000 (proxies /api to localhost:8000)
- `npm run build` - Type check (tsc) and build for production to dist/
- `npm test` - Run all Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm test -- path/to/test.test.tsx` - Run a single test file

## Tech Stack

- **Framework**: React 18 + TypeScript (strict mode)
- **Build**: Vite 6
- **Routing**: React Router 6
- **Server State**: TanStack Query v5
- **Global State**: Zustand v5
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Graphs**: Cytoscape with cytoscape-cola layout

## Architecture

### API Layer (`src/api/`)
- `client.ts` - Centralized Axios instance with baseURL `/api/v1`, 30s timeout, auth token injection, and 401 handling
- Domain APIs: `approvals.ts`, `documents.ts`, `events.ts`, `claims.ts`, `audit.ts`
- Vite proxy forwards `/api` requests to `http://localhost:8000`

### State Management
- **Zustand stores** (`src/store/`) - Global client state (events, documents, approvals)
- **TanStack Query** - Server state, caching, refetching with query keys
- **React hooks** (`src/hooks/`) - Composable data-fetching hooks wrapping Zustand/TanStack

### Pages (`src/pages/`)
- Route `/approvals` → `ApprovalQueue`
- Route `/audit` → `AuditTrail`
- Route `/dashboard` → `MultiEventDashboard`
- Route `/status` → `RealtimeStatus`
- Route `/graph` → `DependencyGraph`
- Route `/compare` → `DocumentComparison`

### Import Alias
Use `@/` for src-relative imports (e.g., `import { apiClient } from '@/api/client'`)

## Code Conventions

- **Types**: Strict TypeScript, no `any` except in catch blocks. Define interfaces/enums in API files.
- **Components**: Functional components with TypeScript interfaces for props. Export default.
- **API responses**: snake_case from backend, transform as needed in API layer.
- **Naming**: PascalCase (components/types), camelCase (vars/functions), UPPER_SNAKE_CASE (constants).
- **Styling**: Tailwind utility classes only, inline in className attributes.
- **Error handling**: Try/catch in async functions, error state in stores, 401 interceptor redirects to /login.
