# Workflow: Approval-Bound Execution

## Trigger
A planned action is classified as approval-required.

## Entry conditions
- Action plan exists.
- Protected action has not executed.
- Target and scope can be represented deterministically.

## Inputs
Action plan, target, environment, scope, payload/reference, risk evidence, rollback plan, approval policy.

## Stages
1. **Capture request** — Approval Request Analyst creates revisioned request and fingerprint.
2. **Validate request** — run `scripts/validate-approval-request.py`.
3. **Human approval checkpoint** — authorized human reviews exact request and records approve/reject with expiry. No execution occurs before this point.
4. **Independent verification** — Approval Verifier checks request/approval/intent/ledger.
5. **Pre-execution gate** — run `scripts/evaluate-approval-gate.py --phase pre-execution`.
6. **Execute exact action** — only when gate returns `allow`; execution mechanism remains tool-specific and outside this package.
7. **Record consumption** — append consumption via `scripts/append-consumption.py` immediately after attempt/result.
8. **Post-use verification** — re-run gate; single-use approval must no longer authorize another execution.
9. **Close** — preserve request, approval, review, gate result, consumption evidence, and remaining risks.

## Produced artifacts
Approval request, approval record, review record, gate decision, append-only consumption ledger entry.

## Checkpoints
- Request schema valid.
- Approval identity/role valid.
- Fingerprints identical.
- Approval not expired/revoked/superseded.
- Use count valid.
- Independent reviewer requirement satisfied.

## Retry rules
- Transient read/tool failure: maximum 1 retry, preserve first error.
- Validation, fingerprint, expiry, revocation, permission, role, or policy failure: no automatic retry.
- After retry exhaustion: stop and escalate with evidence.

## Approval points
The human approval checkpoint is mandatory for all protected actions. A new approval is required after any approval-visible mutation of intent.

## Failure paths
- Rejected: stop.
- Expired/revoked/consumed: request new approval.
- Intent mismatch: create new request revision.
- Ledger unavailable: block execution.
- Executor/reviewer conflict where independence is required: assign independent verifier.

## Definition of Done
- Exact intent was approved and verified before execution.
- Gate returned `allow` for the exact fingerprint.
- Execution result was recorded.
- Consumption ledger is valid.
- Single-use approval cannot be replayed.
- No unresolved blocking finding remains.