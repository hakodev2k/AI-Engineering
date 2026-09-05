# Incident-Ready Release Procedures

## Purpose
Prepare releases so responders can contain, diagnose, and recover from failures without discovering missing ownership, controls, or evidence during an incident.

## When to use
Use for high-impact, high-traffic, safety-sensitive, agentic, or provider-dependent releases.

## Inputs
Release plan, severity model, on-call ownership, rollback controls, kill switches, dashboards, communication paths.

## Preconditions
Production responders and escalation routes are known.

## Context to inspect
Runbooks, feature flags, model routes, tool shutdown controls, queue management, provider status, audit logs, customer-impact channels, and known failure modes.

## Core knowledge
A release is operationally incomplete if responders cannot identify the active artifact set, stop harm, or restore a safe mode quickly. AI incidents may require model, prompt, data, safety, security, and infrastructure specialists simultaneously.

## Procedure
1. Identify plausible severe failure scenarios.
2. Assign primary and backup responders.
3. Validate kill switches, traffic controls, and rollback commands.
4. Ensure queued agent work can be stopped or quarantined.
5. Link dashboards and representative traces in the runbook.
6. Define severity triggers and escalation routes.
7. Predefine safe degraded modes.
8. Confirm provider and dependency contacts where applicable.
9. Conduct a tabletop or rehearsal for high-risk releases.
10. Keep the release owner available through the observation window.

## Decision points
Require a formal rehearsal when failure can cause irreversible external actions, cross-tenant exposure, or broad safety impact.

## Common failure patterns
Release owner unavailable, untested kill switch, rollback requiring undocumented permissions, queues continuing after UI shutdown, and no safe degraded state.

## Verification
Perform a dry run of detection, containment, rollback, and responder handoff using the candidate environment.

## Expected output
An incident-ready release runbook with owners, controls, scenarios, and validated recovery steps.

## Stop conditions
Stop release when a critical scenario lacks a named responder, containment control, or recovery path.