# SQL and PL/SQL Engineering

## Purpose
Implement maintainable Oracle SQL and PL/SQL that is correct under concurrency, observable in production, and efficient at realistic data volumes.

## When to use
Use for stored procedures, packages, functions, triggers, batch logic, and complex SQL changes.

## Inputs
Requirements, schema, existing code conventions, workload profile, error contracts, test data.

## Context to inspect
Package APIs, transaction ownership, exception handling, dynamic SQL, bulk operations, grants, NLS assumptions, instrumentation, and callers.

## Core knowledge
Set-based SQL generally outperforms row-by-row processing. PL/SQL transaction boundaries, exception propagation, definer/invoker rights, bulk collect/forall, and dynamic SQL security are production-critical.

## Procedure
1. Define inputs, outputs, side effects, and transaction ownership.
2. Prefer declarative SQL over procedural loops where practical.
3. Use bind variables and typed interfaces.
4. Apply bulk operations for large procedural batches.
5. Handle expected exceptions explicitly and preserve diagnostic context.
6. Avoid hidden commits inside reusable components unless contractually required.
7. Instrument long-running or business-critical operations.
8. Review dynamic SQL for injection and privilege risks.
9. Add unit/integration tests for success, edge, and failure paths.
10. Measure SQL plans and runtime on representative data.

## Decision points
Use PL/SQL when data-local procedural logic reduces round trips or centralizes trusted behavior; keep orchestration outside the database when service boundaries and deployment independence dominate.

## Common failure patterns
Row-by-row loops, COMMIT in helpers, WHEN OTHERS THEN NULL, literal SQL, NLS-dependent conversions, and definer-rights privilege escalation.

## Verification
Compile with warnings, run tests, inspect execution plans and SQL statistics, and verify rollback behavior.

## Expected output
Tested SQL/PLSQL with explicit contracts, safe transaction behavior, and measured performance.

## Stop conditions
Stop when transaction ownership, privilege model, or expected error semantics are unclear.