# Webhook Safety Rules

## MUST
- Verify authenticity against immutable raw request bytes before payload parsing or business side effects.
- Follow the provider's documented signing contract exactly.
- Use constant-time comparison for application-owned MAC comparison.
- Enforce timestamp freshness when the provider signs a timestamp.
- Atomically claim a stable replay identity before protected side effects.
- Keep replay retention at least as long as configured policy.
- Treat duplicate delivery as expected behavior and make it side-effect safe.
- Keep secrets in the existing secret provider and redact evidence/logs.
- Add adversarial tests and independent verification.

## MUST NOT
- Hash reserialized JSON when the provider signs raw bytes.
- Disable verification to make tests or local development pass.
- Accept a request after signature/timestamp parsing errors.
- Use non-atomic `exists` then `insert` as replay protection.
- Log signing secrets, complete authentication headers, or sensitive raw payloads.
- Silently widen timestamp skew or replay TTL policy.
- Change production secrets, deployment, infrastructure, or breaking contracts without approval.

## SHOULD
- Prefer provider-maintained verification SDKs when they preserve required raw-body semantics.
- Scope replay keys by provider/account/endpoint when collisions are possible.
- Return stable provider-compatible acknowledgement for duplicates.
- Measure rejection reasons without storing sensitive request material.