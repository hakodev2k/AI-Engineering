# Service Identity Rules

## Purpose
Secure non-human identities used by applications, workloads, automation, and infrastructure.

## Scope
Service accounts, workload identities, managed identities, bots, automation principals, certificates, and machine credentials.

## MUST
- Every service identity MUST have a named owner, purpose, environment scope, and lifecycle mechanism.
- Workloads MUST use non-exportable or dynamically issued identity where the platform supports it.
- Service permissions MUST be resource- and action-scoped and reviewed when workloads change.
- Credential rotation or renewal MUST be automated where feasible and observable for failure.

## MUST NOT
- MUST NOT reuse one service identity across unrelated trust boundaries merely for convenience.
- MUST NOT use human credentials for unattended workloads.
- MUST NOT create permanent secrets when a platform identity mechanism provides equivalent capability.

## SHOULD
- Prefer short-lived credentials and federation over stored static secrets.

## Exceptions
Static credentials require documented necessity, secure storage, rotation SLA, monitoring, and owner approval.

## Verification
Inspect principal inventory, ownership, credential age, federation configuration, effective permissions, and rotation telemetry.