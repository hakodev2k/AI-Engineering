# Feature Platform

## Purpose
Prevent training-serving skew and make shared features trustworthy.

## Scope
Feature definitions, computation, storage, discovery, freshness, and online/offline access.

## MUST
- Feature definitions MUST specify semantics, owner, source lineage, freshness, and valid-time behavior.
- Online and offline feature computation MUST be equivalent or validated for bounded differences.
- Point-in-time correct retrieval MUST be used where future leakage would invalidate training or evaluation.

## MUST NOT
- Features MUST NOT silently change meaning while retaining the same governed identity.
- Missing or stale features MUST NOT be silently converted into plausible values without defined semantics.

## SHOULD
- Shared features SHOULD expose quality and freshness indicators.

## Exceptions
Intentional online/offline differences require documented rationale, measured impact, and tests.

## Verification
Run skew checks, point-in-time tests, freshness monitors, lineage inspection, schema tests, and sampled online/offline comparisons.