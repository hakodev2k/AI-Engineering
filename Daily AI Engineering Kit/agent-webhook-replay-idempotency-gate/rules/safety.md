# Webhook Replay Safety Rules

## MUST
- Verify provider authenticity before creating or consulting a claim when doing so could leak claim existence.
- Use a stable documented event key and an atomic create-if-absent or unique constraint.
- Bind each key to a payload hash and reject mismatched reuse.
- Place the successful claim before the first externally visible side effect.
- Bound stale-processing recovery with an explicit TTL and evidence that retry is safe.
- Preserve evidence for duplicate, mismatch, stale recovery and verification failures without recording secrets or full sensitive payloads.
- Require independent verification for changes affecting payments, provisioning, account state or other high-impact side effects.

## MUST NOT
- Implement check-then-insert without an atomic uniqueness guarantee.
- Use request arrival time, random values, or mutable business state as the only idempotency key.
- Acknowledge an unverified signature as a trusted duplicate.
- Delete claim records to make a failing replay pass.
- Log signatures, credentials, authorization headers, or raw sensitive payloads.
- Deploy schema/config changes, weaken signature checks, run destructive cleanup, or mutate production without explicit human approval.
- Retry indefinitely.

## SHOULD
- Prefer the provider event ID over payload-derived identity.
- Align retention with the provider replay window plus operational margin.
- Share the claim/business transaction or use an outbox when practical.
- Return the provider-compatible success status for safe duplicates.
