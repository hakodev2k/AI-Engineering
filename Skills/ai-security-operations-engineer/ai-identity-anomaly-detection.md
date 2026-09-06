# AI Identity Anomaly Detection

## Purpose
Detect compromised, shared, automated, or misused identities interacting with AI systems, especially where identity controls authorize access to sensitive models, data, or tools.

## When to use
Use for authenticated AI applications, model APIs, enterprise copilots, privileged agents, and multi-tenant services.

## Inputs
Authentication events, API-key usage, session metadata, tenant context, device/network signals, model requests, tool calls, authorization decisions, and historical baselines.

## Preconditions
Security events can be tied to a stable principal and timestamps are synchronized.

## Context to inspect
Inspect SSO, service accounts, API keys, token lifetimes, impersonation flows, workload identities, tenant boundaries, privilege levels, and expected automation.

## Core knowledge
Identity anomalies should combine security context with AI behavior. A login from a new location is weak evidence alone; a new location followed by bulk sensitive retrieval or privileged tool invocation is materially stronger.

## Procedure
1. Inventory human and machine identities that can access AI capabilities.
2. Define normal behavior by identity class.
3. Correlate authentication anomalies with inference, retrieval, and tool actions.
4. Detect impossible travel, credential sharing, unexpected automation, privilege shifts, and abnormal token use.
5. Score events by privilege, asset sensitivity, and achieved action.
6. Exclude approved service automation and test accounts.
7. Route high-risk events to containment-ready workflows.
8. Tune thresholds using confirmed incidents and benign exceptions.

## Decision points
Use behavioral baselines for established identities and stricter static policies for privileged or newly created identities. Do not automatically disable critical service identities without understanding operational blast radius.

## Common failure patterns
Ignoring machine identities, relying only on login anomalies, missing tenant context, and treating all API-key usage as equivalent.

## Verification
Implemented means identity and AI events correlate reliably. Verified means simulated compromised-account behavior triggers appropriate severity and containment paths without disrupting approved automation.

## Expected output
Identity detections, risk-scoring criteria, exclusions, alert context, and escalation guidance.

## Stop conditions
Escalate when account disablement could disrupt critical production workloads or when evidence indicates a broader identity-provider compromise.