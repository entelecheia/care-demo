# Issue #001: Project Setup and Initial Configuration

## Description

Set up the foundational project structure for the CARE demo platform with proper TypeScript configuration, development environment, and basic project scaffolding.

## Acceptance Criteria

- [ ] Initialize Next.js project with TypeScript
- [ ] Set up NestJS backend with TypeScript
- [ ] Configure ESLint, Prettier, and TypeScript strict mode
- [ ] Set up Docker development environment
- [ ] Create basic folder structure following modular architecture
- [ ] Configure environment variables template
- [ ] Set up Git hooks for code quality
- [ ] Create initial package.json scripts for development

## Technical Requirements

- **Frontend**: Next.js 14+ with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with Docker Compose
- **Code Quality**: ESLint, Prettier, Husky
- **Development**: Hot reload for both frontend and backend

## Implementation Details

1. Initialize Next.js project with TypeScript template
2. Create separate backend directory with NestJS CLI
3. Set up Docker Compose for PostgreSQL development database
4. Configure shared TypeScript configs and ESLint rules
5. Create modular folder structure:
   ```
   /frontend
   /backend
   /shared (types, utils)
   /docs
   ```

## Definition of Done

- [ ] Both frontend and backend start successfully
- [ ] TypeScript compilation passes without errors
- [ ] ESLint and Prettier run without issues
- [ ] Docker containers start and connect properly
- [ ] Development scripts work as expected

## Priority: High

## Estimated Effort: 4-6 hours

## Labels: setup, infrastructure, foundation
