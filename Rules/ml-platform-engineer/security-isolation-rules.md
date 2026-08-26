# Security and Isolation

## Purpose
Protect shared ML infrastructure, tenants, artifacts, and privileged execution paths.

## Scope
Identity, authorization, workload isolation, network access, secrets, artifacts, and platform APIs.

## MUST
- Human and workload identities MUST use least privilege and independently auditable authorization.
- Untrusted training or inference code MUST execute within an isolation boundary appropriate to its threat model.
- Artifact ingestion MUST validate origin, integrity, and allowed formats before privileged use.
- Security-sensitive actions MUST produce audit records.

## MUST NOT
- Long-lived credentials MUST NOT be embedded in images, notebooks, models, or source code.
- Tenant workloads MUST NOT gain implicit access to another tenant's data or compute context.

## SHOULD
- Short-lived workload identity SHOULD replace static secrets where supported.

## Exceptions
Privilege exceptions require security review, bounded scope, expiry, and compensating controls.

## Verification
Review IAM policy, isolation tests, secret scans, network policy, audit logs, artifact verification, and penetration findings.