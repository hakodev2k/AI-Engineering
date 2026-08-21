# Prepare External Action

## Purpose
Prepare a write-side effect so it can be reconciled safely if the caller loses the response.

## When to use
Before API mutations, remote job submissions, payment-like operations, cloud changes, ticket creation, message publication, deployment requests, or any external action whose outcome may become uncertain.

## Inputs
- Task/acceptance requirement.
- Exact target system/resource.
- Canonical request payload without secrets.
- Risk level.
- Available idempotency/status-query capabilities.
- Human approval when the action is dangerous.

## Preconditions
- The action is necessary and in scope.
- Read-only investigation has identified the external API/tool behavior.
- Least-privilege credentials are available.

## Allowed tools
Repository reads, official API documentation, read-only status probes, local hashing scripts, and the approved external write tool only at execution time.

## Constraints
- Never fabricate idempotency support.
- Never log secrets or raw credentials.
- Never widen permissions to make reconciliation easier.
- Dangerous actions stop before execution until explicit approval is bound to the exact attempt.

## Procedure
1. Name one logical action and one target resource.
2. Canonicalize material request fields and calculate a SHA-256 `request_fingerprint`.
3. Generate or obtain a stable `idempotency_key` for that logical action; reuse it only for the same request fingerprint.
4. Create an `action-attempt` record before calling the external system.
5. Record risk and whether the action is dangerous.
6. For dangerous actions, bind approval evidence to the attempt fingerprint before execution.
7. Identify the authoritative read-back/status probe that can distinguish success, failure, and unknown.
8. Execute once. Capture response, timeout, connection loss, or tool error as a receipt. Do not infer business failure from transport failure.

## Expected output
- `artifacts/action-attempt.json`
- `artifacts/action-receipt-001.json`
- Redacted raw transport evidence when useful.

## Verification
The attempt has a stable idempotency key, request fingerprint, exact target, risk classification, and a known reconciliation method.

## Failure handling
If the system provides neither idempotency nor authoritative read-back for a material side effect, stop and escalate rather than enabling blind retries.

## Stop conditions
Missing target identity, ambiguous request, missing required approval, unsupported permission, or no safe reconciliation path for a high-risk action.
