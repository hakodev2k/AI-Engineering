# Skill: Migration Verification

## Purpose
Verify that an agent-performed migration actually occurred and preserved required behavior.

## Trigger
Repository-wide framework, language, API, runtime, or build-system migration.

## Inputs
Migration contract; expected new markers; forbidden legacy residues; repository diff; test results; independent-verifier report.

## Preconditions
The intended migration scope and acceptance invariants are written before implementation.

## Required context
Only the migration contract, relevant repository paths, test commands, and evidence artifacts.

## Allowed tools
Read-only repository inspection, static search, build/test commands, deterministic acceptance script.

## Constraints
- MUST distinguish structural completion from behavioral correctness.
- MUST NOT accept a migration solely because tests pass.
- MUST NOT let the implementation agent be the only verifier.
- MUST bound repair attempts.

## Procedure
1. Record facts: target technology, source scope, old implementation markers, new implementation markers.
2. Capture baseline behavior and current legacy markers.
3. Run the migration.
4. Build `migration-report.json` with structural and behavioral evidence.
5. Run `scripts/migration_acceptance_guard.py`.
6. If rejected, classify the failure as structural, behavioral, or verification.
7. Permit at most two repair rounds.
8. Require independent verification after the final repair.

## Decision points
Reject when expected new markers are absent, forbidden legacy residues remain, tests regress, or independent verification fails.

## Expected output
Machine-readable acceptance result plus facts, evidence, risks, and verification status.

## Metrics
Residual legacy count, migration-audit pass rate, behavioral pass rate, repair rounds, independent-verifier pass rate.

## Verification
The verifier reproduces the structural audit and behavioral checks independently.

## Failure handling
Preserve the rejected report and diff. Re-enter diagnosis for at most two repair rounds.

## Stop conditions
Stop after two failed repairs, any destructive ambiguity, or inability to prove migration completeness.
