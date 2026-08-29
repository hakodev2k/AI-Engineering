# Incident Escalation Management

## Purpose
Coordinate high-severity customer incidents so technical facts, impact, ownership, communications, escalation, and recovery criteria remain clear while engineering teams diagnose the failure.

## When to use
Use for production outages, severe degradation, data-risk events, or incidents with executive visibility. Do not replace the incident commander or support engineer when those roles exist.

## Inputs
Incident timeline, customer impact, logs, metrics, support case, architecture, recent changes, owners, and escalation policy.

## Context to inspect
Blast radius, affected workloads, mitigations attempted, known changes, dependencies, support severity, communication commitments, and decision authority.

## Core knowledge
A Senior TAM protects signal quality during incidents. The role is to coordinate context, unblock escalation, preserve customer trust, and separate confirmed facts from hypotheses.

## Procedure
1. Confirm severity and customer-visible impact.
2. Establish technical and communication owners.
3. Build a timestamped fact timeline.
4. Ensure diagnostics and reproduction evidence reach the responsible team.
5. Track mitigations, risks, and next decision points.
6. Escalate using documented support paths when progress or impact warrants it.
7. Communicate confirmed status, not speculative root cause.
8. Define recovery and monitoring criteria.
9. After stabilization, capture follow-up actions and RCA expectations.

## Decision points
Escalate when impact, duration, security risk, or blocked ownership exceeds normal support handling. Prefer mitigation before root-cause completion when safe.

## Common failure patterns
Creating parallel command chains, speculating publicly, losing timestamps, changing multiple variables without evidence, or promising recovery times without engineering confirmation.

## Verification
Confirm service recovery with customer-visible evidence and verify follow-up owners, deadlines, and RCA path.

## Expected output
A coordinated incident record with impact, timeline, owners, actions, communications, and follow-up plan.

## Stop conditions
Stop direct intervention when an authorized incident commander takes control; escalate immediately for suspected security or data-loss events.