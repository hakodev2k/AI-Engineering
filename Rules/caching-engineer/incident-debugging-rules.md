# Incident Debugging

## Purpose
Diagnose cache-related incidents from evidence while limiting risky interventions.

## Scope
Latency, misses, stale values, evictions, saturation, connection failures, and origin overload.

## MUST
- Investigation MUST establish a timeline and correlate cache, client, origin, deployment, and infrastructure evidence.
- Hypotheses MUST be tested against available metrics, logs, traces, configuration, and reproduction evidence.
- Mitigations MUST state expected effect and verification signal.
- Root cause MUST distinguish trigger, contributing conditions, and latent design weaknesses where evidence supports them.

## MUST NOT
- Cache flushes, node restarts, or scaling changes MUST NOT be treated as root-cause evidence by themselves.
- Diagnostic actions MUST NOT unnecessarily expose sensitive cached values.
- Correlation MUST NOT be presented as causation without supporting evidence.

## SHOULD
- Preserve relevant telemetry before disruptive mitigation when feasible.
- Add regression detection after confirmed incidents.

## Exceptions
During severe incidents, immediate reversible mitigation may precede complete diagnosis, but actions and uncertainty must be recorded.

## Verification
Review incident timeline, evidence links, hypothesis tests, mitigation metrics, root-cause analysis, and follow-up tests.