# Logging Rules

## Purpose
Ensure logs provide actionable diagnostic evidence without exposing sensitive data or creating excessive noise.

## Scope
Applies to application logs, request logs, worker logs, integration logs, and security-relevant events.

## MUST
- Logs MUST record meaningful operational events with structured properties where practical.
- Correlation identifiers or equivalent context MUST be preserved across important request and background flows.
- Errors MUST include enough context to investigate the failing operation without requiring sensitive payloads.
- Sensitive data, credentials, tokens, and secrets MUST be excluded or redacted.
- Log levels MUST reflect operational severity consistently.
- High-volume log statements MUST be reviewed for cost and noise impact.

## MUST NOT
- MUST NOT log full authentication tokens, passwords, connection strings, private keys, or secret values.
- MUST NOT use logs as the only source of correctness for stateful workflows.
- MUST NOT log the same exception redundantly at every layer.

## SHOULD
- Prefer structured logging over string concatenation for searchable operational fields.
- Include stable event identifiers for recurring important events when useful.

## Exceptions
Temporary diagnostic logging in sensitive or high-volume paths requires explicit scope, expiry, and review.

## Verification
Inspect representative logs, automated tests for redaction where practical, log-volume metrics, and production queryability.