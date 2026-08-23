# Logging and Telemetry Privacy Rules

## Purpose
Prevent operational observability from becoming an uncontrolled personal-data store.

## Scope
Application logs, traces, metrics, crash reports, analytics events, audit logs, and support diagnostics.

## MUST
- Telemetry schemas MUST identify personal or sensitive fields before production use.
- Logs MUST minimize identifiers and payload content to what is operationally necessary.
- Sensitive values MUST be redacted, masked, tokenized, or excluded according to policy.
- Telemetry retention and access MUST reflect sensitivity and operational need.
- Debug modes that increase personal-data capture MUST be time-bounded and controlled.

## MUST NOT
- MUST NOT log credentials, session tokens, secret keys, full payment data, or equivalent secrets.
- MUST NOT copy entire request or response bodies into logs by default.

## SHOULD
- Prefer structured allowlists over blacklist-style redaction.

## Exceptions
Require incident or operational justification, minimal scope, owner, expiry, approval, and cleanup plan.

## Verification
Inspect logging code, telemetry schemas, production samples, redaction tests, retention settings, and access policies.