# Audit Logging and Detection

## Purpose
Create actionable Kubernetes API audit evidence for investigations, detections, compliance, and accountability.

## When to use
Use when designing cluster logging, privileged-action detection, incident response, or audit retention.

## Inputs
Audit policy/configuration, log destination, retention requirements, threat scenarios, privacy constraints, and SIEM capabilities.

## Preconditions
Define which events are security-relevant and what sensitive request/response data must not be logged.

## Context to inspect
Inspect authentication metadata, user/impersonation identity, verbs, resources, namespaces, response codes, request stages, sensitive resources, and log transport integrity.

## Core knowledge
Audit verbosity trades forensic detail against volume, latency, cost, and sensitive-data exposure. Metadata-level events often provide strong security value without logging secret bodies.

## Procedure
1. Map critical actions and identities.
2. Define audit levels per resource/action.
3. Exclude unnecessary high-volume noise deliberately.
4. Protect transport and storage.
5. Set retention aligned to investigation needs.
6. Build detections for privilege changes, secret access, exec, impersonation, policy changes, and unusual admin activity.
7. Correlate with cloud/runtime logs.
8. Test detection and forensic queries.

## Decision points
Increase request detail only where investigation value exceeds data-sensitivity and cost risks. Keep high-risk administrative actions at sufficient fidelity.

## Common failure patterns
No audit logs; logging secret payloads; excessive noise; short retention; missing impersonation fields; alerts without owner/context.

## Verification
Perform controlled privileged actions and confirm complete searchable events and expected alerts.

## Expected output
A cost-aware audit policy, protected retention, and tested security detections.

## Stop conditions
Escalate if critical administrative actions cannot be attributed or logs can be modified by routine workload identities.