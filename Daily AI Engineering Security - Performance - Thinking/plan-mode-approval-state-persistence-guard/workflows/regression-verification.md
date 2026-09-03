# Workflow: Regression Verification

## Trigger
After integrating the approval gate or changing resume/permission logic.

## Goal
Verify authorization behavior without using real destructive actions.

## Inputs
Gate script, test suite, policy, synthetic or sanitized event traces.

## Baseline
Record the pre-fix result for the known failure class when available.

## Stages
1. Run unit tests.
2. Replay unapproved resume with reported write-capable mode; expect denial.
3. Replay mutation in Plan Mode without approval; expect denial.
4. Replay approval bound to wrong plan or epoch; expect denial.
5. Replay valid approval bound to current plan/epoch; expect allow.
6. Replay valid approval followed by plan change; expect subsequent mutation denial.
7. Review that logs contain no secrets and no mutation was executed by the verifier.

## Responsible agent
Verification Agent.

## Tools
Python standard library and sanitized JSON traces.

## Outputs
Test summary and invariant matrix.

## Checkpoints
After deterministic tests and after trace matrix.

## Metrics
Required: 100% pass for package tests; 100% block for unauthorized cases; 100% allow for valid control cases.

## Retry policy
Maximum 2 retries, only after implementation or fixture correction.

## Stop conditions
Any unauthorized case is allowed, valid approval cannot be distinguished from inferred state, or tests become nondeterministic.

## Failure path
Mark verification failed, retain Plan Mode/read-only enforcement, and return to diagnosis.

## Verification
Verifier must be distinct from the mutation implementer for high-risk host changes.

## Definition of Done
Implemented, Measured, and Verified are separately recorded and all required cases pass.
