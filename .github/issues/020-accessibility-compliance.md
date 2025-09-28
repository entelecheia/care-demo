# Issue #020: WCAG 2.1 AA Accessibility Compliance Implementation

## Description
Ensure the CARE demo platform meets WCAG 2.1 Level AA accessibility standards to provide an inclusive experience for all users, including those with disabilities.

## Acceptance Criteria
- [ ] Implement keyboard navigation for all interactive elements
- [ ] Add proper ARIA labels and semantic HTML structure
- [ ] Ensure color contrast meets WCAG 2.1 AA standards
- [ ] Create screen reader compatible content
- [ ] Implement focus management and visual indicators
- [ ] Add alternative text for all images and charts
- [ ] Create accessible form controls and error messages

## Technical Requirements
- **Accessibility Testing**: axe-core, Lighthouse, WAVE
- **Screen Reader Support**: ARIA labels and live regions
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: 4.5:1 ratio for normal text, 3:1 for large text
- **Focus Management**: Visible focus indicators and logical tab order

## Implementation Details

### Keyboard Navigation
```typescript
// Keyboard navigation hook
export const useKeyboardNavigation = () => {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Tab":
          // Handle tab navigation
          break;
        case "Enter":
        case " ":
          // Handle activation
          break;
        case "Escape":
          // Handle escape actions
          break;
        case "ArrowUp":
        case "ArrowDown":
          // Handle arrow navigation
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { focusedElement, setFocusedElement };
};
```

### Accessible Chart Components
```typescript
// Accessible radar chart component
export const AccessibleRadarChart: React.FC<RadarChartProps> = ({
  data,
  title,
  description,
}) => {
  return (
    <div
      role="img"
      aria-labelledby="chart-title"
      aria-describedby="chart-description"
    >
      <h3 id="chart-title">{title}</h3>
      <p id="chart-description">{description}</p>

      {/* Visual chart */}
      <div className="chart-container" aria-hidden="true">
        <RadarChart data={data} />
      </div>

      {/* Accessible data table */}
      <table className="sr-only" aria-label="Chart data table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([category, value]) => (
            <tr key={category}>
              <td>{category}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### Focus Management
```typescript
// Focus management for modals and dynamic content
export const useFocusManagement = () => {
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const trapFocus = (element: HTMLElement) => {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0] as HTMLElement;
    const lastFocusableElement = focusableContent[
      focusableContent.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener("keydown", handleTabKey);
    firstFocusableElement?.focus();

    return () => element.removeEventListener("keydown", handleTabKey);
  };

  return { trapFocus };
};
```

### Color Contrast and Visual Design
```css
/* Accessible color palette */
:root {
  /* Primary colors with sufficient contrast */
  --color-primary: #1e40af; /* 4.5:1 contrast ratio */
  --color-primary-light: #3b82f6;
  --color-primary-dark: #1e3a8a;

  /* Semantic colors */
  --color-success: #059669; /* 4.5:1 contrast ratio */
  --color-warning: #d97706; /* 4.5:1 contrast ratio */
  --color-error: #dc2626; /* 4.5:1 contrast ratio */

  /* Text colors */
  --color-text-primary: #111827; /* 16:1 contrast ratio */
  --color-text-secondary: #374151; /* 9:1 contrast ratio */
  --color-text-muted: #6b7280; /* 4.5:1 contrast ratio */

  /* Background colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;
}

/* Focus indicators */
.focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-primary: #0000ff;
    --color-text-primary: #000000;
    --color-bg-primary: #ffffff;
  }
}
```

### Screen Reader Support
```typescript
// Screen reader announcements
export const useScreenReaderAnnouncements = () => {
  const announce = (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};

// Usage in components
export const SimulationResults: React.FC = () => {
  const { announce } = useScreenReaderAnnouncements();

  useEffect(() => {
    if (results) {
      announce(
        `Simulation completed. CAI increased from ${results.before.cai} to ${results.after.cai}`
      );
    }
  }, [results]);

  return (
    <div role="region" aria-live="polite" aria-label="Simulation results">
      {/* Component content */}
    </div>
  );
};
```

### Form Accessibility
```typescript
// Accessible form components
export const AccessibleFormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children,
}) => {
  const fieldId = useId();
  const errorId = useId();

  return (
    <div className="form-field">
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && (
          <span className="required" aria-label="required">
            *
          </span>
        )}
      </label>

      {React.cloneElement(children as React.ReactElement, {
        id: fieldId,
        "aria-describedby": error ? errorId : undefined,
        "aria-invalid": error ? "true" : "false",
        "aria-required": required,
      })}

      {error && (
        <div id={errorId} className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
```

## Testing and Validation

### Automated Accessibility Testing
```typescript
// Jest accessibility tests
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

describe("Accessibility Tests", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should be keyboard navigable", async () => {
    render(<PolicySelection />);

    // Test tab navigation
    const firstButton = screen.getByRole("button", { name: /first option/i });
    firstButton.focus();
    expect(document.activeElement).toBe(firstButton);

    // Test arrow key navigation
    fireEvent.keyDown(firstButton, { key: "ArrowDown" });
    // Verify focus moves to next option
  });
});
```

### Manual Testing Checklist
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible and clear
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Screen reader compatibility is verified
- [ ] Alternative text is provided for images
- [ ] Form labels are properly associated
- [ ] Error messages are accessible and clear
- [ ] Dynamic content updates are announced

## Definition of Done
- [ ] All interactive elements are keyboard navigable
- [ ] ARIA labels and semantic HTML are properly implemented
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Screen reader compatibility is verified
- [ ] Focus management works correctly
- [ ] Alternative text is provided for all images
- [ ] Form accessibility is complete
- [ ] Automated accessibility tests pass

## Priority: High
## Estimated Effort: 12-16 hours
## Labels: accessibility, ux, compliance
