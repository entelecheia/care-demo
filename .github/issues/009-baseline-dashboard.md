# Issue #009: Baseline Community Acceptance Dashboard

## Description

Create the main dashboard displaying current community acceptance metrics (CAI and 5 concern categories) with interactive visualizations and community feedback cards.

## Acceptance Criteria

- [ ] Display CAI (Community Acceptance Index) prominently
- [ ] Create radar chart for 5 concern categories
- [ ] Show community feedback cards with categorization
- [ ] Implement interactive tooltips and information panels
- [ ] Add data source attribution and methodology info
- [ ] Create responsive layout for different screen sizes
- [ ] Implement loading states and error handling

## Technical Requirements

- **Visualization**: Chart.js or D3.js for radar charts
- **Data**: Real-time API integration
- **Styling**: Consistent design system
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized rendering and data loading

## Dashboard Components

### CAI Display

- **Large Gauge**: Prominent CAI score (0-100)
- **Trend Indicator**: Historical change if available
- **Interpretation**: Plain language explanation
- **Color Coding**: Red (0-40), Yellow (41-70), Green (71-100)

### Concern Categories Radar Chart

- **5 Axes**: Environment, Economic, Social, Procedural, Safety
- **Interactive**: Hover for details, click for filtering
- **Comparison**: Option to show multiple time periods
- **Labels**: Clear category names and values

### Community Feedback Cards

- **Categorized**: Each card tagged with concern category
- **Visual Design**: Color-coded borders matching categories
- **Content**: Quote, source, date, sentiment
- **Filtering**: Click category to filter cards
- **Pagination**: Handle large numbers of feedback items

## Data Requirements

### Baseline Metrics (Travis County Demo)

```typescript
const baselineData = {
  cai: 60,
  concerns: {
    environment: 40,
    economic: 70,
    social: 55,
    procedural: 65,
    safety: 60,
  },
  lastUpdated: "2024-01-15",
  dataSource: "Community Survey 2024",
};
```

### Sample Feedback Cards

- **Environment**: "Noise pollution concerns from wind turbines"
- **Economic**: "Hope for local job creation and tax revenue"
- **Social**: "Worried about property values in the area"
- **Procedural**: "Need more community input in decision process"
- **Safety**: "Questions about emergency response planning"

## Implementation Details

### Component Structure

```
Dashboard/
├── CAIGauge/
├── RadarChart/
├── FeedbackCards/
├── DataSourceInfo/
└── LoadingStates/
```

### API Integration

- **GET /api/regions/{regionId}/baseline**: Current metrics
- **GET /api/regions/{regionId}/feedback**: Community feedback
- **GET /api/regions/{regionId}/history**: Historical trends

### Interactive Features

- **Hover Effects**: Detailed information on hover
- **Click Actions**: Filter feedback by category
- **Responsive Design**: Mobile-friendly layout
- **Accessibility**: Keyboard navigation and screen reader support

## Visual Design Specifications

### Color Scheme

- **Environment**: Green (#10B981)
- **Economic**: Blue (#3B82F6)
- **Social**: Purple (#8B5CF6)
- **Procedural**: Orange (#F59E0B)
- **Safety**: Red (#EF4444)
- **CAI**: Gradient based on score value

### Layout

- **Header**: Region name and last updated
- **Main**: CAI gauge and radar chart side by side
- **Sidebar**: Feedback cards with filtering
- **Footer**: Data source and methodology links

## Definition of Done

- [ ] CAI gauge displays correct baseline value
- [ ] Radar chart shows 5 concern categories accurately
- [ ] Feedback cards are properly categorized and styled
- [ ] Interactive features work smoothly
- [ ] Responsive design works on mobile and desktop
- [ ] Loading and error states are handled gracefully
- [ ] Accessibility requirements are met

## Priority: High

## Estimated Effort: 12-14 hours

## Labels: frontend, dashboard, visualization
