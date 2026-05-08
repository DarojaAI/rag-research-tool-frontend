# Agent Guidelines for ForteEvent Frontend

## Build/Lint/Test Commands
- `npm run dev` - Start dev server on port 3000
- `npm run build` - Type check and build for production
- `npm test` - Run all Jest tests
- `npm run test:watch` - Run tests in watch mode
- To run a single test: `npm test -- path/to/test.test.tsx`

## Code Style & Conventions
- **TypeScript**: Strict mode enabled. Use explicit types for props, state, and API responses. No `any` except in catch blocks.
- **Imports**: Use `@/` alias for src imports (e.g., `import { apiClient } from '@/api/client'`). Group imports: React, third-party, local.
- **Components**: Functional components with TypeScript interfaces for props. Export default for components.
- **State Management**: Zustand for global state (store/), React hooks for local state. Use TanStack Query for server state.
- **API Layer**: All API calls through `apiClient` (src/api/client.ts). Define types/enums in API files. Use snake_case for API data, handle transformation if needed.
- **Naming**: PascalCase for components/types, camelCase for variables/functions, UPPER_SNAKE_CASE for constants. Descriptive names (e.g., `fetchApprovals` not `fetch`).
- **Error Handling**: Try/catch in async functions. Set error state in stores. API interceptor handles 401s globally.
- **Styling**: Tailwind CSS utility classes. Keep styles inline in className. Use semantic color names (e.g., `bg-green-600` for approve actions).
- **File Structure**: Components in components/, Pages in pages/, API logic in api/, Custom hooks in hooks/, State in store/.
- **Testing**: Tests in src/__tests__/ with .test.tsx extension. Use @testing-library/react and jest-dom matchers.
