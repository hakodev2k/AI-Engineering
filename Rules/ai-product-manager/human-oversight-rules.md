# Human Oversight Rules

## Purpose
Define when people must review, confirm, or override AI decisions and outputs.

## Scope
Applies to consequential recommendations, automated actions, approvals, escalations, and user control.

## MUST
- Products that can create material financial, legal, safety, employment, access, or reputational impact MUST define human oversight points.
- Human reviewers MUST receive the context and evidence needed to make an independent decision.
- Override, appeal, and escalation paths MUST be defined where users can be materially harmed by model error.
- The system MUST record when automated output was accepted, modified, rejected, or escalated when auditability is required.

## MUST NOT
- MUST NOT label a workflow as human-in-the-loop when humans only rubber-stamp model output.
- MUST NOT remove oversight solely to improve throughput without risk review and approval.
- MUST NOT make users believe a human reviewed an outcome when no such review occurred.

## SHOULD
- Oversight burden SHOULD be concentrated on high-risk or low-confidence cases.
- Review interfaces SHOULD expose uncertainty and relevant provenance without overwhelming reviewers.

## Exceptions
Exceptions require a documented risk assessment, compensating controls, decision authority, and measurable post-launch monitoring.

## Verification
Review workflow diagrams, approval gates, UI behavior, audit logs, escalation policies, and tests for override paths.