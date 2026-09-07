# Deliverability Incident Response

## Purpose
Restore safe email delivery during provider blocks, reputation collapses, queue failures, authentication breakage, or abnormal complaints while preserving evidence and protecting critical traffic.

## When to use
Use when delivery SLOs breach, a provider blocks/throttles traffic, complaint/bounce rates spike, authentication fails broadly, or sending infrastructure is compromised.

## Inputs
Incident timeline, affected message classes, provider metrics, SMTP responses, authentication state, queues, recent changes, complaint/bounce data, and security signals.

## Preconditions
Assign an incident owner and establish authority to pause risky traffic.

## Context to inspect
Inspect provider segmentation, domain/IP scope, recent deployments/DNS changes, traffic spikes, recipient sources, credentials, event-pipeline health, and critical-message dependencies.

## Core knowledge
Continuing harmful bulk traffic can deepen reputation damage. Emergency provider/IP switching can also worsen outcomes if replacement identities are cold. Containment and evidence precede optimization.

## Procedure
1. Declare scope, impact, start time, and affected identities/providers.
2. Validate telemetry and capture exact SMTP/provider evidence.
3. Protect critical transactional traffic by throttling or pausing discretionary streams.
4. Check for compromised credentials, unexpected volume, list imports, and DNS/authentication changes.
5. Roll back the smallest recent change supported by evidence.
6. Apply provider-specific rate reductions or queue controls.
7. Avoid identity rotation unless a pre-warmed approved failover exists.
8. Communicate user/business impact and current mitigations.
9. Verify recovery through real provider-segmented evidence.
10. Restore volume gradually.
11. Complete root-cause analysis and preventive actions.

## Decision points
Pause bulk traffic early when complaints, compromise, or severe blocks are confirmed. Fail over only when the alternate path is operationally ready and preserves suppression/authentication.

## Common failure patterns
Changing many variables, deleting logs, full-volume failover to cold IPs, retry storms, blaming content without evidence, and declaring recovery after API acceptance alone.

## Verification
Confirm critical SLO recovery, provider acceptance/deferral normalization, authentication, queue drain, complaint/bounce stabilization, and no recurrence during staged restoration.

## Expected output
An incident record with evidence, containment, root cause, recovery proof, and durable corrective actions.

## Stop conditions
Escalate immediately for suspected compromise, legal/privacy exposure, or provider enforcement requiring account-level intervention.