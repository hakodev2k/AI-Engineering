# Sensitive Data Rules

## Purpose
Limit exposure and misuse of confidential, personal, regulated, or security-sensitive data.

## Scope
Schemas, queries, exports, logs, backups, test data, masking, and operational troubleshooting.

## MUST
- Sensitive columns MUST be identified and handled according to applicable classification and retention requirements.
- Queries and exports MUST retrieve only data necessary for the authorized purpose.
- Non-production use of production-derived sensitive data MUST use approved masking, tokenization, synthesis, or equivalent controls.
- Access to sensitive data MUST be attributable and reviewable where required.

## MUST NOT
- MUST NOT place secrets, tokens, passwords, or unnecessary personal data in logs, query comments, error output, or source control.
- MUST NOT copy production data into unmanaged locations for debugging convenience.
- MUST NOT remove masking or access controls without approval.

## SHOULD
- Minimize persistence and propagation of sensitive attributes.
- Prefer irreversible masking for datasets that do not require re-identification.

## Exceptions
Exceptions require documented purpose, legal/security constraints, scope, duration, controls, and approval.

## Verification
Review classifications, projections, grants, export destinations, masking tests, audit records, retention behavior, and representative logs/errors for leakage.