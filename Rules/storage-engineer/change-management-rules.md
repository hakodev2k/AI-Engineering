# Storage Change Management Rules

## Purpose
Control production risk from storage configuration, firmware, topology, and lifecycle changes.

## Scope
Production changes to storage systems, clients, fabrics, firmware, policies, and automation.

## MUST
- Production changes MUST define scope, expected effect, prerequisites, validation, rollback, and owner.
- High-risk changes MUST assess redundancy and recovery posture before execution.
- Destructive changes, irreversible migrations, production configuration changes, and security weakening MUST require human approval.
- Post-change validation MUST confirm user-visible and backend health.

## MUST NOT
- MUST NOT combine unrelated high-risk changes when doing so obscures rollback or diagnosis.
- MUST NOT bypass change controls merely because an automation can execute the action.
- MUST NOT force changes through an unhealthy or degraded storage system without explicit incident authority.

## SHOULD
- Prefer canary, staged, and reversible changes with automated prechecks.

## Exceptions
Emergency changes require incident authority, recorded rationale, and retrospective review.

## Verification
Inspect change records, approvals, diffs, prechecks, rollout telemetry, validation, and rollback evidence.