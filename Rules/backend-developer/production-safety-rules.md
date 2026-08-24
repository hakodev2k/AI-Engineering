# Production Safety Rules

## Purpose
Prevent backend changes and operations from causing avoidable production outages, data loss, security regressions, or irreversible damage.

## Scope
Deployments, configuration changes, destructive actions, feature rollout, rollback, incident mitigation, and operational access.

## MUST
- Production-impacting changes MUST have an explicit verification and rollback or containment strategy.
- Destructive data operations, security-control weakening, irreversible migrations, and high-risk access changes MUST require human approval before execution.
- Rollouts that can materially affect availability or correctness MUST use staged exposure, feature controls, or equivalent blast-radius reduction where practical.
- Production conclusions MUST be based on logs, metrics, traces, alerts, database evidence, or equivalent operational data.
- Configuration and environment changes MUST be reviewable and auditable.

## MUST NOT
- MUST NOT force push or rewrite shared production branch history as an operational shortcut.
- MUST NOT disable security or reliability controls solely to unblock a release.
- MUST NOT perform destructive SQL or data deletion without an approved recovery strategy.
- MUST NOT report a production fix as successful before post-change verification.

## SHOULD
- Prefer reversible changes and incremental rollout over one-way cutovers.
- High-risk changes SHOULD have explicit stop conditions and named ownership.

## Exceptions
Emergency actions require incident context, authorized approver, bounded scope, immediate verification, and retrospective review.

## Verification
Review deployment records, approvals, feature rollout configuration, rollback evidence, production telemetry, audit logs, and incident documentation.