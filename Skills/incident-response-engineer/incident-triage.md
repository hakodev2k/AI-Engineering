# Incident Triage

## Purpose
Rapidly determine incident severity, scope, ownership, and the safest next actions while preserving evidence and reducing harm.

## When to use
Use when alerts, user reports, security signals, outages, data anomalies, or operational failures may represent a material incident. Do not use routine triage as a substitute for deep root-cause analysis after stabilization.

## Inputs
Alerts, logs, traces, metrics, user reports, deployment history, architecture context, runbooks, dependency status, and business impact information.

## Preconditions
Confirm authorized access to operational evidence and identify the incident communication channel and decision owner where available.

## Context to inspect
Review affected services, recent changes, dependencies, blast radius, customer impact, security implications, data integrity, regional scope, and known failure modes.

## Core knowledge
Senior triage prioritizes impact and containment over premature diagnosis. Severity should reflect actual or credible business impact, not alert volume. Preserve timestamps, correlation IDs, and evidence needed for later investigation.

## Procedure
1. Record the initial signal and time.
2. Confirm whether symptoms are reproducible or independently observable.
3. Identify affected users, systems, regions, and data.
4. Check recent deployments, configuration changes, and dependency incidents.
5. Classify availability, integrity, confidentiality, safety, and financial impact.
6. Assign a provisional severity using established criteria.
7. Establish an incident owner and required specialist roles.
8. Select immediate containment or mitigation actions with reversible options first.
9. Record hypotheses separately from verified facts.
10. Define the next evidence-gathering actions and reassessment time.

## Decision points
Escalate severity when blast radius or uncertainty is high. Prefer rollback when a recent reversible change strongly correlates with impact; prefer targeted mitigation when rollback introduces greater risk.

## Common failure patterns
Chasing the first hypothesis, changing multiple variables simultaneously, ignoring dependency failures, losing evidence, underestimating data impact, and delaying escalation while searching for certainty.

## Verification
Verify severity against observed impact, confirm ownership, ensure mitigation actions are tracked, and confirm evidence supports each declared fact.

## Expected output
A concise triage record containing impact, severity, scope, owner, verified facts, hypotheses, immediate actions, and next checkpoints.

## Stop conditions
Escalate immediately when privileged access is required, destructive action is proposed, regulated data may be exposed, safety is affected, or available evidence cannot bound the incident.