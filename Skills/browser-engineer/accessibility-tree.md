# Accessibility Tree Integration

## Purpose
Ensure browser engine changes expose correct semantics, state, relationships, and events to assistive technologies.

## When to use
Use for DOM/rendering changes, new controls, accessibility regressions, focus issues, or platform accessibility integration.

## Inputs
DOM/ARIA scenario, accessibility tree dump, platform API output, expected semantics, reproduction steps.

## Context to inspect
Semantic tree generation, roles, names, states, relationships, focus, hidden content, platform adapters, event emission.

## Core knowledge
Accessibility trees are derived semantic representations, not DOM copies. Computed name, role, state, visibility, and relationships must remain coherent through dynamic updates.

## Procedure
1. Define expected semantic representation.
2. Inspect generated accessibility tree.
3. Trace mapping from DOM/render objects to accessibility nodes.
4. Check name/description computation and relationships.
5. Verify dynamic invalidation and event ordering.
6. Test keyboard focus and hidden/disabled states.
7. Compare platform API output.
8. Add tree and integration regression tests.

## Decision points
Expose semantic nodes, not visual implementation details. Suppress redundant nodes only when assistive behavior remains correct.

## Common failure patterns
Stale accessibility nodes; incorrect hidden-state propagation; duplicate announcements; focus events before tree update; platform adapter divergence.

## Verification
Tree tests, platform accessibility tests, keyboard workflows, and representative assistive-technology checks pass.

## Expected output
Correct, stable semantic exposure with regression coverage.

## Stop conditions
Escalate when expected semantics are ambiguous under ARIA/platform standards or require accessibility design review.