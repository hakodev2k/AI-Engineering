# Skill: Plan Temporary Quarantine

## Purpose
Define a bounded quarantine only when immediate root-cause removal is unsafe or infeasible.

## Preconditions
The test meets flaky evidence thresholds and quarantine has explicit human approval.

## Process
1. Confirm the test is a flaky candidate under deterministic policy.
2. Record owner, tracking issue, reason, approver, created time, and expiry.
3. Set expiry no later than `maximum_quarantine_days`.
4. Keep the test executable in a quarantined lane where feasible; do not delete coverage.
5. Define repair acceptance criteria and removal trigger.
6. Do not broaden quarantine to unrelated tests.
7. Run the gate and verify the registry passes policy.

## Output
A single quarantine registry entry plus repair/exit criteria.

## Stop conditions
Missing owner, issue, approval, expiry, evidence, or request to permanently skip without approved policy change.
