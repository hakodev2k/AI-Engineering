# Workflow: Transaction Side-Effect Safety Gate

## Trigger
Change or incident involving database transactions/retries plus external I/O.

## Entry conditions
Repository and acceptance criteria available; baseline working-tree state captured; local non-destructive verification possible.

## Inputs
Repository root, policy, build/test commands, incident/change context.

## Stages
1. **Baseline scan** — workflow owner runs pre-change hook; artifact: scanner JSON.
2. **Investigate** — Transaction Investigator traces each candidate and produces evidence-backed classifications.
3. **Plan** — choose no-change, idempotency hardening, or outbox remediation. Check schema/infrastructure/API/security implications.
4. **Approval checkpoint** — stop if schema migration, production configuration/infrastructure, breaking contract, destructive action, secret/security change, or deployment is required.
5. **Implement** — smallest accepted change using `skills/remediate-with-outbox.md` when appropriate.
6. **Test** — cover rollback, commit, retry/duplicate dispatch, and established regression suite.
7. **Independent verify** — Verification Agent reruns scan, tests/build, and diff review.
8. **Complete** — publish evidence and residual risks only when Definition of Done is satisfied.

## Retry rules
Transient tool failure: maximum 1 retry. Change-caused build/test failure: maximum 2 repair cycles, preserving each failure log. Scanner high finding: not retryable; investigate. Permission/approval failure: no retry; stop.

## Failure paths
Baseline failure unrelated to the change is recorded separately and blocks claims that depend on that check. Missing provider semantics produces `unresolved`, not a guessed classification. Approval-required work stops before mutation.

## Definition of Done
All scanner candidates dispositioned; confirmed unsafe path removed or safely controlled; relevant tests/build pass; final scan has no unresolved high finding; diff is scoped; required approvals recorded; residual risk documented; verifier marks `verified=true`.