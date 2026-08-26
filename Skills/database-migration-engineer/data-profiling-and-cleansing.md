# Data Profiling and Cleansing

## Purpose
Expose data anomalies that can break migration or become silent corruption on the target.

## When to use
Use before transformation design and again before production migration.

## Inputs
Representative source data, constraints, business rules, target type limits, retention rules, and known quality issues.

## Core knowledge
Legacy data often violates current declared assumptions. Profile nullability, cardinality, distributions, encoding, precision, orphan relationships, duplicates, invalid dates, oversized values, and business-rule violations.

## Procedure
1. Define quality dimensions and acceptance thresholds.
2. Profile every migration-critical column and key.
3. Detect orphaned relationships and duplicate business keys.
4. Identify encoding, timezone, precision, and range anomalies.
5. Separate source defects from valid exceptional values.
6. Decide whether to cleanse at source, transform in flight, quarantine, or preserve.
7. Make cleansing deterministic and auditable.
8. Re-profile after cleansing.
9. Record exceptions and owners.
10. Convert important checks into migration validation rules.

## Decision points
Clean at source when correction is authoritative and safe; transform in flight when source must remain unchanged; quarantine only with explicit business acceptance.

## Common failure patterns
Silently truncating data, replacing invalid values with arbitrary defaults, changing identifiers, and cleansing without an audit trail.

## Verification
Compare pre/post profiles, exception counts, checksums where appropriate, and business-rule test results.

## Expected output
Data quality report, deterministic cleansing rules, exception set, and acceptance thresholds.

## Stop conditions
Stop when cleansing would change business meaning without an accountable owner.