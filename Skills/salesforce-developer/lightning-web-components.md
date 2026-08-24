# Lightning Web Components

## Purpose
Build accessible, performant, maintainable Lightning Web Components with clear state, data, event, and security boundaries.

## When to use
Use for custom Salesforce UI where standard components or declarative pages do not satisfy the interaction requirement.

## Inputs
UX requirement, component hierarchy, Apex/UI API contracts, permission model, supported form factors.

## Preconditions
Know whether the component can rely on Lightning Data Service/UI API or requires Apex.

## Context to inspect
Existing components, design system usage, wire adapters, imperative calls, custom events, navigation, error states, accessibility conventions, test setup.

## Core knowledge
LWC is reactive and browser-based. Prefer platform data services because they provide caching and security behavior. Component APIs should be small, state ownership explicit, and DOM assumptions minimal.

## Procedure
1. Define user task, states, and accessibility requirements.
2. Split components by cohesive responsibility, not arbitrary file size.
3. Prefer Lightning Data Service/UI API for CRUD-oriented data access.
4. Use wired data for reactive reads; use imperative calls for explicit commands when appropriate.
5. Normalize loading, empty, success, and error states.
6. Keep child APIs explicit through public properties/methods and events.
7. Avoid duplicated server state unless caching is deliberate.
8. Use SLDS semantics and keyboard-accessible interactions.
9. Add Jest tests for rendering, events, data states, and errors.
10. Measure rendering/network behavior for realistic datasets.

## Decision points
Choose server-side Apex when UI API cannot express the transaction or aggregation. Prefer composition over deeply coupled parent-child state.

## Common failure patterns
Imperative Apex for every read, inaccessible custom controls, mutating shared objects unexpectedly, large monolithic components, stale cache assumptions, and missing error states.

## Verification
Run component tests, persona/security tests, keyboard/accessibility checks, responsive checks, and network/render profiling for critical flows.

## Expected output
A tested LWC implementation with explicit contracts and predictable state transitions.

## Stop conditions
Stop when the UI requires unsupported browser/platform capabilities, authorization semantics are unresolved, or server transactions cannot be safely exposed.