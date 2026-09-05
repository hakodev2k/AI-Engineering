# Sensitive Payment Data Rules

## Purpose
Minimize exposure of cardholder, bank, identity, and authentication data in payment systems.

## Scope
PANs, bank details, tokens, CVVs, authentication values, personally identifiable payment data, logs, traces, queues, and backups.

## MUST
- Systems MUST minimize collection and retention of sensitive payment data to what is explicitly required.
- Sensitive fields MUST be encrypted or tokenized according to applicable security requirements.
- Access MUST follow least privilege and be auditable.
- Logs, traces, metrics, errors, and analytics MUST redact prohibited or unnecessary sensitive values.
- Retention and deletion behavior MUST follow the governing policy and legal obligations.

## MUST NOT
- MUST NOT store prohibited authentication data after authorization when policy or regulation forbids it.
- MUST NOT place raw payment secrets in source control, tickets, chat, or ordinary telemetry.
- MUST NOT expand sensitive-data scope merely for debugging convenience.

## SHOULD
- Prefer provider-hosted collection or tokenization that reduces system exposure.

## Exceptions
Require security review, legal/compliance basis, compensating controls, and explicit approval.

## Verification
Inspect data flows, schemas, logs, retention settings, access policy, security scans, and sample telemetry.