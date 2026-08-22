# Design System Rules

## Purpose
Keep reusable UI primitives consistent, accessible, versionable, and resistant to feature-specific leakage.

## Scope
Component libraries, tokens, themes, shared primitives, variants, and design-system governance.

## MUST
- Shared primitives MUST have documented contracts for variants, states, accessibility behavior, and theming where applicable.
- Design tokens MUST be the source of truth for governed visual decisions rather than duplicated magic values across features.
- Breaking shared-component changes MUST identify affected consumers and use an explicit migration strategy.
- Accessibility behavior MUST be preserved as part of component contracts.
- Feature-specific business behavior MUST remain outside generic design-system primitives.

## MUST NOT
- Consumers MUST NOT reach into private DOM structure or undocumented classes of shared components as a normal extension mechanism.
- Visual consistency MUST NOT be achieved by disabling semantic or accessibility behavior.
- A shared component MUST NOT accumulate unrelated variants solely to avoid creating a feature-specific composition.

## SHOULD
- Prefer composable primitives and slots over large configuration-driven components.
- Maintain examples or visual regression coverage for meaningful states.

## Exceptions
A temporary consumer override may be accepted with documented reason and migration ownership when an urgent product need precedes a proper system change.

## Verification
Review public APIs, token usage, consumer coupling, accessibility tests, and visual regression evidence.