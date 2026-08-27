# Network Incident Response Rules

## Purpose
Provide disciplined investigation and recovery for cloud network incidents.

## Scope
Applies to connectivity loss, routing faults, DNS failures, firewall regressions, packet loss, latency, and provider network events.

## MUST
- Incident investigation MUST establish a timeline, affected paths, recent changes, and measurable symptoms.
- Root-cause claims MUST be supported by logs, flow data, route state, packet evidence, provider status, or equivalent evidence.
- Mitigation MUST prioritize service restoration while preserving security boundaries unless an approved emergency exception exists.
- High-risk emergency changes MUST be recorded with owner, rationale, scope, and follow-up remediation.
- Recovery MUST include verification from representative source and destination points.

## MUST NOT
- MUST NOT disable broad network security controls without explicit approval.
- MUST NOT make multiple speculative topology changes simultaneously when isolation of cause is still possible.
- MUST NOT close an incident without confirming service recovery and documenting unresolved risk.

## SHOULD
- Preserve diagnostic evidence before changing transient state where feasible.
- Produce follow-up actions for recurring or systemic causes.

## Exceptions
Emergency exceptions require documented urgency, bounded scope, compensating controls, and retrospective review.

## Verification
Review incident timeline, telemetry, change history, recovery tests, root-cause evidence, and follow-up actions.