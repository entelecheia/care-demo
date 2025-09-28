# Issue #017: Monorepo Structure and Package Management

## Description
Set up a proper monorepo structure using Nx, Turborepo, or Lerna to manage the frontend, backend, and shared packages in a single repository with proper build orchestration and dependency management.

## Acceptance Criteria
- [ ] Set up monorepo tool (Nx, Turborepo, or Lerna)
- [ ] Configure shared packages for types and utilities
- [ ] Set up build orchestration and task running
- [ ] Implement proper dependency management
- [ ] Configure code sharing between frontend and backend
- [ ] Set up workspace-level scripts and commands
- [ ] Implement proper package versioning and publishing

## Technical Requirements
- **Monorepo Tool**: Nx (recommended for NestJS/Next.js)
- **Package Manager**: npm workspaces or Yarn workspaces
- **Build System**: Integrated build orchestration
- **Code Sharing**: Shared TypeScript packages
- **Dependency Management**: Workspace-level dependency resolution
- **CI/CD Integration**: Monorepo-aware build pipelines

## Monorepo Structure
```
care-demo/
├── apps/
│   ├── frontend/                 # Next.js React application
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.js
│   └── backend/                  # NestJS API server
│       ├── src/
│       ├── package.json
│       └── nest-cli.json
├── libs/
│   ├── shared-types/             # Shared TypeScript interfaces
│   │   ├── src/
│   │   └── package.json
│   ├── shared-utils/             # Common utility functions
│   │   ├── src/
│   │   └── package.json
│   └── ui-components/            # Shared React components
│       ├── src/
│       └── package.json
├── tools/
│   └── scripts/                  # Build and deployment scripts
├── package.json                  # Root package.json
├── nx.json                       # Nx configuration
└── tsconfig.base.json            # Base TypeScript configuration
```

## Implementation Details

### Nx Configuration
```json
// nx.json
{
  "extends": "@nrwl/workspace/presets/npm.json",
  "npmScope": "care-demo",
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nrwl/workspace/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint"]
      }
    }
  },
  "projects": {
    "frontend": "apps/frontend",
    "backend": "apps/backend",
    "shared-types": "libs/shared-types",
    "shared-utils": "libs/shared-utils",
    "ui-components": "libs/ui-components"
  }
}
```

### Root Package.json
```json
{
  "name": "care-demo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "libs/*"
  ],
  "scripts": {
    "dev": "nx run-many --target=dev --all --parallel",
    "build": "nx run-many --target=build --all",
    "test": "nx run-many --target=test --all",
    "lint": "nx run-many --target=lint --all",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "nx run-many --target=type-check --all"
  },
  "devDependencies": {
    "@nrwl/workspace": "^15.0.0",
    "@nrwl/next": "^15.0.0",
    "@nrwl/nest": "^15.0.0",
    "typescript": "^4.9.0",
    "prettier": "^2.8.0",
    "eslint": "^8.0.0"
  }
}
```

### Shared Types Package
```typescript
// libs/shared-types/src/index.ts
export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
}

export interface SimulationResult {
  cai: number;
  concerns: ConcernScores;
  timestamp: Date;
}

export interface ConcernScores {
  environment: number;
  economic: number;
  social: number;
  procedural: number;
  safety: number;
}

export type UserRole = "policy-maker" | "citizen" | "expert" | "admin";
```

### Shared Utils Package
```typescript
// libs/shared-utils/src/index.ts
export const calculateCAI = (concerns: ConcernScores): number => {
  const values = Object.values(concerns);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

## Build Orchestration

### Task Dependencies
```json
// nx.json task dependencies
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"]
    },
    "lint": {
      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"]
    }
  }
}
```

### Build Commands
```bash
# Build all projects
nx run-many --target=build --all

# Build specific project
nx build frontend
nx build backend

# Build with dependencies
nx build frontend --with-deps

# Run tests for all projects
nx run-many --target=test --all

# Run linting for all projects
nx run-many --target=lint --all
```

## Code Sharing Strategy

### Frontend-Backend Type Sharing
```typescript
// Frontend usage
import { User, SimulationResult } from "@care-demo/shared-types";

// Backend usage
import { User, SimulationResult } from "@care-demo/shared-types";
```

### Shared Component Library
```typescript
// libs/ui-components/src/index.ts
export { Button } from "./button/button";
export { Input } from "./input/input";
export { Modal } from "./modal/modal";
export { LoadingSpinner } from "./loading-spinner/loading-spinner";
```

## Dependency Management

### Workspace Dependencies
```json
// Root package.json
{
  "devDependencies": {
    "typescript": "^4.9.0",
    "eslint": "^8.0.0",
    "prettier": "^2.8.0",
    "@types/node": "^18.0.0"
  }
}
```

### Package-Specific Dependencies
```json
// apps/frontend/package.json
{
  "dependencies": {
    "@care-demo/shared-types": "*",
    "@care-demo/shared-utils": "*",
    "@care-demo/ui-components": "*",
    "next": "^13.0.0",
    "react": "^18.0.0"
  }
}
```

## CI/CD Integration

### GitHub Actions for Monorepo
```yaml
name: Monorepo CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Build affected projects
        run: npx nx affected --target=build --base=origin/main
      - name: Test affected projects
        run: npx nx affected --target=test --base=origin/main
      - name: Lint affected projects
        run: npx nx affected --target=lint --base=origin/main
```

## Development Workflow

### Local Development
```bash
# Install all dependencies
npm install

# Start all applications in development mode
npm run dev

# Start specific application
nx serve frontend
nx serve backend

# Run tests for specific project
nx test frontend
nx test backend

# Build specific project
nx build frontend
nx build backend
```

### Code Generation
```bash
# Generate new library
nx g @nrwl/workspace:lib shared-constants

# Generate new application
nx g @nrwl/next:app new-app

# Generate new component
nx g @nrwl/react:component button --project=ui-components
```

## Definition of Done
- [ ] Monorepo structure is set up and working
- [ ] Shared packages are properly configured
- [ ] Build orchestration works correctly
- [ ] Code sharing between frontend and backend works
- [ ] Workspace-level scripts and commands are functional
- [ ] CI/CD pipeline is updated for monorepo
- [ ] Documentation is updated with new structure

## Priority: High
## Estimated Effort: 6-8 hours
## Labels: monorepo, build-system, infrastructure
