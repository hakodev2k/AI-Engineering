# Marketing Operations Change Safety Rules

## Purpose
Prevent high-impact failures when changing marketing automation, tracking, routing, data flows, or shared campaign infrastructure.

## Scope
Applies to CRM and marketing-automation configuration, tracking schemas, audience syncs, routing rules, templates, integrations, and production campaign operations.

## MUST
- Material operational changes MUST define scope, owner, expected behavior, validation steps, and rollback or recovery approach.
- Production-affecting changes MUST be tested in a safe environment or with a bounded rollout where feasible.
- Changes to tracking, consent, routing, or shared automation MUST be reviewed for downstream effects before release.
- High-risk changes MUST require human approval before execution.
- Incidents caused by marketing operations changes MUST preserve evidence for root-cause analysis and corrective action.

## MUST NOT
- MUST NOT modify shared production automation without understanding dependent journeys and audiences.
- MUST NOT disable consent, suppression, security, or audit controls to unblock a launch.
- MUST NOT execute irreversible bulk changes without verified backups, exports, or equivalent recovery evidence.
- MUST NOT claim a production issue is resolved without validating customer-facing and downstream behavior.

## SHOULD
- Changes SHOULD be small, reversible, observable, and scheduled to allow verification.
- Repeated manual operations SHOULD be automated only after controls and failure modes are understood.

## Exceptions
Exceptions require documented urgency, risk, compensating controls, named approver, verification plan, and follow-up review.

## Verification
Inspect change records, diffs or configuration history, test evidence, approvals, monitoring, rollback artifacts, incident records, and post-change validation.