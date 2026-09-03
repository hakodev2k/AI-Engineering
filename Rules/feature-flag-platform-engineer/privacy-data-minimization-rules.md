# Privacy and Data Minimization Rules

## Purpose
Limit personal and sensitive data exposure through feature-flag targeting and telemetry.

## Scope
Applies to evaluation context, segment attributes, event payloads, logs, exports, and analytics integrations.

## MUST
- Evaluation context MUST include only attributes necessary for declared targeting or analysis purposes.
- Sensitive attributes MUST be classified before use and protected according to project privacy requirements.
- Telemetry MUST avoid secrets, authentication tokens, and unnecessary personal data.
- Retention and deletion requirements MUST apply to stored targeting and exposure data.
- Client-side contexts MUST be treated as observable by the end user.

## MUST NOT
- MUST NOT copy full user profiles into flag context when a minimal attribute set is sufficient.
- MUST NOT place confidential targeting logic or sensitive values in public client payloads without explicit design approval.
- MUST NOT retain raw sensitive context indefinitely for convenience.

## SHOULD
- Prefer opaque stable identifiers and derived attributes over direct identifiers when feasible.

## Exceptions
Additional data use requires documented purpose, risk assessment, retention plan, and required privacy approval.

## Verification
Inspect event schemas, SDK context construction, logs, retention settings, data inventories, and privacy reviews.