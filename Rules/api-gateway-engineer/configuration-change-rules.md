# Configuration Change Safety

## Purpose
Make gateway configuration changes reviewable, reproducible, and reversible.

## Scope
Routes, plugins, policies, certificates, limits, upstreams, and runtime configuration.

## MUST
- Production-affecting configuration MUST be version-controlled or otherwise auditable with actor, time, and exact change.
- Changes MUST pass syntax, semantic, and policy validation before deployment.
- High-risk changes MUST define rollback and post-change verification.
- Production configuration changes MUST require human approval when organizational policy or risk level requires it.

## MUST NOT
- MUST NOT make undocumented manual production edits as a normal delivery path.
- MUST NOT deploy configuration known to reference missing dependencies.
- MUST NOT bypass validation gates solely to accelerate routine changes.

## SHOULD
- Configuration SHOULD be promoted through representative non-production validation.
- Generated configuration SHOULD retain a traceable source of truth.

## Exceptions
Emergency changes require incident linkage, minimum necessary scope, approval where feasible, and reconciliation back to source control.

## Verification
Inspect diffs, CI results, policy checks, deployment audit logs, runtime config, synthetic probes, and rollback readiness.