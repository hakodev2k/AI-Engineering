# Skill: Review Test Evidence

## Purpose
Independently verify that generated tests provide meaningful behavioral evidence and that a green test run is not misleading.

## When to use
Use after test generation or repair and before declaring a task verified.

## Inputs
- Final diff.
- Test evidence JSON matching `schemas/test-evidence.schema.json`.
- Test command output.
- Changed implementation and acceptance criteria.

## Preconditions
The implementation/test author has completed their work and no approval-required action is pending.

## Allowed tools
Repository read/search, diff inspection, non-destructive test/build/static-analysis commands.

## Procedure
1. Reconstruct the changed behaviors from the implementation and acceptance criteria without relying only on the author's summary.
2. Check every new/modified test against a concrete behavior and failure proposition.
3. Identify tautological assertions, mocks that replace the unit under test, assertions on implementation details, over-broad snapshots, and tests dependent on unstable ordering/time/network.
4. Confirm a relevant negative or boundary case exists when the changed logic has one.
5. Confirm no test was skipped/focused and no existing test was weakened or deleted without justification.
6. Re-run the static guard and the narrow relevant test target independently.
7. For bug regressions, require evidence that the test would detect the prior behavior. Accept one of: pre-fix failure record, a narrowly reverted local reproduction, a failing fixture from the bug, or equivalent deterministic evidence.
8. Compare evidence JSON with command results and diff; reject unsupported claims.
9. Record verdict: `verified`, `blocked`, or `needs-approval` plus remaining risks.

## Verification
Approve only when evidence is traceable, commands succeed, the guard passes, and assertions prove observable behavior rather than incidental execution.

## Failure handling
Retry a transient verification command once. Do not edit implementation code as part of verification. Return defects to the implementation/test owner with file/line evidence. Stop after one verification retry.

## Stop conditions
Stop on verified success, a material evidence gap, exhausted retry budget, environment/permission failure, or an approval boundary.
