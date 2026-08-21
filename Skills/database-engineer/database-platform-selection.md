# Database Platform Selection

## Purpose
Select an appropriate database engine and deployment model from workload requirements rather than technology preference.

## When to use
Use for new systems, major migrations, workload separation, managed-service adoption, and persistent mismatch between current database and requirements.

## Inputs
Data model, consistency needs, query patterns, transaction semantics, scale, availability, latency, compliance, team capability, budget, and ecosystem constraints.

## Context to inspect
Inspect existing platform standards, operational skills, integration requirements, portability expectations, data gravity, cloud constraints, and migration cost.

## Core knowledge
Relational, document, key-value, graph, columnar, time-series, and distributed databases optimize different trade-offs. Operational maturity and failure semantics matter as much as feature lists.

## Procedure
1. Define mandatory data and transaction semantics.
2. Characterize read/write patterns and query flexibility.
3. Quantify scale, latency, availability, and recovery objectives.
4. Identify security, compliance, residency, and retention constraints.
5. Shortlist platforms that satisfy hard requirements.
6. Compare consistency, indexing, scaling, backup, HA, and observability models.
7. Evaluate ecosystem, driver, tooling, and team-operability fit.
8. Prototype the hardest representative workload.
9. Estimate total cost including operations and migration.
10. Record the decision and conditions that would trigger reconsideration.

## Decision points
Prefer proven general-purpose relational systems when requirements fit; introduce specialized stores when they solve a material workload problem worth added complexity.

## Common failure patterns
Choosing by popularity, assuming horizontal scale is free, ignoring query evolution, polyglot persistence without ownership, and benchmarking only happy-path throughput.

## Verification
Prototype critical semantics, failure modes, performance, backup/restore, and operational workflows.

## Expected output
A documented platform decision with evidence, rejected alternatives, risks, and operational implications.

## Stop conditions
Stop when hard requirements are unknown or candidate platforms cannot be tested against the most important workload risks.