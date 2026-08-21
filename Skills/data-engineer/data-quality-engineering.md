# Data Quality Engineering

## Purpose
Turn data correctness expectations into measurable, automated controls that detect defects before consumers are harmed.

## When to use
Use for critical datasets, new pipelines, source migrations, recurring incidents, and published data products.

## Inputs
Business invariants, schema, historical distributions, SLAs, source behavior, consumer impact, and known failure modes.

## Context to inspect
Inspect field semantics, keys, nullability, freshness, volume patterns, referential relationships, accepted tolerances, and current incident history.

## Core knowledge
Quality is multidimensional: completeness, validity, uniqueness, consistency, timeliness, and accuracy. Checks must distinguish hard invariants from statistical expectations and must have actionable ownership.

## Procedure
1. Identify critical data elements and consumers.
2. Translate business rules into executable assertions.
3. Add schema, uniqueness, relationship, range, freshness, and volume checks where justified.
4. Establish baselines for statistical checks.
5. Define severity and response per failed check.
6. Quarantine or block publication for critical failures.
7. Attach checks to pipeline stages closest to the defect source.
8. Record quality metrics over time.
9. Test checks with intentionally bad data.
10. Review noisy or obsolete checks periodically.

## Decision points
Block publication only for failures whose consumer impact justifies reduced availability. Use statistical anomaly checks as signals unless confidence is high enough for automated gating.

## Common failure patterns
Checking only nulls, arbitrary thresholds, alerts without owners, tests after irreversible publication, and suppressing recurring failures instead of fixing causes.

## Verification
Inject representative defects, confirm detection and routing, validate false-positive rates, and trace each critical rule to a business expectation.

## Expected output
An automated quality suite with severity, ownership, metrics, and publication behavior.

## Stop conditions
Escalate when no authoritative business definition exists or blocking a dataset would violate a higher-priority operational requirement without approval.