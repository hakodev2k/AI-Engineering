# Workflow: Production Release

## Trigger
Production release or hotfix.

## Goal
Promote one known artifact to production with controlled blast radius and observable success.

## Inputs
Release contract, immutable artifact, test/security evidence, target, deployment strategy, monitoring, recovery plan, approvals.

## Stages
1. Freeze scope and artifact identity.
2. Check dependency/environment readiness.
3. Run required pre-release quality gates in parallel where independent.
4. Perform risk review and determine approval class.
5. Obtain human approval when required.
6. Establish checkpoint: target health, current version, recovery prerequisites.
7. Deploy through one accountable executor.
8. Observe configured health and user-impact indicators.
9. If thresholds fail, invoke `deployment-recovery.md`.
10. Verify deployed identity and required behavior independently.
11. Close with release evidence, residual risk, and owner.

## Dependencies
Artifact creation precedes release. Approval precedes high-risk production mutation. Verification follows deployment/observation.

## Parallel steps
Security result collection, test evidence review, dependency status, and monitoring readiness can run concurrently before approval.

## Retry
Only verified transient deployment control-plane/transport failure may retry, maximum configured attempts.

## Escalation
Escalate on data integrity risk, unknown migration compatibility, critical security issue, artifact mismatch, or missing authorized approver.

## Definition of Done
Correct artifact deployed; health window passed; required gates/approvals recorded; recovery state known; residual risk owned.