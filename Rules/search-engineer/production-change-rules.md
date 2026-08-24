# Production Change Safety

## Purpose
Control high-risk search changes with explicit authority, reversibility, and verification.

## Scope
Production ranking, schema, cluster, index, model, configuration, data, and deployment changes.

## MUST
- Separate analysis, recommendation, preparation, and execution authority.
- Define expected effect, blast radius, monitoring, rollback trigger, and rollback method for material changes.
- Obtain human approval before production deployment, destructive index/data action, irreversible migration, security weakening, secret rotation, or breaking public contract.
- Verify production health and search-quality guardrails after rollout.

## MUST NOT
- Force push or rewrite shared Git history as part of routine release work.
- make untracked emergency configuration changes without subsequent reconciliation to source control.
- continue a rollout after rollback criteria are met without explicit incident authority.

## SHOULD
- Use progressive delivery, feature flags, aliases, or canaries where they materially reduce blast radius.
- Prefer reversible configuration changes over direct state mutation.

## Exceptions
Emergency execution requires authorized incident context, minimum necessary scope, evidence capture, and retrospective review.

## Verification
Inspect approvals, change records, diffs, deployment telemetry, guardrails, rollback readiness, and post-change validation.