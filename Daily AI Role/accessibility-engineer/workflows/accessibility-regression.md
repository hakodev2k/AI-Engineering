# Workflow: Accessibility Regression

**Trigger:** shared-component change, design-system upgrade, major frontend refactor, or recurring defect class.
**Goal:** detect previously fixed barriers before release.

1. Select regression set from historical critical defects and component risk.
2. Run deterministic automated checks first.
3. Run manual keyboard/focus and semantic checks on affected journeys.
4. Add AT checks where prior defect depended on announcement/navigation behavior.
5. Compare against baseline evidence.
6. Route regressions to owners and block release when critical-path operation is broken.
7. Update regression inventory only after verified fix.

**Quality gate:** the regression set must include critical workflows, not only isolated components.
**Stop:** pass with evidence or explicit human-approved residual risk. No infinite reruns; max two fix/retest cycles before escalation.