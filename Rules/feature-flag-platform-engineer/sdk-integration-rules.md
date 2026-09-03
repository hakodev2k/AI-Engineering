# SDK Integration Rules

## Purpose
Keep application integrations reliable, consistent, and operationally safe.

## Scope
Applies to server, browser, mobile, edge, and embedded feature-flag SDK integrations.

## MUST
- SDK initialization, refresh, shutdown, and error behavior MUST be understood before production use.
- Long-lived processes MUST release SDK resources cleanly during shutdown.
- Applications MUST use the correct client/server credential class and trust boundary for their runtime.
- SDK upgrades MUST be assessed for evaluation-semantic, caching, networking, and API compatibility changes.
- Integration code MUST expose enough telemetry to distinguish provider failures from application failures.

## MUST NOT
- MUST NOT embed server-side secrets in browser or mobile applications.
- MUST NOT instantiate expensive SDK clients per request when the SDK is designed for reuse.
- MUST NOT block latency-sensitive request paths on unnecessary flag network calls.

## SHOULD
- SDK construction SHOULD be centralized behind a thin application boundary when this improves testability and provider portability.

## Exceptions
Runtime constraints may justify alternative lifecycle patterns when supported by evidence and tests.

## Verification
Use dependency review, integration tests, secret scanning, runtime profiling, shutdown tests, and telemetry inspection.