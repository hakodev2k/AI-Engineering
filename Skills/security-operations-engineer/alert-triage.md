# Alert Triage

## Purpose
Rapidly determine whether an alert represents benign activity, suspicious behavior or a security incident while preserving evidence and uncertainty.

## When to use
Use for SIEM, EDR, identity, cloud and application security alerts.

## Inputs
Alert payload, rule logic, entity context, surrounding telemetry, asset criticality, identity risk and prior related activity.

## Context to inspect
Read the detection rationale before judging the event. Inspect affected user/host/resource, timeline, parent-child process or session context, network activity, changes and known maintenance.

## Core knowledge
Triage is hypothesis testing, not alert closure. Absence of evidence in one data source is not evidence of absence. Confidence and impact are separate dimensions.

## Procedure
1. Validate the alert is technically well-formed.
2. Reconstruct what triggered the rule.
3. Establish entity ownership and criticality.
4. Build a narrow timeline around the trigger.
5. Test benign explanations using evidence.
6. Search for corroborating or contradictory signals.
7. Expand scope to adjacent entities only when justified.
8. Assign disposition and confidence.
9. Escalate when incident criteria are met.
10. Record evidence, queries and reasoning sufficient for another analyst to reproduce the decision.
11. Feed recurring false positives to detection tuning.

## Decision points
Escalate earlier for privileged identities, crown-jewel assets, destructive behavior or active persistence. Avoid deep investigation of low-confidence noise when a rule defect is already proven.

## Common failure patterns
Closing on user assertion alone; trusting process names; ignoring cloud control-plane activity; changing evidence; endless query expansion; weak case notes.

## Verification
A peer can reproduce the disposition from recorded evidence, and all required escalation/routing actions occurred.

## Expected output
A defensible disposition with confidence, scope, evidence, timeline and next action.

## Stop conditions
Escalate immediately when containment may be time-critical, evidence access is insufficient or activity affects regulated/high-impact systems.