# Incident Command and Response

## Purpose
Provide a disciplined operating model for controlling production incidents, reducing time to mitigation, and preventing coordination failure under pressure.

## When to use
Use for high-severity outages, widespread degradation, data-integrity risk, security-adjacent operational failures, or incidents involving multiple teams. Do not invoke full incident command for routine low-risk defects that can be handled through normal ownership.

## Inputs
Current symptoms, impact scope, telemetry, recent changes, dependency status, responders, communication channels, and escalation paths.

## Preconditions
Severity definitions, responder contacts, and an agreed incident communication channel should exist. If they do not, establish minimal equivalents immediately.

## Context to inspect
Service health, SLO impact, recent deployments/configuration changes, dependency dashboards, queue depth, database health, regional status, customer reports, and known failure modes.

## Core knowledge
An incident needs clear roles: incident commander, technical leads, communications owner, and scriber when scale warrants it. The immediate goal is mitigation and stabilization, not root-cause perfection. Parallel investigation is useful only when ownership and hypotheses are explicit.

## Procedure
1. Confirm customer or business impact and assign severity.
2. Establish an incident commander and a single coordination channel.
3. Record a timestamped timeline from the first known symptom.
4. Freeze risky unrelated changes when appropriate.
5. Form a small set of evidence-backed hypotheses.
6. Assign owners to investigate independent paths.
7. Prefer reversible mitigations: rollback, traffic shift, feature disablement, capacity increase, dependency bypass.
8. Validate each mitigation against user-facing telemetry.
9. Communicate status at a predictable cadence.
10. Escalate to vendors, security, data, or leadership when thresholds are met.
11. Declare stabilization only after metrics remain healthy for a defined observation period.
12. Capture follow-up actions and evidence for post-incident review.

## Decision points
Rollback when a recent change is plausibly causal and rollback risk is lower than continued impact. Fail over when the alternate path is known-good and capacity is sufficient. Avoid speculative multi-variable changes that destroy diagnostic evidence.

## Common failure patterns
Too many people issuing commands, troubleshooting without a timeline, optimizing root-cause analysis before mitigation, silent status gaps, untested failover, and closing the incident before observing stability.

## Verification
Confirm impact metrics recover, SLO burn returns to normal, queues/backlogs drain, error rates stay stable, and no hidden secondary failure remains.

## Expected output
A controlled incident timeline, mitigation record, stakeholder communications, stabilization evidence, and clearly owned follow-up items.

## Stop conditions
Escalate immediately when data loss, security compromise, regulatory exposure, destructive remediation, or unclear ownership exceeds the responder team’s authority.