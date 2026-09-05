# Privacy and Redaction Rules

## Purpose
Prevent sensitive or regulated data from leaking through telemetry.

## Scope
Logs, traces, events, metric dimensions, payload capture, headers, query parameters, and diagnostic dumps.

## MUST
- Telemetry fields MUST be classified for sensitivity before collection when they can contain user, credential, financial, health, or regulated data.
- Secrets, authentication tokens, private keys, and equivalent credentials MUST be redacted or excluded before export.
- Redaction MUST occur as close to the producer as practical and before data crosses trust boundaries.
- Access to sensitive telemetry MUST follow least privilege and retention requirements.

## MUST NOT
- MUST NOT log complete credentials, session tokens, or raw secret values.
- MUST NOT rely solely on downstream cleanup for known sensitive fields.
- MUST NOT enable broad payload capture in production without explicit approval.

## SHOULD
- Prefer allowlists of approved fields over broad denylist-based capture.

## Exceptions
Require purpose, data classification, legal/security review where applicable, bounded duration, safeguards, and approval.

## Verification
Inspect instrumentation, redaction tests, sample exports, access policy, retention, and data-loss-prevention findings.