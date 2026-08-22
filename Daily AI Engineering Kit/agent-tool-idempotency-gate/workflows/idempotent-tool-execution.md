# Workflow: Idempotent Tool Execution

## Trigger
An agent intends to perform an externally visible side effect.

## Entry conditions
Intent is expressible with stable business identity; required tools are known; dangerous actions have an approval path.

## Inputs
Tool intent JSON, provider/tool adapter, optional native idempotency support, reconciliation read path.

## Stages
1. **Context — Planner/Explorer:** identify target, effect, native idempotency, read-back method, risks. Produce validated intent.
2. **Gate — Execution Agent:** run pre-tool hook and `claim`. Checkpoint: only `claimed` proceeds.
3. **Approval — Human:** when `requires_approval=true`, stop until explicit approval is available. Approval never changes the fingerprinted arguments.
4. **Execute — Execution Agent:** invoke exactly one mutation attempt with the stable key.
5. **Record — Execution Agent:** transition to `succeeded`, `failed`, or `ambiguous` using post-tool hook semantics.
6. **Recover — Verification Agent:** for ambiguity, perform read-only reconciliation. No mutation is allowed during this stage.
7. **Retry — Execution Agent:** only a definite retryable failure may be reclaimed. Maximum two execution retries after the initial attempt.
8. **Verify — Verification Agent:** prove exactly one matching external effect and validate ledger invariants.
9. **Complete:** report success only when ledger state is `succeeded` and verification is `verified`.

## Produced artifacts
Intent JSON, ledger record, sanitized attempt evidence, reconciliation evidence, verification result.

## Retry rules
Execution retries: maximum 2. Retryable: explicit 429/5xx or equivalent provider response known not to have committed, after provider guidance/backoff. Non-retryable: validation, permission, business-rule rejection. Ambiguous: never retry until reconciled. Reconciliation read failures: maximum 2 retries.

## Evidence preserved
Key, fingerprint, attempt count, timestamps, sanitized error, correlation/request IDs, result reference, reconciliation references.

## Approval points
Production changes, destructive actions, schema/migration changes, secret/config changes, infrastructure mutation, breaking API changes, security weakening, force push/history rewrite, and operations without reliable reconciliation.

## Failure paths
Validation failure -> stop. Permission failure -> stop. Retry exhaustion -> stop and escalate. Ambiguity unresolved -> stop and escalate. Duplicate detected -> stop and escalate without remediation mutation.

## Definition of Done
Validated stable intent; authorized claim; required approval present; exactly one intended effect proven; ledger succeeded; retry limit respected; verification passes; no unresolved blocking risk.
