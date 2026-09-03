# Key Provisioning Rules

## Purpose
Protect cryptographic identity and trust anchors during manufacturing, enrollment, repair, and reprovisioning.

## Scope
Applies to device keys, certificates, trust anchors, provisioning credentials, secure elements, and manufacturing tooling.

## MUST
- Generate or inject keys through an authenticated process with documented custody and access controls.
- Prefer per-device secrets for device identity when compromise isolation matters.
- Verify provisioning completion and reject devices with missing, duplicated, or invalid security identity.
- Separate production trust material from development and test material.

## MUST NOT
- Embed shared private production keys in source code, build artifacts, scripts, or broadly accessible files.
- Export non-exportable device private keys merely for operational convenience.
- Reuse test credentials in production.

## SHOULD
- Generate private keys inside the protected device boundary when feasible.
- Maintain auditable records sufficient to investigate provisioning anomalies without recording secret values.

## Exceptions
Alternative provisioning requires threat analysis, exposure assessment, compensating controls, approval, and validation of compromise containment.

## Verification
Inspect provisioning flows and permissions, test duplicate/missing identity cases, review secret-handling boundaries, and validate representative devices after provisioning.