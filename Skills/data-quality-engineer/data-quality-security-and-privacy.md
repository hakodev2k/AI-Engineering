# Data Quality Security and Privacy

## Purpose
Design quality processes that validate sensitive data without unnecessarily exposing, copying, logging, or retaining protected information.

## When to use
Use for PII, financial, health, credential-adjacent, regulated, or otherwise restricted datasets.

## Inputs
Data classification, access policy, retention rules, quality requirements, environments, logging configuration, and regulatory constraints.

## Preconditions
Use least-privilege access and approved environments.

## Context to inspect
Inspect column classifications, masking/tokenization, test fixtures, logs, quarantine storage, exports, access controls, secrets, retention, and third-party tooling.

## Core knowledge
Quality tooling expands the data-access surface. Metrics and diagnostics should reveal enough to remediate without leaking raw values. Synthetic or masked data is preferred when it preserves required test properties.

## Procedure
1. Classify data touched by each quality control.
2. Minimize columns and rows accessed.
3. Use aggregate diagnostics where possible.
4. Mask/tokenize examples needed for investigation.
5. Prevent sensitive values from entering logs and alerts.
6. Secure quarantine and failed-record stores.
7. Apply retention limits to diagnostic artifacts.
8. Use service identities with least privilege.
9. Review third-party processors and data egress.
10. Test access denial and redaction behavior.
11. Audit privileged investigations.

## Decision points
Use hashes only when they meet the threat model; unsalted hashes may leak low-entropy values. Prefer synthetic test data unless real distributions are essential and approved.

## Common failure patterns
Logging failed rows verbatim; copying production data into development; broad read permissions; long-lived quarantine; secrets in connection configs; sending protected samples through unapproved tools.

## Verification
Review permissions, redaction, audit logs, retention, and representative alerts. Confirm quality checks still work when sensitive payloads are hidden.

## Expected output
Privacy-preserving quality controls with minimized access, secure diagnostics, auditable privileges, and approved retention.

## Stop conditions
Stop when required access is unauthorized, data classification is unknown for sensitive fields, or remediation requires exporting protected data outside approved boundaries.