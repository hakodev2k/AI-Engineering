# Deployment Handoff Rules

## Purpose
Ensure the registry hands off complete, unambiguous model information to deployment systems.

## Scope
Deployment manifests, runtime requirements, model aliases, environment configuration, and release metadata.

## MUST
- Deployment handoff MUST reference an immutable model version.
- Runtime, hardware, preprocessing, and dependency requirements MUST be explicit when they affect execution.
- Deployment tooling MUST verify artifact availability and integrity before rollout.
- Release records MUST connect the deployed service revision to the registered model version.

## MUST NOT
- MUST NOT deploy from an unresolved mutable alias without recording the resolved version.
- MUST NOT depend on undocumented operator knowledge to locate required model assets.
- MUST NOT promote a deployment when required model files are incomplete.

## SHOULD
- Generate deployment manifests automatically from registry metadata where practical.
- Keep model and serving configuration changes independently traceable.

## Exceptions
Exceptions require documented manual steps, owner, verification evidence, and rollback plan.

## Verification
Inspect deployment manifests, resolved model versions, artifact checks, and deployment-to-registry traceability.