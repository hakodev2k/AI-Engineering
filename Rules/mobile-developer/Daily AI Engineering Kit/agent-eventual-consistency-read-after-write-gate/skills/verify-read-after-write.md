# Verify Read After Write

## Purpose
Prove that an acknowledged write becomes visible through the intended read contract within a bounded consistency window.

## Inputs
A request JSON matching `examples/sample-request.json`, approved read endpoint, expected value, optional minimum version.

## Procedure
1. Confirm the request targets a non-destructive read endpoint.
2. Copy write correlation ID and expected value/version into the request contract.
3. Run `python scripts/consistency_gate.py --request <file> --output consistency-result.json`.
4. Accept only exit code 0 and `status=verified` as success.
5. Inspect every attempt in the evidence array; do not hide intermediate stale reads.
6. If unverified, preserve the result and return to investigation. Do not extend retries beyond policy without human review.
7. If production writes, compensating changes, or consistency-model changes are proposed, stop for approval.

## Expected output
`consistency-result.json` containing status, correlation ID, attempt count, reason, and per-attempt evidence.

## Verification
Success means the intended read endpoint returned the expected value and, when supplied, an observed version not older than the write version.

## Failure handling
Network/429/5xx and configured stale/not-found responses are retryable only within the bounded attempt budget. Authentication, malformed contracts, and exhausted retries stop immediately or end unverified.

## Stop conditions
Verified state, exhausted retry budget, invalid input, permission failure, or approval boundary.
