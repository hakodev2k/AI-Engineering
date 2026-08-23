# Navigation and Deep Links

## Purpose
Design reliable Android navigation, typed arguments, deep links, and back-stack behavior across cold starts and recreated processes.

## When to use
Use for new navigation flows, external links, notifications, multi-step journeys, or back-stack defects.

## Inputs
Screen graph, entry points, URI contracts, access rules, task behavior, saved-state expectations.

## Preconditions
Define canonical destinations and ownership of navigation decisions.

## Context to inspect
Navigation Compose or Fragment navigation, intents, app links, manifest filters, pending intents, nested graphs, route arguments, and launch modes.

## Core knowledge
Navigation can begin from arbitrary external entry points. Deep-link input must be validated. Back-stack semantics must remain coherent after cold start and recreation.

## Procedure
1. Enumerate internal and external entry points.
2. Define stable destination identifiers and minimal arguments.
3. Validate and normalize deep-link data.
4. Define gated-flow behavior while preserving intended destination.
5. Specify back-stack results for cold and warm entry.
6. Avoid passing large or mutable objects through routes.
7. Make repeated link handling idempotent.
8. Configure verified app links where applicable.
9. Test malformed links, missing arguments, cold start, and process recreation.
10. Inspect actual back-stack behavior on device.

## Decision points
Pass stable IDs when data can be reloaded; pass compact immutable values only when reconstruction requires them. Use nested graphs only for meaningful ownership boundaries.

## Common failure patterns
Stringly typed routes, trusting URI parameters, duplicate destinations, broken back behavior, and navigation triggered repeatedly by recomposition.

## Verification
Run instrumentation tests for all entry modes and verify invalid links fail safely with no duplicate actions.

## Expected output
Navigation contract, deep-link validation rules, back-stack behavior, and passing entry-point tests.

## Stop conditions
Escalate when required behavior conflicts with Android task semantics or external URI ownership cannot be established.