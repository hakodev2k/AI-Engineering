# Incident Response
## Purpose
Restore service safely while preserving diagnostic evidence.
## Scope
Mesh-related outages, latency, policy failures, certificate failures, and routing incidents.
## MUST
- Incident actions MUST distinguish observed evidence from hypotheses.
- Risky mitigation MUST define expected effect, blast radius, and rollback.
- Relevant proxy, control-plane, gateway, and application evidence MUST be preserved.
## MUST NOT
- MUST NOT disable security controls broadly without authorized incident approval.
- MUST NOT make simultaneous unrelated changes that destroy causal clarity.
- MUST NOT declare recovery without user-facing or service-level evidence.
## SHOULD
- Responders SHOULD compare recent mesh configuration and version changes early.
## Exceptions
Immediate life/safety or severe outage mitigation may precede full documentation but MUST be recorded afterward.
## Verification
Review incident timeline, telemetry, config diffs, recovery metrics, and corrective-action evidence.