# Skill: Reconcile an Ambiguous Outcome

## Purpose
Determine whether a timed-out or disconnected mutation actually took effect before any retry.

## Trigger
Ledger state is `ambiguous`, or the caller cannot prove whether the provider accepted the request.

## Inputs
Idempotency key, operation fingerprint, attempt evidence, correlation/request IDs, provider read capability, expected resource identity.

## Preconditions
No new mutation has been issued after ambiguity was detected.

## Process
1. Freeze retries for the key.
2. Preserve timestamp, request/correlation ID, endpoint/tool name, sanitized request fingerprint, and transport error.
3. Query the provider using a read-only lookup by native idempotency key, external ID, deterministic name, correlation ID, or business identity.
4. If exactly one matching effect exists and its material fields match the intent, mark the ledger `succeeded` with a non-secret result reference.
5. If no effect exists and the provider offers authoritative evidence that the original request did not commit, mark `failed` as retryable.
6. If multiple matching effects exist, stop and escalate; do not delete or repair automatically.
7. If evidence is inconclusive, leave state `ambiguous` and require human decision.
8. Before a retry, claim again; the ledger must authorize it and retry count must remain within the configured maximum.

## Expected output
One of: confirmed success, confirmed safe-to-retry failure, or unresolved ambiguity; each with evidence and confidence.

## Verification
The verifier must cite a provider read result, audit record, or deterministic resource lookup. Absence of a client response is never proof of failure.

## Failure handling
Read API transient failures may be retried twice. Permission failures stop immediately. Inconclusive evidence never converts automatically to retryable.

## Stop conditions
Stop on duplicate effects, exhausted reconciliation retries, missing permissions, or insufficient evidence.
