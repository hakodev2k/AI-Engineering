# Security Rules

## Purpose
Protect quantitative systems, data, models, credentials, and privileged trading or risk capabilities.

## Scope
Applies to code, datasets, services, notebooks, infrastructure access, and third-party integrations.

## MUST
- Credentials and secrets MUST be stored in approved secret-management mechanisms and scoped by least privilege.
- Inputs crossing trust boundaries MUST be validated before use in commands, queries, file access, or model execution.
- Sensitive datasets and artifacts MUST follow applicable access, encryption, retention, and licensing controls.
- Dependencies MUST be pinned or otherwise controlled and assessed for known security risk.
- Privileged production actions MUST be attributable to an authenticated identity.

## MUST NOT
- Secrets MUST NOT be committed to source control, notebooks, logs, or shared artifacts.
- Security controls MUST NOT be disabled to unblock research or deployment without explicit security approval.
- Untrusted serialized model or data artifacts MUST NOT be executed or deserialized with unsafe mechanisms.

## SHOULD
- Isolate research environments from production credentials and execution authority.
- Automate secret and dependency scanning in CI.

## Exceptions
Exceptions require security-owner approval, documented threat analysis, compensating controls, expiry, and verification.

## Verification
Run secret scanning, dependency scanning, access reviews, configuration inspection, security tests, audit-log review, and checks that research identities cannot perform unauthorized production actions.