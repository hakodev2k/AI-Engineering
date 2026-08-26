# Interface Versioning and Compatibility

## Purpose
Evolve Wasm modules/components and host contracts without accidental consumer breakage.

## When to use
Use when changing imports, exports, WIT interfaces, resource semantics, data representations, or host behavior.

## Inputs
Current contracts, consumers, compatibility policy, release cadence, proposed changes, runtime/toolchain matrix, and migration constraints.

## Context to inspect
Inspect deployed module versions, WIT/core signatures, generated bindings, adapters, feature negotiation, deprecation history, and consumer test coverage.

## Core knowledge
Binary/type compatibility is narrower than behavioral compatibility. Adding a required import is breaking. Changing ownership, errors, limits, or side effects can break consumers even if signatures remain unchanged.

## Procedure
1. Inventory active producers and consumers.
2. Classify proposed change as additive, behavioral, or breaking.
3. Define compatibility window and migration path.
4. Prefer additive optional capabilities where semantics remain clear.
5. Version interfaces/worlds when breaking changes are unavoidable.
6. Provide adapters for staged migrations where practical.
7. Test old guest/new host and new guest/old host combinations promised by policy.
8. Document deprecations and removal criteria.
9. Observe version usage in production.
10. Remove compatibility code only after evidence confirms migration.

## Decision points
Use explicit major versions for semantic breaks; capability negotiation for optional enhancements. Avoid permanent compatibility layers when controlled coordinated migration is cheaper.

## Common failure patterns
Treating signature stability as behavioral stability; adding mandatory imports silently; changing error variants without consumer testing; removing old interfaces based on assumption rather than usage.

## Verification
Run compatibility matrix tests, generated-binding builds, and deployment telemetry checks for active versions.

## Expected output
A versioned contract and migration plan with tested compatibility guarantees and measurable deprecation exit criteria.

## Stop conditions
Stop release if active consumers cannot migrate within policy or compatibility semantics are ambiguous.