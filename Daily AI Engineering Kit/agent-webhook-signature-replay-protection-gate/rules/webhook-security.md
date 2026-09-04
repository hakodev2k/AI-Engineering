# Webhook Security Rules

## MUST

- Verify authenticity before any business side effect, durable enqueue, acknowledgement that commits work, or state mutation.
- Use the exact provider-defined signing payload. If raw request bytes are required, prove they are captured before parsing or mutation.
- Enforce provider-defined timestamp/freshness rules when present.
- Use constant-time signature comparison or an official verifier with equivalent guarantees.
- Keep signing secrets in approved secret/configuration facilities and redact them from logs, traces, errors, fixtures, and evidence.
- Implement replay protection with atomic first-use semantics when the provider supplies a stable event/message ID or when a safe replay key can be derived.
- Bound replay-record retention to at least the accepted replay window plus documented delivery tolerance.
- Test valid, invalid, malformed, stale, and duplicate deliveries.
- Separate confirmed facts, hypotheses, and scanner findings.
- Preserve failed test output and relevant scan evidence across retries.
- Require independent verification after implementation.

## MUST NOT

- Do not reconstruct JSON and assume it matches the signed bytes.
- Do not log request signing secrets or complete authorization/signature headers.
- Do not disable signature, freshness, or replay checks to make tests pass.
- Do not accept a duplicate solely because its signature is valid.
- Do not use a read-then-write replay check without atomic uniqueness semantics.
- Do not treat scanner pattern matches as confirmed vulnerabilities.
- Do not silently widen permissions, rotate secrets, change production config, deploy, or rewrite Git history.
- Do not change a public webhook/message contract unless explicitly required and approved.

## SHOULD

- Prefer official provider verification libraries when their behavior is understood and testable.
- Keep verification logic at a narrow transport boundary.
- Prefer provider event IDs for deduplication; otherwise derive a stable cryptographic replay key from signed immutable data.
- Return generic authentication failures while retaining safe internal diagnostics.
- Keep replay storage independent of volatile process memory in horizontally scaled production systems.
