# Security Audit Logging

## Purpose
Design platform audit logging that provides trustworthy evidence of privileged actions, identity decisions, policy changes, and security-relevant events without leaking sensitive data.

## When to use
Use when building control-plane services, reviewing incident visibility, meeting audit requirements, or standardizing security telemetry across platform components.

## Inputs
Platform APIs, IAM events, policy engines, deployment systems, secret managers, data stores, log pipeline, retention requirements, and incident-response needs.

## Context to inspect
Inspect event producers, timestamp integrity, actor identity, tenant context, resource identifiers, before/after state, log access permissions, redaction, retention, and tamper resistance.

## Core knowledge
Audit logs must answer who did what, to which resource, under which effective identity, from what context, and whether the action succeeded. They should be harder to alter than ordinary application logs and should avoid containing reusable secrets.

## Procedure
1. Define security-relevant events and investigation questions.
2. Standardize actor, effective identity, tenant, action, resource, result, request ID, and timestamp fields.
3. Capture privilege elevation, authorization denials, policy changes, secret access, deployments, and administrative mutations.
4. Record both human and machine actors.
5. Redact credentials, tokens, and unnecessary sensitive payloads.
6. Forward critical audit events to protected centralized storage.
7. Restrict deletion and modification rights separately from producer rights.
8. Define retention by investigation and compliance needs.
9. Correlate events across APIs, CI/CD, identity, and runtime systems.
10. Alert on high-risk patterns without relying solely on volume thresholds.
11. Test event completeness during representative privileged operations.
12. Periodically validate parsers, timestamps, retention, and access controls.

## Decision points
Prefer structured immutable events over free-text logs for high-value actions. Store full request bodies only when justified and safe; otherwise record stable identifiers and hashes.

## Common failure patterns
Missing effective identity, logs only for successful actions, secrets in payloads, local-only audit trails, inconsistent timestamps, and administrators able to erase their own history.

## Verification
Perform controlled privileged actions and confirm end-to-end event capture, correlation, redaction, access control, retention, and alert behavior.

## Expected output
A consistent audit schema, protected log pipeline, useful detections, and investigation-ready evidence.

## Stop conditions
Stop and escalate when critical privileged operations leave no reliable evidence, audit data contains exposed credentials, or log administrators can silently modify required records.