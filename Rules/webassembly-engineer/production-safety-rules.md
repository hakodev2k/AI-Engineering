# Production Safety Rules

## Purpose
Control operational risk when deploying or changing WebAssembly workloads and runtimes.

## Scope
Applies to production deployment, runtime configuration, capability policy, rollback, migrations, and emergency changes.

## MUST
- Production changes MUST have defined verification and rollback criteria before execution.
- Runtime, capability, and resource-limit changes MUST be reviewed for blast radius.
- New module versions MUST be identifiable independently from deployment configuration.
- High-risk production deployment or security-control changes MUST require human approval.
- Rollback MUST account for interface and state compatibility, not only binary replacement.

## MUST NOT
- An AI agent MUST NOT silently execute production deployment, capability expansion, secret rotation, destructive data action, or security weakening beyond granted authority.
- Production safety controls MUST NOT be disabled merely to unblock a release.
- A rollback MUST NOT be attempted when it would corrupt incompatible state without an approved recovery strategy.
- Unverified experimental runtime features MUST NOT be enabled globally in production.

## SHOULD
- Use canary or staged rollout for material runtime/module changes.
- Keep previous known-good artifacts available for bounded rollback windows.
- Automate post-deployment health checks.

## Exceptions
Emergency changes require incident context, authorized approval, minimal scope, explicit rollback thinking, and retrospective verification.

## Verification
Review deployment records, approvals, capability/runtime diffs, rollback procedures, canary telemetry, and post-deployment checks. Confirm dangerous actions are technically or procedurally gated.