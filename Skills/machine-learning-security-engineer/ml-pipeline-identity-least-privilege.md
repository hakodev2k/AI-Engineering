# ML Pipeline Identity and Least Privilege

## Purpose
Design service identities and permissions for ML pipelines so compromise of one stage does not grant broad access to datasets, models, compute, or production.

## When to use
Use for new pipelines, cloud migration, permission reviews, CI/CD hardening, or incident remediation.

## Inputs
Pipeline DAG, service accounts, IAM policies, storage/registry permissions, secret usage, environment boundaries, and operator roles.

## Preconditions
Map pipeline stages and authoritative owners. Obtain current permission evidence rather than relying on documentation alone.

## Context to inspect
Inspect ingestion, feature jobs, training, evaluation, registry promotion, deployment, monitoring, orchestration, CI runners, notebooks, and break-glass paths.

## Core knowledge
ML workflows often accumulate broad permissions because stages share storage and compute. Separate identities reduce blast radius. Human interactive access, automation access, and deployment promotion should be independently controlled and auditable.

## Procedure
1. Enumerate every human and workload identity.
2. Map required read/write/admin actions per pipeline stage.
3. Remove inherited permissions not justified by current operations.
4. Create stage-specific workload identities.
5. Separate development, training, promotion, and production permissions.
6. Prevent training jobs from directly modifying production deployments unless explicitly designed and approved.
7. Use short-lived credentials and workload identity mechanisms where available.
8. Restrict secret access by identity and environment.
9. Add approval boundaries for sensitive promotion actions.
10. Enable audit logging for privileged operations.
11. Test denied paths as well as allowed paths.
12. Periodically recertify permissions.

## Decision points
Use separate accounts/projects when IAM boundaries within one environment are too complex or weak. Prefer temporary elevation over standing administrator access. Automation should receive narrower permissions than its operators when possible.

## Common failure patterns
One service account for the entire pipeline; wildcard storage access; long-lived cloud keys in notebooks; training jobs able to overwrite production models; human credentials reused by CI; no audit trail for promotion.

## Verification
Run permission tests for each stage, confirm prohibited cross-stage actions fail, rotate/revoke a workload credential without breaking unrelated stages, and review audit events for privileged operations.

## Expected output
A least-privilege identity matrix, hardened policies, tested deny boundaries, and an access-review procedure.

## Stop conditions
Escalate when required access cannot be isolated, changing permissions risks production outage without rollback, or ownership of privileged identities is unknown.