# Dependency Release Coordination

## Purpose
Coordinate releases across dependent services, libraries, schemas, clients, and external integrations while minimizing synchronized deployment coupling.

## When to use
Use when a change crosses independently owned release units or changes a shared contract.

## Inputs
Dependency graph, API/event/schema contracts, compatibility guarantees, ownership, release cadence, consumer inventory, and deprecation policy.

## Preconditions
Producers and consumers can be identified and version compatibility can be tested or reasoned about.

## Context to inspect
Inspect dependency manifests, API versions, event schemas, database consumers, shared libraries, deployment histories, and external partner constraints.

## Core knowledge
The safest coordination reduces the need for coordination: backward-compatible contracts, tolerant readers, additive schema evolution, and staged deprecation allow independent releases. Synchronized cutovers increase blast radius and scheduling risk.

## Procedure
1. Map changed contracts and affected consumers.
2. Identify current and target compatibility ranges.
3. Prefer additive producer changes first.
4. Release consumers that can handle old and new states.
5. Observe adoption and remaining legacy consumers.
6. Switch behavior only after compatibility is established.
7. Deprecate old contracts with explicit deadlines and telemetry.
8. Remove compatibility code after all consumers migrate.
9. Define fallback for unavailable external dependencies.
10. Record coordination decisions and owners.

## Decision points
Use explicit versioning when compatibility cannot be maintained transparently. Coordinate a single cutover only when dual-running or compatibility layers are more dangerous than synchronization.

## Common failure patterns
Producer breaking change deployed first, hidden consumers, shared-library upgrade requiring every service simultaneously, event schema reuse with changed semantics, and deprecation without usage telemetry.

## Verification
Run compatibility/contract tests, confirm old and new consumer behavior during transition, and verify telemetry shows legacy usage reaches zero before removal.

## Expected output
A staged dependency release plan that preserves service autonomy where feasible.

## Stop conditions
Stop when affected consumers are unknown, compatibility cannot be demonstrated, an external partner has not accepted required changes, or removal would strand active consumers.