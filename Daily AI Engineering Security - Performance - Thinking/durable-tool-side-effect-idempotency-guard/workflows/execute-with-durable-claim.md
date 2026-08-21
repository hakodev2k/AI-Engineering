# Workflow: Execute With Durable Claim

## Trigger
A workflow is about to invoke a side-effecting tool, or re-enter it after retry/resume.

## Goal
Complete the logical action at most once from the application's perspective while retaining bounded recovery.

## Inputs
Policy, workflow ID, action, target, arguments, side-effect class, ledger, provider idempotency support, and optional previous-attempt evidence.

## Baseline
Record current duplicate-effect rate in replay tests, percentage of side-effecting calls with stable keys, and percentage of ambiguous outcomes that are blindly retried.

## Context
The caller must know the user's authorized goal and the external effect being requested. High-impact actions retain existing approval controls.

## Stages
1. **Observe** — identify whether this is new execution, retry, or resume; collect current ledger state.
2. **Measure baseline** — run representative replay fixtures before changing behavior.
3. **Diagnose** — classify failure windows: before request, remote commit before response, response received before local persistence, or unknown.
4. **Form hypothesis** — define the stable operation identity and expected ledger transition.
5. **Claim** — call `scripts/idempotency_gate.py claim ...`; block if policy returns reconcile/block/reuse.
6. **Execute** — invoke the external tool using the same provider idempotency key when supported.
7. **Record** — persist success/result reference, definitive failure, or unknown outcome.
8. **Recover** — on unknown, reconcile read-only; retry only if evidence proves the effect did not occur.
9. **Measure again** — rerun fixtures and compare duplicate effects, key reuse, and unsafe replay count.
10. **Independent verification** — Recovery Verifier reviews evidence.

## Responsible agent
Implementation agent performs integration; `subagents/recovery-verifier.md` performs final independent verification.

## Tools
Durable ledger, external tool API, provider read-only lookup/reconciliation API, and `scripts/idempotency_gate.py`.

## Outputs
Ledger evidence, before/after metrics, replay-test results, reconciliation records, and verification status.

## Checkpoints
- Stable key computed before first write.
- Durable claim exists before high-impact write.
- Unknown outcome never passes directly to retry.
- Final state has evidence.

## Metrics
Duplicate side effects, stable-key coverage, replay reuse rate, unknown reconciliation coverage, attempt count, and blocked unsafe replay count.

## Retry policy
Maximum attempts come from policy (default 3). Only definitive failures may retry automatically. `unknown` is not a retryable state until reconciliation proves no effect occurred.

## Stop conditions
Succeeded/reused; definitive failure at retry limit; unreconciled unknown requiring escalation; policy or approval block.

## Failure path
If ledger persistence fails before execution, do not execute high-impact actions. If persistence fails after a response, mark the local outcome unknown and reconcile before any replay.

## Verification
Test remote-success/local-timeout, worker crash before execution, worker crash after execution, duplicate delivery, resume, and definitive provider rejection.

## Definition of Done
Implemented: gate integrated for all scoped side-effect tools. Measured: baseline and post-change replay metrics recorded. Verified: independent verifier confirms zero duplicate effects in required fixtures and no unsafe unknown replay.
