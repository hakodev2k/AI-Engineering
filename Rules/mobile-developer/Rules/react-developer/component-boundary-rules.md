# Component Boundary Rules

## Purpose
Define Senior-level rules for stable React component ownership and composition.

## Scope
Applies to application components, shared UI components, feature modules, and design-system integration.

## MUST
- Components MUST have a clear responsibility and ownership boundary.
- Shared components MUST expose intentional, stable props rather than leaking feature-specific state.
- Cross-feature dependencies MUST be explicit and reviewed.
- State ownership MUST live at the lowest level that satisfies all consumers without creating duplication.
- Boundary changes that affect many consumers MUST include migration and compatibility analysis.

## MUST NOT
- MUST NOT create god components that combine unrelated orchestration, data access, and presentation responsibilities.
- MUST NOT couple shared components to page-specific assumptions.
- MUST NOT bypass established module boundaries through deep imports without justification.

## SHOULD
- Prefer composition over prop explosion or inheritance-like abstractions.
- Prefer feature-local components until reuse is demonstrated.

## Exceptions
Document the context, alternative considered, blast radius, and review approval for intentional boundary violations.

## Verification
Use code review, dependency inspection, component tests, and repository search for deep imports or circular ownership.