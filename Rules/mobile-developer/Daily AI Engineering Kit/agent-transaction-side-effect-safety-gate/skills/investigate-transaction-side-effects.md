# Skill: Investigate Transaction Side Effects

## Purpose
Prove or dismiss risks where retried/rolled-back database work is mixed with external side effects that cannot roll back.

## When to use
Use after scanner findings, duplicate notifications/messages, retry-related incidents, or code changes touching transaction boundaries.

## Inputs
Repository root, `config/policy.json`, acceptance criteria, relevant logs/tests.

## Preconditions
Working tree state is known; build/test commands are discoverable; no production mutation is required.

## Allowed tools
Read/search repository, git diff, local build/test, static scanner, non-destructive logs and database-plan inspection.

## Process
1. Run `python scripts/scan_transaction_side_effects.py --root <repo> --policy config/policy.json`.
2. For each finding, identify the real transaction scope and whether an execution strategy can replay it.
3. Trace the external side effect to its provider boundary.
4. Determine whether the side effect is idempotent, deduplicated, transactional, or compensatable.
5. Locate tests and nearby established outbox/idempotency patterns.
6. Classify the finding as confirmed, dismissed, or unresolved; cite evidence.
7. For confirmed risk, design the smallest safe remediation: normally transactional outbox plus idempotent consumer/dispatcher.
8. Stop for approval if remediation requires schema, infrastructure, production configuration, or breaking-contract changes.
9. Implement only after boundaries are accepted.
10. Add tests covering success, failure before commit, failure after side effect, and retry where applicable.
11. Build/test, rerun scanner, inspect diff, and record residual risk.

## Expected output
A finding record with evidence, classification, proposed action, approval requirement, and verification status.

## Failure handling
Tool/transient failures: retry once. Build/test failures caused by the change: at most two repair cycles. Permission/environment failures: stop and preserve evidence.

## Stop conditions
Stop on missing evidence needed to distinguish atomic from non-atomic behavior, approval-required work, two failed repair cycles, or unrelated baseline failure that prevents verification.