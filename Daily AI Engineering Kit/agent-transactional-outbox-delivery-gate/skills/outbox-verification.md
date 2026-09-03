# Skill: Outbox Verification

## Purpose
Independently prove the changed outbox path satisfies the delivery contract.

## Inputs
Diff, evidence JSON, tests/build output, scanner output, task acceptance criteria.

## Process
1. Reconstruct the affected path without relying on the implementer's conclusion.
2. Confirm transaction scope from code or tests.
3. Confirm message identity remains stable across retry.
4. Confirm claim/lease ownership is bounded and concurrent workers cannot silently double-own a record under the tested model.
5. Confirm publish failure leaves a recoverable state.
6. Confirm completion is recorded only after publish success.
7. Confirm retry is bounded or terminal policy exists.
8. Confirm duplicate-delivery assumptions are explicit downstream.
9. Re-run focused tests and scanner.
10. Validate evidence with `scripts/verify-evidence.py`.
11. Inspect changed files for unrelated or approval-required changes.
12. Record `verified`, `failed`, or `blocked` with evidence.

## Failure handling
Do not reinterpret a failing check as success. Return a concrete finding and evidence to the implementation owner.

## Stop conditions
Maximum one verification retry after a new implementation attempt.
