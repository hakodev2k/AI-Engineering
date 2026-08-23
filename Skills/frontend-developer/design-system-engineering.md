# Design System Engineering

## Purpose
Build and evolve reusable UI foundations—tokens, primitives, components, documentation, and governance—without turning the design system into a bottleneck.

## When to use
Use when multiple products/features repeat UI patterns, consistency is deteriorating, or a shared component library requires governance.

## Inputs
Design language, existing components, product usage, accessibility requirements, theming needs, package/build model, and consumer feedback.

## Context to inspect
Tokens, primitives, component APIs, versioning, documentation, visual tests, accessibility tests, dependency graph, and adoption patterns.

## Core knowledge
A design system is a product with consumers and compatibility obligations. Tokens express decisions; primitives encode semantics; components should solve recurring patterns. Governance should enable product teams rather than centralize every UI decision.

## Procedure
1. Inventory repeated patterns and inconsistent decisions.
2. Define foundational tokens with semantic naming.
3. Build accessible primitives before complex composites.
4. Validate component APIs against multiple real use cases.
5. Define theming and customization boundaries.
6. Document behavior, states, accessibility, and examples.
7. Add visual, interaction, and accessibility regression checks.
8. Establish versioning/deprecation policy.
9. Measure adoption and collect consumer friction.
10. Remove or consolidate components that no longer provide independent value.

## Decision points
Promote a feature component only after repeatable semantics emerge. Allow controlled escape hatches when product needs differ; avoid APIs so flexible that consistency disappears.

## Common failure patterns
Building a library before demand, copying designs without semantics, excessive variants, breaking consumers casually, inaccessible primitives, and measuring success by component count.

## Verification
Multiple consumers can implement intended designs without private hacks, accessibility checks pass, upgrades are predictable, and documentation matches runtime behavior.

## Expected output
A governed reusable UI system with stable tokens/components, verification, documentation, and evolution policy.

## Stop conditions
Stop when design ownership is unresolved, proposed abstractions have only one speculative consumer, or breaking changes lack migration/approval plans.