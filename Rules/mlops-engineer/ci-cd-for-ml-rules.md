# CI/CD for ML Rules

## Purpose
Apply software delivery discipline to code, data contracts, model artifacts, and deployment configuration.

## Scope
Covers continuous integration, model validation, packaging, promotion, and deployment pipelines.

## MUST
- CI MUST validate code, pipeline definitions, schemas/contracts, tests, security checks, and artifact metadata appropriate to changed scope.
- CD MUST promote immutable artifacts through explicit quality and authorization gates.
- Model evaluation results used by release gates MUST be machine-readable and linked to the candidate artifact.
- Production changes MUST be auditable and reversible.

## MUST NOT
- A mutable branch, tag, container tag, or model alias MUST NOT be sufficient evidence of artifact identity.
- CI failures MUST NOT be bypassed by editing thresholds or disabling tests without review and recorded rationale.
- Secrets MUST NOT be embedded in pipeline definitions or logs.

## SHOULD
- Pipelines SHOULD separate build, evaluate, approve, and deploy responsibilities.
- Policy checks SHOULD be automated and fail closed for critical controls.

## Exceptions
Emergency paths require explicit authority, compensating validation, monitoring, rollback readiness, and post-event reconciliation.

## Verification
Inspect pipeline definitions, required checks, artifact digests, evaluation attachments, approval records, secret handling, deployment logs, and rollback controls.