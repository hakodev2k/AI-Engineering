# Quality Rule Design

## Purpose
Translate business and technical expectations into precise, maintainable, low-noise executable data quality rules.

## When to use
Use after profiling, contract definition, incidents, or requirement changes expose an invariant worth enforcing.

## Inputs
Business semantics, schema, profiles, valid examples, known defects, lineage, and failure impact.

## Preconditions
The rule must correspond to a meaningful expectation with an identifiable owner or consumer.

## Context to inspect
Inspect historical distributions, edge cases, upstream transformations, null semantics, time zones, units, keys, and existing overlapping rules.

## Core knowledge
Rules can assert schema, domain, completeness, uniqueness, relationships, reconciliation, temporal logic, or statistical behavior. Deterministic invariants and anomaly detectors require different thresholds and response policies.

## Procedure
1. State the expectation in plain language.
2. Identify scope, grain, and authoritative source.
3. Define pass/fail semantics and exceptions.
4. Choose deterministic or statistical validation.
5. Establish threshold from business tolerance and evidence.
6. Encode the smallest rule that captures the invariant.
7. Test against valid edge cases and known defects.
8. Define severity and response behavior.
9. Attach owner and remediation guidance.
10. Version the rule when semantics change.
11. Monitor precision, false positives, and blind spots.

## Decision points
Use row-level rules for local validity, aggregate rules for population behavior, and reconciliation for cross-system consistency. Fail pipelines only for high-confidence critical violations. Use quarantine when bad records can be isolated safely.

## Common failure patterns
Arbitrary thresholds; duplicated rules with conflicting semantics; rules that encode implementation rather than business intent; no exception policy; unstable anomaly thresholds; failing an entire batch for recoverable record-level defects.

## Verification
Demonstrate the rule catches known bad cases, accepts known good cases, produces actionable diagnostics, and behaves correctly at production scale.

## Expected output
An executable rule with documented intent, scope, threshold, severity, ownership, diagnostics, and evidence.

## Stop conditions
Stop when expected behavior is disputed, examples contradict the proposed invariant, or enforcement could cause material disruption without an approved policy.