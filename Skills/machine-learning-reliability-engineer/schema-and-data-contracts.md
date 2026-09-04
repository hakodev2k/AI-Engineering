# Schema and Data Contracts

## Purpose
Protect ML systems from silent upstream changes by defining and enforcing contracts for features, labels, and inference inputs.

## When to use
Use when multiple teams produce ML data, when schemas evolve, or when incidents stem from malformed or semantically changed inputs.

## Inputs
- Feature and label schemas
- Producer ownership
- Historical pipeline failures
- Serving contracts
- Allowed evolution rules

## Context to inspect
Inspect types, nullability, units, enums, ranges, timestamps, freshness, semantic definitions, ownership, and compatibility guarantees.

## Core knowledge
Schema compatibility is necessary but insufficient: semantic drift can break a model without changing types. Contracts should cover structure, meaning, freshness, quality, and change ownership.

## Procedure
1. Inventory critical features and labels.
2. Define types, units, nullability, ranges, freshness, and semantic meaning.
3. Identify producers and consumers.
4. Specify backward-compatible evolution rules.
5. Add validation at ingestion and before inference/training.
6. Fail closed or degrade safely for contract violations.
7. Version breaking changes and require coordinated rollout.
8. Record contract breaches in telemetry.

## Decision points
Fail closed when incorrect predictions are more harmful than unavailable predictions; use fallback or partial degradation when continuity is safer.

## Common failure patterns
- Valid type but changed unit.
- Enum expansion without model handling.
- Silent null-rate increase.
- Feature renamed or recomputed with different semantics.

## Verification
Inject representative contract violations and verify validation, alerting, fallback behavior, and producer ownership.

## Expected output
Versioned data contracts, validation rules, ownership, and safe-change procedures.

## Stop conditions
Stop if semantic ownership is unknown or incompatible producer changes cannot be coordinated.