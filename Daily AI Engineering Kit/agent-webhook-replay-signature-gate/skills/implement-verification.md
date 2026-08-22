# Implement Verification

## Preconditions
Discovery evidence validates and status is `ready`.

## Procedure
1. Capture raw request bytes before parsing or normalization.
2. Reject missing required signature/timestamp metadata before business handling.
3. Parse timestamp strictly and enforce configured past-age and future-skew bounds.
4. Construct the signed message exactly as the provider specifies.
5. Compute/verify the provider-supported digest/signature using the configured secret/key source.
6. Compare MAC/signature in constant time when comparison is application-owned.
7. Only after authenticity succeeds, derive the replay identity from the provider event ID or documented stable identifier.
8. Atomically claim replay identity with bounded TTL before protected side effects.
9. Define duplicate behavior that does not repeat the protected side effect and returns the provider-compatible acknowledgement.
10. Parse payload only after the transport gate passes.
11. Add tests for valid, missing, malformed, forged, stale, future, duplicate, concurrent duplicate, and raw-body mutation cases applicable to the provider.
12. Inspect diff for secret leakage, bypass flags, widened public contracts, or unrelated edits.

## Constraints
Do not invent a signing algorithm. Do not log raw secrets/signatures/full sensitive payloads. Do not implement check-then-insert replay logic without an atomic uniqueness primitive.

## Expected output
Smallest safe code/test delta plus updated evidence with status `implemented`.