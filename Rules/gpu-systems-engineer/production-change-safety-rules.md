# Production Change Safety Rules

## Purpose
Control high-impact accelerator changes and preserve safe rollback.

## Scope
Production deployments, drivers, firmware, runtime libraries, scheduler policy, power settings, device partitioning, and fleet configuration.

## MUST
- Production GPU changes MUST define expected impact, validation, monitoring, and rollback before execution.
- High-risk changes MUST use staged or canary rollout when technically feasible.
- Human approval MUST precede production driver/firmware changes, destructive fleet actions, isolation weakening, unsupported power/clock changes, and irreversible compatibility breaks.
- Rollback feasibility MUST be verified rather than assumed.
- Post-change health and workload SLOs MUST be checked before expansion.

## MUST NOT
- MUST NOT force rollout through unexplained correctness, health, or performance regressions.
- MUST NOT combine unrelated high-risk changes when doing so prevents attribution.
- MUST NOT let an AI agent silently escalate from analysis/preparation to production execution.

## SHOULD
- Prefer reversible configuration changes and small blast radius.
- Schedule risky maintenance with recovery capacity available.

## Exceptions
Emergency mitigation requires incident authority, explicit risk acceptance, monitoring, and retrospective review.

## Verification
Review approvals, diffs, canary evidence, rollback tests, deployment records, health metrics, and SLO checks.