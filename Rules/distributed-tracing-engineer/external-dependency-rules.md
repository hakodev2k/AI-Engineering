# External Dependency Tracing Rules

## Purpose
Make third-party and cross-boundary dependency behavior diagnosable without misrepresenting ownership.

## Scope
Applies to HTTP, RPC, SaaS, payment, identity, storage, DNS, and other remote dependency calls.

## MUST
- Outbound dependency spans MUST identify the operation and dependency using stable, non-secret metadata.
- Timeouts, retries, and circuit-breaker outcomes MUST be distinguishable in telemetry for critical dependencies.
- Cross-boundary trace propagation MUST comply with trust and privacy policy.
- Dependency incidents MUST separate observed client symptoms from confirmed provider root cause.

## MUST NOT
- MUST NOT propagate internal baggage or sensitive context to untrusted external systems without explicit allowlisting.
- MUST NOT label a provider as failing solely from application trace latency when network, client pool, or caller saturation remains plausible.
- MUST NOT record signed URLs, tokens, or secret-bearing headers.

## SHOULD
- Capture bounded peer/service identity and protocol outcome when supported.
- Correlate trace evidence with provider status, network telemetry, and client metrics.

## Exceptions
Exceptions require documented trust boundary, propagation requirement, data review, and operational approval.

## Verification
Inspect outbound spans, propagation headers, retry/timeout behavior, redaction, and correlation with network/provider evidence in integration tests and incident drills.
