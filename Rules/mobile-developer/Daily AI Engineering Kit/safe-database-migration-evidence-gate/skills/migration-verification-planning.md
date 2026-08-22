# Skill: Migration Verification Planning

## Purpose
Design evidence that can prove a migration is safe before execution and correct after execution.

## When to use
Use after impact assessment and before reviewer approval for any migration above trivial local-only changes.

## Inputs
- migration manifest;
- generated SQL/inspection report;
- application acceptance criteria;
- target environment characteristics;
- available staging/dry-run environment;
- authorized deployment and recovery process.

## Preconditions
Impact assessment exists and risk level is assigned.

## Allowed tools
Read-only DB queries, staging migration execution, test/build tools, application health checks, schema introspection, deterministic scripts, and repository search.

## Constraints
- Verification must be observable and repeatable.
- Recovery actions must not be invented after failure; define them before production approval.
- A framework `Down` method is not sufficient evidence of reversibility.

## Process
1. Convert each material risk into a verification obligation.
2. Define pre-apply checks: expected source schema, row counts, null/duplicate/orphan conditions, free space, compatibility state.
3. Define dry-run/staging checks: migration execution result, duration, affected rows, lock/blocking observations when available, application smoke/integration tests.
4. Define post-apply checks with concrete queries or commands and expected results.
5. Choose recovery mode: rollback, forward-fix, restore/recover, or application feature disable. Explain why it is feasible.
6. For data transformations, define reconciliation: source count, transformed count, rejected count, invariant checks, idempotency/resume behavior.
7. For rolling deployments, prove compatibility for the required old/new app and old/new schema combinations.
8. Mark irreversible operations explicitly.
9. Define the risk window during which recovery evidence must remain available.
10. Add all evidence paths/results to the migration manifest.

## Expected output
A verification plan with pre-apply, dry-run, post-apply, compatibility, reconciliation, and recovery evidence obligations.

## Verification
Every high/critical risk must map to at least one explicit check. Every destructive/irreversible operation must have authorized recovery or an explicit human risk acceptance.

## Failure handling
If staging cannot represent production scale, state the limitation and require human approval for operational risk. If post-apply checks cannot detect the expected outcome, redesign the verification plan before approval.

## Stop conditions
Stop when a high/critical migration has no credible recovery path, no measurable postcondition, or unresolved rolling-version incompatibility.