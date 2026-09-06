# Schema Contract and Versioning

## Purpose
Manage message and payload schemas so workflows remain compatible as producers and consumers evolve independently.

## When to use
Use for API payloads, queue messages, webhook events, workflow inputs/outputs, files, and shared data contracts.

## Inputs
Current schemas, producer/consumer inventory, version history, compatibility requirements, rollout cadence, and sample payloads.

## Preconditions
Identify contract owners and affected consumers.

## Context to inspect
Inspect optional versus required fields, defaults, enum evolution, serialization rules, existing validators, consumer assumptions, and deployment order.

## Core knowledge
Backward compatibility lets old consumers accept new producer output; forward compatibility lets new consumers accept old output. Additive changes are often safer than removal or semantic reuse, but even optional fields can break poorly implemented consumers.

## Procedure
1. Inventory producers and consumers for the contract.
2. Document field semantics, types, requiredness, defaults, and constraints.
3. Define compatibility expectations.
4. Introduce explicit schema validation at boundaries.
5. Prefer additive evolution when semantics permit.
6. Never silently reuse a field for a different meaning.
7. Version breaking changes and define migration overlap.
8. Test old and new producer/consumer combinations.
9. Monitor validation failures during rollout.
10. Deprecate old versions only after usage evidence confirms safety.

## Decision points
Use a new version when semantics or required structure change incompatibly. Keep one version for compatible additions. Translate at adapters when external contracts cannot change.

## Common failure patterns
Changing enum meaning, removing fields without usage evidence, making optional fields required, weak validation, and deploying producer changes before consumers are compatible.

## Verification
Run contract tests across supported versions and inspect real or sanitized samples for validation and semantic correctness.

## Expected output
A versioned contract with compatibility rules, validators, migration plan, and deprecation criteria.

## Stop conditions
Stop when ownership is unknown, a breaking migration has no overlap strategy, or consumers cannot be identified well enough to assess impact.