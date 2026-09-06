# Lifecycle Hooks

## Pre-task plan validation
**Trigger:** before implementation or execution.
**Preconditions:** saga plan JSON exists.
**Action:** `python scripts/validate_saga.py <plan> --simulate --out .saga/plan-validation.json`.
**Expected result:** exit 0 and status `valid`.
**Failure behavior:** preserve output; block implementation if a material side effect lacks idempotency or compensation.
**Blocks execution:** yes.

## Post-edit verification
**Trigger:** after implementation edits.
**Preconditions:** repository tests are available.
**Action:** rerun plan validation, project formatter/linter if configured, and targeted recovery tests.
**Expected result:** deterministic validation and relevant tests pass.
**Failure behavior:** preserve logs; implementation/test-fix cycles are capped at 3.
**Blocks completion:** yes.

## Final verification
**Trigger:** after tests and review.
**Preconditions:** final plan, diff, test evidence, and required approvals are available.
**Action:** independent Verification Agent applies `skills/verify-recovery.md`.
**Expected result:** verification status `verified`.
**Failure behavior:** status remains `blocked` or `failed`; no production action is performed.
**Blocks completion:** yes.
