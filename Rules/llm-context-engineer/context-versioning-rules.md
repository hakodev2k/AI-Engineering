# Context Versioning Rules

## Purpose
Make context behavior reproducible across changes to schemas, ranking, transformations, and assembly policy.

## Scope
Context schema versions, retrieval configurations, ranking models, templates, transformations, and migrations.

## MUST
- Material context behavior changes MUST have a versioned configuration or equivalent immutable identifier.
- Production traces MUST identify the context configuration version used.
- Breaking schema changes MUST provide a migration strategy for dependent components.
- Evaluation results MUST be associated with the exact context version tested.
- Rollback MUST restore a known compatible configuration.

## MUST NOT
- MUST NOT change production context semantics through untracked configuration edits.
- MUST NOT compare evaluation results from different configurations without identifying the difference.
- MUST NOT remove versions still required for active rollback without review.

## SHOULD
- Keep context configuration changes independently deployable where practical.
- Prefer declarative versioned policy over hidden runtime defaults.

## Exceptions
Emergency changes require auditability and retrospective version capture.

## Verification
Inspect configuration history, deployment metadata, traces, rollback tests, and evaluation records.