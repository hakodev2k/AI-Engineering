# Privacy and Sensitive Data Rules

## Purpose
Protect personal, confidential, and regulated data during analysis.

## Scope
Queries, extracts, notebooks, reports, dashboards, and shared analytical artifacts.

## MUST
- Use only data necessary for the approved analytical purpose.
- Apply least privilege and approved access paths.
- Mask, aggregate, or de-identify sensitive fields when detailed values are unnecessary.
- Follow retention, sharing, residency, and disclosure requirements.
- Escalate suspected unauthorized exposure through the defined incident process.

## MUST NOT
- MUST NOT place secrets, credentials, raw sensitive data, or restricted identifiers in unsecured artifacts.
- MUST NOT bypass access controls to accelerate analysis.

## SHOULD
- Prefer privacy-preserving aggregates and governed datasets over raw-source access.

## Exceptions
Use of detailed sensitive data requires explicit need, authorization, controls, and bounded retention.

## Verification
Inspect permissions, query fields, sharing settings, masking behavior, retention configuration, and data-classification evidence.