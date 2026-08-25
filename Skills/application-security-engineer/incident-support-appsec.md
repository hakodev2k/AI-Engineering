# Application Security Incident Support

## Purpose
Provide application-level expertise during security incidents while preserving evidence and prioritizing containment over speculative fixes.

## When to use
Use for suspected account takeover, application exploitation, credential leakage, malicious uploads, unauthorized data access, or vulnerability exploitation.

## Inputs
Incident timeline, alerts, logs, affected versions, architecture, code, identities, deployment history, and known indicators.

## Context to inspect
Inspect request/audit logs, authentication events, deployment changes, vulnerable code paths, data access, secrets, and external integrations. Coordinate with the incident commander.

## Core knowledge
Incident response separates containment, eradication, recovery, and lessons learned. Application changes during incidents must preserve evidence and avoid expanding blast radius.

## Procedure
1. Confirm role, incident command, scope, and evidence-handling requirements.
2. Translate observed indicators into candidate application exploit paths.
3. Identify affected versions, endpoints, identities, and data.
4. Recommend reversible containment: disable feature, restrict route, revoke credential, or tighten policy as appropriate.
5. Preserve relevant logs/configuration before destructive changes where feasible.
6. Validate root cause using safe reproduction.
7. Implement durable remediation and variant search.
8. Add detection and regression tests.
9. Support recovery validation and post-incident review.

## Decision points
Containment speed may outweigh availability when impact is severe; the incident commander owns that trade-off. Prefer reversible controls until root cause is established.

## Common failure patterns
Patching before preserving evidence, uncoordinated production changes, assuming one indicator proves root cause, and restoring service without closing the exploit path.

## Verification
Confirm containment blocks observed behavior, durable fix blocks reproduction, affected credentials are rotated where needed, and monitoring covers recurrence.

## Expected output
Application-level incident analysis, containment guidance, durable fix, and evidence-backed recovery checks.

## Stop conditions
Escalate immediately for material breach indicators, destructive actions, legal/forensic requirements, or changes outside assigned incident authority.