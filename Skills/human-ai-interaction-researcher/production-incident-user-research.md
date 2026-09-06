# Production Incident User Research

## Purpose
Investigate the human and interaction dimensions of AI production incidents to understand detection, interpretation, reliance, recovery, and workflow conditions that contributed to impact.

## When to use
Use after material AI-related incidents, clusters of user complaints, unexpected harmful behavior, or operational failures involving human-AI coordination.

## Inputs
Incident timeline, logs, affected workflows, support reports, system versions, safeguards, user communications, and authorized participant access.

## Context to inspect
Inspect technical root-cause evidence, model/tool configuration, alerts, UI states, user actions, permissions, escalation paths, and changes preceding the incident.

## Core knowledge
Incident research complements technical root-cause analysis. A technical defect may become harmful because users cannot detect it, interface cues encourage reliance, recovery is costly, or organizational processes delay escalation. Avoid blaming users for predictable behavior under system conditions.

## Procedure
1. Coordinate with incident command and preserve investigation boundaries.
2. Build a factual timeline from available technical and support evidence.
3. Identify human decisions and interaction states relevant to propagation or containment.
4. Recruit affected or representative users only when appropriate and authorized.
5. Reconstruct what information users had at each decision point.
6. Examine expectations, detection cues, verification, escalation, and recovery.
7. Identify latent workflow and design conditions, not just proximal actions.
8. Compare incident behavior with intended operating procedures.
9. Propose mitigations across model, interface, permissions, monitoring, training, and process.
10. Feed findings into regression scenarios and future research.

## Decision points
Use direct affected-user interviews when recall and impact justify it; simulations when re-exposure would be harmful; telemetry when behavior can be reconstructed without participant burden.

## Common failure patterns
Blaming the last human action, interviewing before facts are stable, exposing confidential incident details, focusing only on UI, and failing to test mitigations against recurrence.

## Verification
Ensure human-factor findings align with the incident timeline and are incorporated into concrete preventive or recovery controls with owners.

## Expected output
A human-factors incident analysis with contributing conditions, user evidence, propagation mechanisms, recovery gaps, and prevention recommendations.

## Stop conditions
Stop when the incident investigation prohibits participant contact, legal or security restrictions apply, evidence preservation would be compromised, or participant welfare could be harmed.