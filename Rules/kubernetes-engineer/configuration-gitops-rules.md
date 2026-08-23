# Configuration and GitOps Rules
## Purpose
Keep desired cluster state reviewable, reproducible, and resistant to drift.
## Scope
Manifests, packaging, GitOps controllers, environment configuration, and drift management.
## MUST
- Store desired production configuration in version-controlled, reviewable sources.
- Make environment-specific differences explicit and minimize hidden imperative changes.
- Reconcile or formally record emergency manual changes after stabilization.
- Validate rendered manifests before promotion.
## MUST NOT
- Use direct production edits as the normal deployment mechanism.
- Allow undocumented live-state drift to become the de facto source of truth.
## SHOULD
- Use policy, schema validation, and diff previews before reconciliation.
## Exceptions
Incident-time manual changes require authorization, audit trail, verification, and subsequent source-of-truth reconciliation.
## Verification
Compare live state with desired state, inspect Git history and controller status, and run manifest and policy validation in CI.