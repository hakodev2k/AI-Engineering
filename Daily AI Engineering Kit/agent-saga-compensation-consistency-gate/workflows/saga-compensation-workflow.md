# Workflow: Saga Compensation Consistency

## Trigger
A change or incident touches a multi-step business flow spanning multiple transactional boundaries.

## Entry conditions
Target flow is identified; repository is readable; production mutation is not required for investigation.

## Inputs
Use case, repository context, integration contracts, logs/traces, acceptance criteria.

## Stages
1. **Context** — Saga Explorer traces steps and evidence.
2. **Plan** — classify side effects, idempotency, uncertain outcomes, compensation and reconciliation.
3. **Gate** — run `python scripts/saga_gate.py --input <plan.json> --policy config/policy.yaml --output <result.json>`.
4. **Execute** — implement the smallest safe change; no approval-required production action is performed.
5. **Test** — exercise success, duplicate, timeout, crash, partial failure, compensation retry, and resume paths.
6. **Review** — inspect diff and business invariants.
7. **Verify** — independent Verification Agent reruns tests/gate and validates evidence.
8. **Complete** — only after status is pass and verification is true.

## Responsible agents
Saga Explorer owns context. Implementer owns code changes. Verification Agent owns final proof.

## Checkpoints
- Every side effect mapped before implementation.
- Gate passes before completion.
- Approval exists before destructive or irreversible compensation.

## Retry rules
Transient tool/test infrastructure failures may retry twice. Compensation execution attempts are capped by policy (default 3). Business-rule failures are not retried automatically. Each retry preserves logs, receipts, operation key, attempt number, and prior result.

## Failure paths
- Unknown remote outcome → reconcile before compensation.
- Missing idempotency → block retryable write.
- Compensation failure → preserve evidence, retry within budget, then escalate.
- Permission/environment failure → stop; do not increase privileges.
- Approval-required action → status `needs-approval` and stop.

## Stop conditions
Untraceable side effects, missing domain semantics for compensation, exhausted retries, missing permission, or required approval.

## Definition of Done
All side effects are mapped; required compensations or non-compensable reasons exist; tests cover failure boundaries; deterministic gate passes; independent verification succeeds; no unresolved unknown outcome remains; required approvals are recorded.
