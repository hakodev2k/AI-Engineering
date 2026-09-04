# Logging and Telemetry Privacy Rules

## Purpose
Prevent observability systems from becoming uncontrolled stores of personal or sensitive data.

## Scope
Applies to application logs, traces, metrics labels, crash reports, audit events, analytics events, and debugging telemetry.

## MUST
- Logging schemas MUST identify fields that may contain personal or sensitive data.
- Sensitive values MUST be redacted, tokenized, or excluded unless operational necessity is documented.
- Telemetry retention and access MUST reflect the sensitivity of captured data.
- Correlation identifiers MUST avoid embedding direct personal identifiers when alternatives exist.
- Debug logging that increases personal-data capture MUST have explicit scope, expiry, and review.

## MUST NOT
- Passwords, authentication tokens, private keys, session secrets, or full payment credentials MUST NOT be logged.
- Raw request or response bodies MUST NOT be logged by default when they can contain personal data.
- Sensitive values MUST NOT be placed in unbounded metric labels or trace attributes.

## SHOULD
- Structured allow-listed logging SHOULD be preferred over arbitrary object serialization.
- Privacy-safe synthetic data SHOULD be used for debugging reproduction where possible.

## Exceptions
Exceptional diagnostic capture requires necessity, limited duration, restricted access, deletion plan, and approval appropriate to the data sensitivity.

## Verification
Inspect logging code, telemetry schemas, runtime samples, redaction tests, retention settings, access policies, and secret-scanning results.