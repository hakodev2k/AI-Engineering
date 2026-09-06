# Webhook Security Rules

## MUST
- Verify the provider-defined signature over the exact required bytes before any business side effect.
- Preserve access to the raw request body when the provider signs raw bytes.
- Validate required signature, timestamp, and replay-identity headers before processing.
- Enforce configured timestamp freshness using an explicit trusted `now` source.
- Compare MACs with a constant-time comparison primitive.
- Claim replay identity atomically before non-idempotent side effects.
- Define duplicate behavior explicitly and test concurrent duplicate delivery.
- Keep secret retrieval outside logs, evidence artifacts, fixtures, and exception messages.
- Record facts, hypotheses, evidence, decisions, and open questions separately.
- Require independent final verification for security-sensitive changes.

## MUST NOT
- Reconstruct JSON and assume serialized bytes equal the signed payload.
- Log webhook secrets, authorization values, or complete sensitive payloads.
- Accept missing signatures because a request originates from an allowlisted IP.
- Increase timestamp tolerance merely to make failing events pass.
- Use check-then-insert replay logic without an atomic uniqueness guarantee.
- Perform production deployment, secret rotation, destructive cleanup, force push, or security-control weakening without explicit human approval.
- Retry deterministic signature failures until they pass.

## SHOULD
- Prefer provider event IDs for replay identity; otherwise derive a documented stable identity.
- Use storage uniqueness constraints, atomic put-if-absent, or equivalent primitives.
- Separate authentication failure metrics from application processing failures.
- Store only the minimum replay metadata needed for the provider retry horizon.
- Test with known-good provider fixtures when available.