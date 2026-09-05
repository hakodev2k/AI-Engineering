# Incident Response Rules

## Purpose
Guide disciplined response when telemetry itself is missing, misleading, delayed, exposed, or causing production impact.

## Scope
Collector outages, ingestion loss, corrupt telemetry, schema breakage, privacy incidents, runaway cardinality, and telemetry-induced resource exhaustion.

## MUST
- Responders MUST distinguish application failure from telemetry failure before drawing operational conclusions.
- Incident diagnosis MUST use available pipeline metrics, logs, traces, deployment history, and backend evidence.
- Mitigation MUST prioritize production safety, data protection, and restoration of trustworthy signals.
- Significant incidents MUST document impact, lost or suspect data windows, mitigation, root cause or bounded causal evidence, and corrective actions.

## MUST NOT
- MUST NOT treat absence of telemetry as proof of healthy systems.
- MUST NOT destroy evidence required to determine data loss or exposure.
- MUST NOT continue a harmful telemetry rollout when rollback is the safer mitigation.

## SHOULD
- Add regression checks for confirmed failure modes.

## Exceptions
Emergency actions may precede normal review only under authorized incident procedures and MUST be documented afterward.

## Verification
Review incident timelines, pipeline evidence, rollback actions, affected-data estimates, and corrective tests.