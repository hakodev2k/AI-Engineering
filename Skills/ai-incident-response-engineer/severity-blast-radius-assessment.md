# Severity and Blast Radius Assessment

## Purpose
Assess AI incident severity using user harm, safety, security, privacy, operational impact, reversibility, and rate of spread rather than uptime alone.

## When to use
Use immediately after intake and whenever scope or consequences change. Reassess after containment, rollback, or new evidence.

## Inputs
Affected users and tenants, model/version, workflow, error and safety metrics, audit logs, tool actions, data exposure indicators, geographic scope, business criticality.

## Preconditions
A live incident record exists and evidence can be gathered without altering production state.

## Context to inspect
SLOs, severity policy, tenant isolation, model/provider dependencies, privileged tools, regulated-data paths, feature flags, recent deployments.

## Core knowledge
AI failures may be probabilistic, segment-specific, delayed, or hidden behind apparently healthy infrastructure. Blast radius includes who can be harmed, what actions were executed, what data crossed boundaries, how rapidly the issue propagates, and whether effects are reversible.

## Procedure
1. Identify impacted capabilities and user journeys.
2. Quantify affected requests, sessions, users, tenants, and regions.
3. Separate observed impact from plausible worst-case exposure.
4. Check for irreversible external actions.
5. Check safety, security, and privacy escalation criteria.
6. Determine whether autonomous behavior can continue without oversight.
7. Estimate growth rate and time-to-harm.
8. Assign severity from documented policy.
9. Record evidence and uncertainty.
10. Re-evaluate after each major mitigation.

## Decision points
Escalate when uncertainty is high but potential harm is high. Prefer the higher severity when delayed consequences or hidden exposure are plausible.

## Common failure patterns
Using only error rate; ignoring one high-risk tenant; assuming a provider issue has uniform impact; treating reversible UI errors like irreversible tool actions; downgrading before observing stability.

## Verification
Cross-check scope with at least two independent evidence sources when possible and confirm severity criteria explicitly.

## Expected output
A severity decision with blast-radius estimate, uncertainty, escalation path, and reassessment triggers.

## Stop conditions
Escalate immediately when regulated data, unauthorized actions, severe safety harm, or unclear blast radius is involved.