# Reusable Pipeline Component Rules

## Purpose
Keep shared CI/CD logic stable, reviewable, and backward compatible.

## Scope
Reusable workflows, templates, actions, plugins, modules, and shared scripts.

## MUST
- Shared components MUST have explicit inputs, outputs, permissions, and failure semantics.
- Breaking behavior changes MUST use versioning or coordinated migration.
- Consumers MUST pin production-critical components to controlled versions.
- Shared components MUST receive tests proportional to their blast radius.
- Security-sensitive changes MUST receive qualified review.

## MUST NOT
- MUST NOT introduce hidden environment-specific behavior into generic components.
- MUST NOT silently expand permissions required by an existing version.
- MUST NOT delete a supported version before dependent consumers have a migration path.

## SHOULD
- Components SHOULD be cohesive and avoid abstracting project-specific logic prematurely.
- Deprecations SHOULD include migration guidance and timeline.

## Exceptions
Document compatibility constraint, affected consumers, risk, migration, and approval.

## Verification
Inspect version references, contract tests, changelog/migration notes, permission diffs, and representative consumer pipelines.