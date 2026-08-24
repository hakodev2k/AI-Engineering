# Model and Data Contract Testing

## Purpose
Prevent incompatible schema, feature, model-signature, and semantic changes from reaching training or inference systems.

## When to use
Use for upstream data changes, feature evolution, model packaging, API changes, and cross-team ML integrations.

## Inputs
Schemas, feature definitions, model signatures, sample data, producer/consumer versions, compatibility policy.

## Preconditions
Contract owners and compatibility expectations are explicit.

## Context to inspect
Pipeline schemas, feature store, serialization, serving APIs, batch outputs, versioning conventions, and incident history.

## Core knowledge
Syntactic schema compatibility is weaker than semantic compatibility. Units, null semantics, category domains, timestamps, ordering, and preprocessing expectations can break models without type errors.

## Procedure
1. Inventory producer-consumer boundaries.
2. Define machine-checkable schemas and semantic constraints.
3. Add representative fixtures including edge cases.
4. Test backward/forward compatibility as required.
5. Validate model input/output signatures.
6. Check units, ranges, nullability, and categorical domains.
7. Test unknown/new categories and missing features.
8. Run consumer contract tests in CI.
9. Version intentional breaking changes.
10. Define migration and dual-read/write windows when needed.

## Decision points
Strict rejection vs tolerant parsing; additive evolution vs explicit version bump; runtime validation depth based on latency and risk.

## Common failure patterns
Renamed fields with same type, unit changes, timezone shifts, silent defaulting, category remapping, and producers deploying before consumers are ready.

## Verification
Run old/new producer-consumer combinations required by policy and confirm expected pass/fail behavior.

## Expected output
Contract definitions, CI tests, compatibility matrix, migration plan, and ownership.

## Stop conditions
Stop rollout when semantic compatibility is unknown or a breaking producer change lacks a coordinated migration.