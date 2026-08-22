# Skill: Validate EF Core Query Fix

## Purpose
Prove that a proposed EF Core query change fixes the measured regression without changing required behavior.

## Inputs
- Investigation artifact.
- Proposed code change.
- Baseline measurements.
- Acceptance criteria.

## Preconditions
A root-cause hypothesis has evidence and the proposed change does not cross an unapproved boundary.

## Procedure
1. Re-run the behavioral test before optimization and record its expected result.
2. Capture post-change generated SQL and compare it to the baseline SQL.
3. Confirm filters, joins, ordering, pagination, tenant/security predicates, null semantics, and result cardinality remain correct.
4. Run targeted unit/integration tests and the relevant project build.
5. Re-run the same representative performance scenario with equivalent data and inputs.
6. Capture post-change database execution-plan evidence where available.
7. Compare latency, query count, rows read/returned, allocation signals, and expensive plan operators.
8. Inspect the final git diff for unrelated edits.
9. Write `artifacts/verification.md` with pass/fail per criterion and remaining risks.

## Verification criteria
- Behavioral tests pass.
- Build passes.
- Generated SQL is captured before and after.
- Performance comparison uses equivalent workload shape.
- The measured regression is improved or eliminated according to the configured threshold or stated acceptance criterion.
- No approval-required change was performed without approval.

## Failure handling
If performance does not improve, revert the unproven optimization and return to the next ranked hypothesis. Maximum three hypothesis attempts per workflow run.

## Stop conditions
Stop on verified success, exhausted hypothesis attempts, an approval boundary, or inability to reproduce the original symptom.
