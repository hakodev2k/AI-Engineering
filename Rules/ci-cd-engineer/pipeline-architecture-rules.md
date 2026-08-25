# Pipeline Architecture Rules

## Purpose
Define safe, maintainable CI/CD pipeline boundaries and execution flow.

## Scope
Build, test, package, promotion, and deployment pipelines across repositories and environments.

## MUST
- Pipelines MUST separate build, verification, artifact publication, promotion, and deployment into explicit stages with observable outcomes.
- A releasable artifact MUST be built once and promoted unchanged between environments.
- Stage dependencies, required inputs, outputs, permissions, failure behavior, and retry behavior MUST be explicit.
- Production-impacting stages MUST have an auditable approval and rollback path.
- Pipeline architecture changes MUST be reviewed for security, reliability, cost, and recovery impact.

## MUST NOT
- MUST NOT rebuild application binaries separately for production after lower-environment verification.
- MUST NOT hide critical deployment logic in undocumented manual steps.
- MUST NOT couple unrelated services into one failure domain without a documented operational reason.

## SHOULD
- Pipelines SHOULD use reusable, versioned components for common behavior.
- Long pipelines SHOULD maximize safe parallelism while preserving deterministic dependencies.

## Exceptions
Exceptions require documented constraints, alternatives considered, risk, compensating controls, verification evidence, and approval for production risk.

## Verification
Review pipeline DAG/configuration, artifact identities across stages, permission boundaries, approval settings, failure tests, and deployment records. CI validation SHOULD reject invalid dependencies and missing required gates.