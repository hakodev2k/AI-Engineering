# Logging and Privacy

## Purpose
Preserve diagnostic value while preventing observability systems from becoming an uncontrolled store of sensitive ML data.

## Scope
Applies to application logs, inference logs, evaluation logs, debug capture, and telemetry exports.

## MUST
- Logging schemas MUST classify fields that can contain personal, confidential, regulated, or security-sensitive data.
- Sensitive values MUST be redacted, tokenized, aggregated, or omitted according to policy before telemetry leaves the producing boundary.
- Access to production ML logs MUST follow least privilege and auditable retention controls.
- Temporary diagnostic logging MUST have an owner and removal or expiry condition.

## MUST NOT
- MUST NOT log credentials, access tokens, private keys, or unrestricted sensitive model inputs and outputs.
- MUST NOT enable verbose production logging without assessing privacy, cost, and performance impact.
- MUST NOT retain diagnostic data indefinitely merely because storage is available.

## SHOULD
- Prefer structured event metadata and derived diagnostics over raw payload capture.
- Test redaction against representative edge cases.

## Exceptions
Sensitive diagnostic capture requires explicit purpose, bounded scope, retention, access controls, risk review, and human approval.

## Verification
Inspect schemas, access policies, retention configuration, redaction tests, sample telemetry, and temporary logging expiry records.