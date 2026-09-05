# Skill: Plan Lock-Order Fix

## Purpose
Design the smallest safe change that removes the demonstrated lock-order cycle.

## Inputs
Baseline cycle evidence, transaction code paths, nearby tests, database constraints.

## Process
1. Enumerate each transaction's resource acquisition order.
2. Identify the inversion that closes the cycle.
3. Prefer consistent resource ordering and shorter transactions before stronger locking.
4. Check whether ORM query shape, eager loading, batch ordering, or implicit transactions affect acquisition order.
5. Define a minimal code change and regression test/reproduction plan.
6. Treat isolation-level changes, schema/index changes, or production configuration changes as approval-required.
7. Define at least three clean candidate reproduction runs unless policy is stricter.
8. Limit fix-test cycles to two before escalation.

## Expected output
Affected paths, proven inversion, proposed ordering, alternatives rejected, test plan, approval points, rollback path.

## Stop conditions
Fix requires breaking API behavior, risky database change, security weakening, or unapproved production action.
