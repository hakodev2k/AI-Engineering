# Query and Access Pattern Rules

## Purpose
Keep query behavior predictable as data and traffic scale.

## Scope
Reads, writes, scans, joins, fan-out, secondary access paths, and query routing.

## MUST
- Critical queries MUST have known cardinality, latency objectives, and bounded resource consumption.
- Query design MUST account for partition routing and cross-node amplification.
- High-volume access patterns MUST be validated with representative data distributions.
- Unbounded scans MUST have explicit operational controls.

## MUST NOT
- MUST NOT optimize from syntax alone without runtime or plan evidence.
- MUST NOT introduce N+1 distributed requests on critical paths.
- MUST NOT expose unrestricted ad hoc queries to shared production capacity.

## SHOULD
- Queries SHOULD project only required data and target the smallest feasible partition set.

## Exceptions
Analytical or administrative scans require isolation, quotas, scheduling, or equivalent safeguards.

## Verification
Inspect query plans, traces, scanned-versus-returned ratios, fan-out metrics, and load-test results.