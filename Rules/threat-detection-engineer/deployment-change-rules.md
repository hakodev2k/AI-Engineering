# Detection Deployment and Change Rules

## Purpose
Control production rollout of detection changes and preserve reversibility.

## Scope
Applies to new detections, logic changes, severity changes, routing changes, parser dependencies, and production configuration.

## MUST
- Production detection changes MUST have reviewed source, passing validation, deployment owner, and rollback or disable path.
- High-impact changes MUST use staged rollout, shadow evaluation, or equivalent validation when platform capabilities permit.
- Changes that alter alert severity, suppression, or routing MUST be reviewed for operational and security impact.
- Production configuration changes that materially weaken coverage MUST require explicit human approval.

## MUST NOT
- MUST NOT deploy unreviewed critical-rule changes directly to production except through an authorized emergency process.
- MUST NOT delete the previous known-good detection state before rollback is no longer required.
- MUST NOT bundle unrelated detection changes when doing so obscures verification or rollback.

## SHOULD
- Deployments SHOULD record before/after alert metrics and validation evidence.
- Risky changes SHOULD be scheduled when qualified responders are available.

## Exceptions
Emergency changes require incident context, accountable approval, bounded scope, and post-change reconciliation.

## Verification
Inspect change records, CI results, approvals, deployment diffs, rollback evidence, and post-deployment alert behavior.