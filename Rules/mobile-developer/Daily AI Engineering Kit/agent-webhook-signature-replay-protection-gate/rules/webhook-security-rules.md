# Webhook Security Rules

## MUST
- Verify the provider-specified signed bytes before trusting parsed payload fields.
- Enforce a bounded timestamp freshness window when the provider supplies signed timestamps.
- Use constant-time signature comparison.
- Keep replay/dedup state long enough to cover the accepted replay window and provider redelivery behavior.
- Distinguish authentication failure from duplicate delivery and business-processing failure.
- Redact secrets, signatures, authorization headers, and sensitive payload fields from logs/evidence.
- Require explicit approval for production signing-secret changes, production configuration/deployment, breaking webhook contracts, security-control weakening, or destructive actions.
- Preserve evidence for valid, invalid, stale, replay, and rotation tests.

## MUST NOT
- Deserialize and reserialize a body before signature verification unless the provider explicitly signs that canonical representation.
- Accept unsigned fallback requests because verification failed.
- Disable timestamp/replay checks to make integration tests pass.
- Compare signatures with ordinary string equality when a constant-time primitive is available.
- Store plaintext signing secrets in source, test fixtures, reports, or logs.
- Treat a 2xx handler response as proof that replay protection works.
- Replay real production webhooks or rotate production secrets without approval.

## SHOULD
- Use provider event IDs for deduplication when stable and authenticated.
- Bind replay records to provider/account/endpoint scope to avoid collisions.
- Test raw-body behavior through the same middleware stack used in production.
- Support current and previous secret during a bounded rotation overlap.
- Make duplicate processing idempotent even after successful authentication.
