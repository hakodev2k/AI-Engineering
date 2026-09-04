# GPU Change Approval and Production Safety Rules

## Purpose
Keep high-impact accelerator infrastructure actions within explicit human authority and make risky changes reviewable, reversible, and evidence-based.

## Scope
Applies to production deployments, scheduler policy, firmware and driver rollouts, fabric changes, destructive maintenance, access changes, capacity removal, and security controls.

## MUST
- The actor MUST distinguish analyze, recommend, prepare, and execute; authorization for one stage MUST NOT imply authorization for another.
- Human approval MUST be obtained before production-wide driver or firmware rollout, destructive maintenance, major scheduler or quota changes, infrastructure destruction, high-risk access changes, or weakening security controls.
- High-risk changes MUST document expected impact, blast radius, prerequisites, validation gates, rollback or containment, and evidence supporting the change.
- Production changes MUST be attributable through version control, change records, or equivalent audit evidence.
- Abort criteria MUST be defined before changes whose failure can remove substantial GPU capacity.

## MUST NOT
- An AI agent MUST NOT silently execute destructive, irreversible, or authority-expanding actions.
- Forceful remediation MUST NOT bypass established approval simply because automation can perform it.
- Security controls MUST NOT be weakened to meet utilization or delivery targets without explicit security approval.

## SHOULD
- Changes SHOULD be canaried and progressively expanded when the infrastructure supports staged rollout.
- Reversible alternatives SHOULD be preferred when they achieve the same objective.

## Exceptions
Emergency execution requires explicitly authorized incident procedures, documented authority, scope, evidence, and retrospective review.

## Verification
Review approvals, diffs, deployment records, audit logs, canary gates, rollback tests, incident procedures, and evidence that execution stayed within authorized scope.