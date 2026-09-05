# Incident Compliance and Notification

## Purpose
Integrate regulatory, contractual, audit, and evidence obligations into AI incident response so technical containment does not omit required compliance actions.

## When to use
Use for AI incidents involving harmful outputs, data exposure, unauthorized actions, significant outages, model defects, policy violations, or customer-impacting failures.

## Inputs
Incident timeline, severity, affected users and regions, data categories, model/provider involvement, contracts, applicable notification rules.

## Preconditions
Incident ownership and evidence preservation are active.

## Context to inspect
Incident runbooks, legal notification thresholds, customer contracts, regulator obligations, vendor notification terms, audit logs, prior assessments.

## Core knowledge
Different obligations can define different clocks, thresholds, recipients, and content requirements. Early facts may be uncertain, so compliance response must preserve evidence and track what is known versus hypothesized.

## Procedure
1. Classify the incident’s compliance dimensions.
2. Identify affected jurisdictions, contracts, and stakeholders.
3. Preserve required evidence and decision records.
4. Determine applicable notification thresholds and deadlines.
5. Coordinate with security, privacy, safety, legal, and communications owners.
6. Track facts, uncertainty, and impact estimates.
7. Prepare required notices using approved channels.
8. Record notification decisions, including decisions not to notify.
9. Link remediation to affected controls.
10. Update risk assessments and lessons learned.

## Decision points
Escalate early when notification clocks may apply even before full root cause is known. Do not delay containment to complete compliance analysis.

## Common failure patterns
Starting notification analysis too late, losing model/prompt versions, mixing speculation with facts, overlooking contractual notices, and failing to document a non-notification decision.

## Verification
Confirm all applicable deadlines, recipients, evidence, and decision approvals are documented and reconciled after closure.

## Expected output
A compliance incident record with obligations, deadlines, decisions, notices, evidence, remediation links, and follow-up actions.

## Stop conditions
Escalate immediately when legal reporting thresholds, cross-border incidents, regulated data, or severe safety impacts may apply.