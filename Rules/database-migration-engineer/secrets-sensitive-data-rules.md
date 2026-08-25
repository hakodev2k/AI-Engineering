# Secrets and Sensitive Data

## Purpose
Protect confidential data and credentials throughout migration.

## Scope
Covers exports, staging, logs, snapshots, backups, scripts, credentials, and temporary copies.

## MUST
- Sensitive data MUST remain protected in transit and at rest according to applicable project requirements.
- Temporary data copies MUST have defined location, access controls, retention, and secure deletion criteria.
- Logs and diagnostics MUST redact secrets, tokens, credentials, and prohibited sensitive fields.

## MUST NOT
- MUST NOT commit credentials or production data extracts to source control.
- MUST NOT copy regulated or sensitive production data into lower-trust environments without explicit authorization and controls.

## SHOULD
- Minimize migrated fields and use masking or synthetic data for rehearsals when production values are unnecessary.
- Inventory temporary artifacts before execution.

## Exceptions
Any exceptional sensitive-data movement requires documented purpose, legal/security approval where applicable, and auditable handling controls.

## Verification
Inspect storage encryption, transport configuration, secret scanners, artifact inventories, access logs, retention settings, and deletion evidence.