# Configuration and Secrets Rules

## Purpose
Control cloud configuration and secrets so environment changes are auditable, reproducible, isolated, and safe.

## Scope
Applies to application configuration, cloud resource settings, feature configuration, credentials, keys, certificates, and environment-specific values.

## MUST
- Production configuration MUST have an accountable owner, auditable change path, and rollback or recovery method appropriate to impact.
- Secrets MUST be stored in approved secret-management systems and accessed through least-privilege identities.
- Environment-specific configuration MUST be separated from source code and immutable artifacts where practical.
- Secret rotation procedures MUST account for dependent workloads, overlapping validity where necessary, and rollback behavior.
- High-risk production configuration or secret changes MUST require authorized human approval before execution.

## MUST NOT
- MUST NOT commit secrets, credentials, private keys, or authentication tokens to source control or reusable images.
- MUST NOT copy production secrets into lower environments.
- MUST NOT bypass configuration review by making undocumented console changes except under an authorized incident procedure.

## SHOULD
- Prefer short-lived credentials and automated rotation where supported.
- Detect configuration drift continuously for critical foundations.

## Exceptions
Exceptions require documented necessity, scope, compensating controls, expiry, and security approval.

## Verification
Inspect secret stores, IAM, source scans, configuration history, drift reports, rotation evidence, deployment manifests, and production change records.