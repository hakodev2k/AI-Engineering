# Resource Lifecycle

## Purpose
Control replacements, deletions, ordering, and lifecycle behavior that can cause outages or data loss.

## Scope
Terraform lifecycle meta-arguments, replacements, immutable properties, dependencies, and destructive transitions.

## MUST
- Resource replacement risk MUST be understood before apply, especially for stateful or externally addressed resources.
- Destructive transitions MUST have an approved migration, backup, or recovery strategy appropriate to impact.
- `prevent_destroy` SHOULD be used for critical resources when it provides meaningful protection.
- Explicit dependencies MUST be added when Terraform cannot infer a real operational dependency.

## MUST NOT
- `ignore_changes` MUST NOT conceal unmanaged drift without documented ownership and rationale.
- `create_before_destroy` MUST NOT be enabled without checking uniqueness, quota, capacity, and cost constraints.
- Critical resource destruction MUST NOT proceed solely because a plan reports it.

## SHOULD
- Lifecycle rules SHOULD be narrowly scoped and documented when behavior is non-obvious.

## Exceptions
Intentional external management requires a documented source of truth, ownership boundary, drift policy, and review.

## Verification
Inspect replacement indicators in plans, lifecycle blocks, dependency graphs, backups, quotas, migration evidence, and post-apply resource identity and health.