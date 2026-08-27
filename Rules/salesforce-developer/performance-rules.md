# Performance Rules

## Purpose
Ensure Salesforce implementations meet response-time and throughput expectations with evidence.

## Scope
Applies to Apex execution, queries, Lightning components, integrations, and high-volume automation.

## MUST
- Performance-sensitive changes MUST be evaluated with representative data volume and transaction shape.
- Claimed improvements MUST include before/after measurements or equivalent evidence.
- Expensive queries, repeated serialization, unnecessary rerenders, and avoidable synchronous work MUST be investigated when they materially affect latency.
- Performance fixes MUST preserve correctness, sharing, and auditability.

## MUST NOT
- MUST NOT optimize solely from intuition when measurement is practical.
- MUST NOT trade away security or data integrity for latency improvements.
- MUST NOT validate performance only on nearly empty development data.

## SHOULD
- Baselines SHOULD include peak-volume and realistic automation overhead.
- Performance budgets SHOULD be defined for critical user and integration paths.

## Exceptions
Exceptions require documented constraints, evidence, and accepted business risk.

## Verification
Use debug logs, query plans, browser profiling, load tests, transaction timing, and representative datasets.