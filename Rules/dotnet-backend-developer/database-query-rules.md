# Database Query Rules

## Purpose
Ensure database queries are correct, bounded, explainable, and efficient.

## Scope
Applies to SQL, ORM-generated queries, reporting queries, and data-access code.

## MUST
- Important queries MUST retrieve only the data required for the use case.
- Queries on large datasets MUST have bounded result sets unless full scans are explicitly required.
- Query optimization MUST use execution-plan or runtime evidence.
- Filter, join, order, and pagination semantics MUST be deterministic.
- Index-sensitive query changes MUST consider selectivity, write cost, and existing index coverage.

## MUST NOT
- MUST NOT load large datasets into application memory only to filter or aggregate when the database can do so efficiently.
- MUST NOT introduce indexes solely from intuition without validating workload impact.
- MUST NOT rely on implicit ordering.

## SHOULD
- Prefer set-based operations over row-by-row processing.
- Prefer keyset pagination for large moving datasets when offset pagination becomes expensive or unstable.

## Exceptions
Exceptions require workload evidence, rationale, and a documented performance/correctness trade-off.

## Verification
Use generated SQL, execution plans, row counts, IO/time statistics, benchmarks, and production-safe telemetry.