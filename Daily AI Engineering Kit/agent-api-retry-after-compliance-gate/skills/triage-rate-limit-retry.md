# Triage Rate-Limit Retry

## Purpose
Determine whether an API retry is safe, standards-compliant, bounded, and evidence-backed.

## When to use
Use after HTTP 429 or retryable 503 responses, when client code is being changed, or when logs show rapid repeated requests.

## Inputs
Request method, response status, `Retry-After`, attempt count, endpoint semantics, client retry implementation, and relevant tests.

## Preconditions
Work in a non-production or replay-safe environment. Preserve the first failure response.

## Allowed tools
Repository search, test runner, HTTP mocks, logs, and `scripts/retry_after_gate.py`.

## Constraints
Do not send extra production traffic to prove retry behavior. Do not assume POST/PATCH is idempotent.

## Process
1. Locate the API client entry point and retry middleware/policy.
2. Capture method, status, `Retry-After`, attempt count, and whether an idempotency key exists.
3. Run the deterministic gate for the observed response.
4. Compare actual client behavior with the gate decision.
5. Identify whether the defect is delay handling, retry count, unsafe method retry, or status classification.
6. Make the smallest safe change.
7. Add a deterministic test reproducing the original behavior.
8. Test valid delta-seconds, HTTP-date, missing header, malformed header, max-delay cap, and budget exhaustion.
9. Inspect the diff for broader retry-policy changes.
10. Hand off to independent verification.

## Expected output
Facts, evidence, identified defect, changed files, tests run, residual risks, and verification request.

## Verification
The reproduction fails before the fix, passes after the fix, retry count is bounded, server delay is honored, and unsafe methods remain blocked.

## Failure handling
One environment/tool retry is permitted after preserving evidence. If behavior depends on undocumented provider semantics, stop and request authoritative documentation rather than guessing.

## Stop conditions
Stop on production-only reproduction, missing permission, destructive side effects, retry-budget ambiguity, or an approval-required non-idempotent retry.
