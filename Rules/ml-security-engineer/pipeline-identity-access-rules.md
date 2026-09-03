# Pipeline Identity and Access Rules

## Purpose
Limit compromise and unauthorized actions in ML training, evaluation, and deployment pipelines.

## Scope
Applies to users, service accounts, CI identities, orchestration identities, registries, datasets, and deployment targets.

## MUST
- Use unique workload identities with least privilege for each material pipeline stage.
- Separate permissions for data ingestion, training, evaluation, artifact publication, and production promotion where feasible.
- Require strong authentication and auditable authorization for privileged pipeline changes.
- Review dormant, shared, or excessively broad permissions on a defined cadence.

## MUST NOT
- Use personal long-lived credentials for unattended production ML pipelines.
- Grant wildcard administrative access when narrower permissions can satisfy the workflow.
- Allow a compromised training job to implicitly gain production-deployment authority.

## SHOULD
- Prefer short-lived credentials and workload federation over static secrets.
- Enforce separation of duties for high-risk model promotion.

## Exceptions
Temporary privilege elevation requires bounded duration, reason, ticket or approval evidence, and post-use revocation.

## Verification
Inspect IAM policies, service-account bindings, authentication logs, CI configuration, privilege reviews, and promotion controls.