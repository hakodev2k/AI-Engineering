# Security Case Management

## Purpose
Maintain investigation cases as auditable, reproducible records that coordinate people, evidence, decisions and response actions.

## When to use
Use whenever an alert or report requires work beyond immediate triage.

## Inputs
Alert IDs, evidence references, affected entities, analyst notes, actions, timestamps, owners, severity and escalation policy.

## Context to inspect
Understand case taxonomy, evidence retention, access restrictions, handoff model, legal requirements and incident-management integration.

## Core knowledge
A case is the operational source of truth. Notes must distinguish observation, inference and decision. Evidence should be referenced immutably where possible.

## Procedure
1. Create a case with clear trigger and initial hypothesis.
2. Record authoritative timestamps and affected entities.
3. Link source alerts without duplicating evidence unnecessarily.
4. Maintain a chronological action log.
5. Record queries, results and evidence provenance.
6. Separate facts from analyst interpretation.
7. Track tasks, owners and deadlines.
8. Update scope and severity when evidence changes.
9. Record containment or remediation approvals.
10. Complete closure criteria and lessons for detections/runbooks.

## Decision points
Split cases when events have independent scope/ownership; merge when they are manifestations of one intrusion. Restrict access when evidence contains sensitive employee, customer or legal material.

## Common failure patterns
Narrative-only notes; missing timezone; screenshots without source references; untracked actions; silent severity changes; closing before remediation ownership is established.

## Verification
Audit the case for reproducible evidence, complete timeline, explicit disposition, approvals, owners and closure criteria.

## Expected output
A complete case record suitable for handoff, incident review and audit.

## Stop conditions
Escalate if evidence handling, legal hold, privacy or cross-border constraints are unclear.