# Production Change Rules

## Purpose
Control high-risk Azure changes and preserve human authority over destructive actions.

## Scope
Production configuration, infrastructure changes, deletions, migrations, access changes, rotations, and emergency actions.

## MUST
- Classify production changes by blast radius, reversibility, dependency impact, and security risk.
- Prepare validation and rollback or containment before material changes.
- Require human approval before destructive resource deletion, irreversible migration, infrastructure destruction, secret rotation with consumer impact, major access escalation, or weakening security controls.
- Verify the exact subscription, resource, environment, and intended change before execution.
- Capture change evidence and post-change validation.

## MUST NOT
- Treat analysis, recommendation, or preparation as authorization to execute.
- Execute destructive commands from ambiguous resource context.
- Remove safeguards merely to make an automation succeed.

## SHOULD
- Prefer reversible, incremental, and observable changes.

## Exceptions
Emergency authority must be predefined or explicitly granted and followed by retrospective review.

## Verification
Inspect approvals, plans, diffs, command targets, deployment logs, audit records, rollback readiness, and post-change checks.