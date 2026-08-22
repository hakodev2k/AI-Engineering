# Skill: Investigate Transaction Outbox Consistency

## Purpose
Prove whether a business mutation and its integration event can be lost, duplicated unsafely, or published in an invalid order.

## When to use
Use for new event publishing, outbox refactors, broker migrations, incident analysis involving missing/duplicate events, or changes to retry/dispatcher logic.

## Inputs
- Change request or incident description.
- Repository root and relevant service/module.
- Database transaction code, outbox entity/table, publisher worker, broker adapter, and consumer behavior.
- Existing tests and operational evidence when available.

## Preconditions
Repository is readable; build/test commands are known or discoverable. Production writes are not required.

## Allowed tools
Repository search/read, local static scanner, build/test runner, read-only logs/metrics, read-only database plans/queries when authorized.

## Constraints
Follow `rules/safety-rules.md`. Do not execute approval-required actions.

## Procedure
1. Locate the command/API/job that mutates business state.
2. Trace its transaction start, save/flush, commit, rollback, and exception paths.
3. Locate creation of the integration event and outbox row.
4. Prove whether both writes share the same atomic transaction; record file/line evidence.
5. Locate publisher selection/claim logic and determine how concurrent workers avoid double claiming.
6. Trace publish acknowledgement, processed-state update, retry scheduling, and terminal quarantine/dead-letter behavior.
7. Confirm the logical message id remains stable across retries.
8. Locate the consumer or contract expectations and prove duplicate delivery is handled safely or explicitly document the risk.
9. Run `python scripts/scan-outbox.py <repo> --output outbox-evidence.json` and classify each heuristic finding as confirmed, disproved, or open.
10. Form the smallest remediation plan that preserves public/event contracts unless change is explicitly required.
11. After implementation, run build/tests plus failure-window and duplicate-delivery tests.
12. Hand evidence to an independent verifier; the implementing agent cannot be the sole verifier.

## Expected output
An evidence JSON compatible with `schemas/evidence.schema.json`, plus concise facts, hypotheses, decisions, open questions, and test evidence.

## Verification
Atomicity, publisher safety, consumer idempotency, and retry bounds must each have concrete evidence and be true before `verified`.

## Failure handling
Retry transient tool/test infrastructure failures at most twice while preserving output. Do not retry validation, permission, business-rule, or reproducible test failures without a change in evidence or implementation.

## Stop conditions
Stop on missing required access, approval-required changes, unresolved critical/high finding, two repeated transient failures, or inability to prove one of the four verification dimensions.
