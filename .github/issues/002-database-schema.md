# Issue #002: Database Schema Design and Implementation

## Description
Design and implement the PostgreSQL database schema for the CARE demo platform, including all core entities and their relationships.

## Acceptance Criteria
- [ ] Create database migration files for all core tables
- [ ] Implement TypeORM entities with proper relationships
- [ ] Set up database connection and configuration
- [ ] Create seed data for demo scenarios
- [ ] Implement database indexes for performance
- [ ] Add PostGIS extension for geographic data

## Technical Requirements
- **Database**: PostgreSQL 15+ with PostGIS extension
- **ORM**: TypeORM with decorators
- **Migrations**: TypeORM migration system
- **Seeding**: Demo data for Travis County, Texas scenario

## Core Tables to Implement
1. **users** - User accounts and profiles
2. **roles** - User role definitions
3. **policies** - Policy definitions and metadata
4. **policy_parameters** - Configurable policy parameters
5. **simulation_runs** - Simulation execution history
6. **simulation_inputs** - User input values for simulations
7. **simulation_results** - Calculated results (CAI, concerns)
8. **discussions** - Community discussion threads
9. **posts** - Individual posts/comments
10. **votes** - User voting records
11. **evaluations** - User evaluations of results

## Implementation Details
1. Create TypeORM entities with proper decorators
2. Define relationships (OneToMany, ManyToOne, etc.)
3. Set up migration files for schema creation
4. Create seed data for demo scenario:
   - Travis County baseline data (CAI=60, concern scores)
   - Sample community feedback posts
   - Policy templates for wind farm scenario
5. Add geographic data tables for US states/counties
6. Implement proper indexing strategy

## Sample Data Requirements
- Travis County, Texas baseline metrics
- 5-10 sample community feedback posts per concern category
- Wind farm policy template with parameters
- User roles (Policy Maker, Citizen, Expert)

## Definition of Done
- [ ] All tables created successfully via migrations
- [ ] TypeORM entities compile without errors
- [ ] Seed data loads correctly
- [ ] Database queries execute efficiently
- [ ] Geographic queries work with PostGIS

## Priority: High
## Estimated Effort: 6-8 hours
## Labels: database, schema, backend
