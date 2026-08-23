# Component Design

## Purpose
Design reusable UI components with clear responsibilities, stable contracts, accessible semantics, predictable state ownership, and low coupling to application-specific behavior.

## When to use
Use when creating components, decomposing complex screens, building a design system, or reviewing component APIs.

## Inputs
UI requirements, interaction states, design specifications, existing components, accessibility requirements, and consumer use cases.

## Context to inspect
Component hierarchy, duplicated patterns, props/inputs, emitted events, styling conventions, state ownership, tests, and design tokens.

## Core knowledge
Good components expose intent rather than implementation detail. Composition usually scales better than large configuration surfaces. Local state belongs near its owner; reusable primitives should avoid business-specific dependencies.

## Procedure
1. Identify the component's single coherent responsibility.
2. Enumerate visual, interaction, loading, empty, error, and disabled states.
3. Decide what state is owned internally versus supplied by consumers.
4. Define a minimal public contract.
5. Use semantic HTML before custom interaction primitives.
6. Prefer composition for extensibility.
7. Separate business orchestration from reusable presentation where it improves reuse.
8. Apply design tokens and responsive behavior.
9. Test contract behavior and accessibility.
10. Validate the component in multiple realistic consumers before generalizing it.

## Decision points
Extract a shared component when semantics and behavior are genuinely repeated. Keep a feature-specific component local when reuse is speculative. Choose controlled state when external coordination is required; otherwise local ownership may be simpler.

## Common failure patterns
God components, boolean-prop explosions, premature generic components, hidden side effects, duplicated state, inaccessible custom controls, and leaking internal DOM assumptions to consumers.

## Verification
Representative consumers render correctly, state transitions are deterministic, keyboard and screen-reader behavior is valid, and contract tests protect intended usage.

## Expected output
A focused component with documented inputs, outputs, states, accessibility behavior, and tests.

## Stop conditions
Stop when interaction requirements conflict, design semantics are unresolved, or a proposed shared API cannot support known consumers without special cases.