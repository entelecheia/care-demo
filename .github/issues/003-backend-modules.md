# Issue #003: Backend Module Architecture Implementation

## Description

Implement the core NestJS modules following the decoupled monolith architecture: Auth, Policy, Simulation, and Community modules with proper service layers and DTOs.

## Acceptance Criteria

- [ ] Create Auth module with JWT authentication
- [ ] Implement Policy module for policy management
- [ ] Build Simulation module with CAI calculation engine
- [ ] Develop Community module for feedback management
- [ ] Create shared DTOs for inter-module communication
- [ ] Implement proper error handling and validation
- [ ] Add API documentation with Swagger

## Technical Requirements

- **Framework**: NestJS with TypeScript
- **Authentication**: JWT with Passport
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **Error Handling**: Global exception filters

## Module Specifications

### Auth Module

- User registration and login endpoints
- JWT token generation and validation
- Role-based access control (RBAC)
- Password hashing with bcrypt

### Policy Module

- CRUD operations for policies
- Policy parameter management
- Policy template system
- Region-based policy filtering

### Simulation Module

- CAI calculation engine
- Concern score computation
- Policy impact simulation
- Async simulation processing with job queues

### Community Module

- Discussion thread management
- Post creation and retrieval
- Voting system implementation
- Feedback categorization

## Implementation Details

1. Create module structure with controllers, services, and DTOs
2. Implement dependency injection properly
3. Add input validation using DTOs
4. Create shared interfaces and types
5. Implement proper error handling
6. Add Swagger documentation
7. Create unit tests for core business logic

## API Endpoints to Implement

```
POST /auth/register
POST /auth/login
GET /auth/me

GET /policies
POST /policies
GET /policies/:id

POST /simulations
GET /simulations/:id

GET /discussions
POST /discussions
GET /posts
POST /posts
```

## Definition of Done

- [ ] All modules compile without errors
- [ ] API endpoints respond correctly
- [ ] Authentication flow works end-to-end
- [ ] DTOs validate input properly
- [ ] Swagger documentation is complete
- [ ] Unit tests pass for core logic

## Priority: High

## Estimated Effort: 12-16 hours

## Labels: backend, modules, api
