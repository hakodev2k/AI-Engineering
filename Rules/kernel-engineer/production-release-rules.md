# Production and Release Safety Rules

## Purpose
Control operational risk when kernel changes reach production systems.

## Scope
Deployment, rollout, rollback, configuration, live updates, reboot-required changes, and production incident readiness.

## MUST
- Production deployment MUST require explicit human authorization.
- Release plans MUST identify affected hardware/configurations, validation evidence, monitoring signals, and rollback conditions.
- Changes that can prevent boot or storage/network access MUST have a tested recovery path.
- Configuration changes affecting isolation, security, or hardware behavior MUST be reviewed as code-equivalent production changes.
- Rollouts SHOULD begin with limited exposure when blast radius can be reduced.

## MUST NOT
- MUST NOT deploy an unverified kernel artifact directly to broad production.
- MUST NOT remove the last known-good boot/recovery option during a risky rollout.
- MUST NOT weaken security controls to resolve a deployment issue without explicit approval.
- MUST NOT claim rollout success without observing defined health signals.

## SHOULD
- Preserve artifact provenance and exact build/configuration identity.
- Use staged rollout and automatic health gating where infrastructure supports it.
- Production diagnostics SHOULD be collected before rollback when safe and useful.

## Exceptions
Emergency changes require authorized incident leadership, explicit risk acceptance, recovery plan, and post-change validation.

## Verification
Inspect release approvals, artifact identity, configuration diffs, staged health metrics, recovery tests, rollback evidence, and post-deployment monitoring.