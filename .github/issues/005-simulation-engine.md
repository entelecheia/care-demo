# Issue #005: Simulation Engine and CAI Calculation Logic

## Description
Implement the core simulation engine that calculates Community Acceptance Index (CAI) and 5 concern category scores based on policy interventions.

## Acceptance Criteria
- [ ] Implement CAI calculation algorithm
- [ ] Create concern score calculation for 5 categories
- [ ] Build policy impact simulation logic
- [ ] Add async processing for long-running simulations
- [ ] Implement result caching and storage
- [ ] Create simulation validation and error handling

## Technical Requirements
- **Algorithm**: CARE framework-based calculations
- **Processing**: Async with BullMQ or similar
- **Storage**: PostgreSQL for results
- **Caching**: Redis for performance (optional)

## CAI Calculation Logic
The Community Acceptance Index should be calculated as:
- **Input**: 5 concern category scores (0-100 each)
- **Formula**: Weighted average or simple average of concern scores
- **Output**: Single CAI value (0-100)
- **Categories**: Environment, Economic, Social, Procedural, Safety

## Concern Score Categories
1. **Environment**: Noise, visual impact, wildlife effects
2. **Economic**: Local economic benefits, compensation
3. **Social**: Equity, community cohesion
4. **Procedural**: Transparency, participation
5. **Safety**: Health risks, emergency preparedness

## Policy Impact Rules
Implement rule-based system for policy interventions:
- **Noise Reduction**: +15 to Environment score
- **Economic Benefits**: +20 to Economic, +5 to Social
- **Community Engagement**: +10 to Procedural
- **Safety Measures**: +10 to Safety
- **Compensation**: +15 to Economic, +10 to Social

## Implementation Details
1. Create SimulationService with calculation methods
2. Implement async job processing for simulations
3. Add result validation and error handling
4. Create simulation result storage logic
5. Add performance monitoring and logging
6. Implement simulation history tracking

## Sample Calculations
```typescript
// Baseline Travis County scores
const baseline = {
  environment: 40,
  economic: 70,
  social: 55,
  procedural: 65,
  safety: 60
};

// CAI = average of all scores
const cai = (40 + 70 + 55 + 65 + 60) / 5 = 58;

// After noise reduction policy
const afterNoiseReduction = {
  environment: 55, // +15
  economic: 70,
  social: 55,
  procedural: 65,
  safety: 60
};
```

## Definition of Done
- [ ] CAI calculation produces correct results
- [ ] Policy interventions affect scores appropriately
- [ ] Async processing works without blocking
- [ ] Results are stored and retrievable
- [ ] Error handling covers edge cases
- [ ] Performance is acceptable (<2s for calculations)

## Priority: High
## Estimated Effort: 8-10 hours
## Labels: simulation, algorithm, backend
