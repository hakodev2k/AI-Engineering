# Secrets and Sensitive Data Rules
## Purpose
Prevent credential and sensitive-data exposure.
## Scope
Source, configuration, logs, tests, traces, and runtime storage.
## MUST
- Secrets MUST come from approved secret-management or runtime injection mechanisms.
- Sensitive fields MUST be classified before logging, persistence, or transmission.
- Exposed credentials MUST be treated as compromised and escalated for rotation.
## MUST NOT
- MUST NOT commit credentials, tokens, private keys, or production secrets.
- MUST NOT log authentication material or unnecessary personal data.
## SHOULD
- Prefer short-lived credentials and least-privilege scopes.
## Exceptions
Synthetic test values must be unmistakably non-production.
## Verification
Secret scanning, log review, configuration inspection, and access-policy review.