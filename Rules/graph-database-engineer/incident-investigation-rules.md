# Incident Investigation Rules

## Purpose
Diagnose graph incidents from evidence while minimizing further production risk.

## Scope
Performance regressions, data corruption, availability failures, query incidents, replication issues, and operational anomalies.

## MUST
- Establish timeline, scope, affected workloads, and evidence before broad corrective changes.
- Preserve relevant logs, metrics, query plans, configuration, topology, and change history.
- Distinguish correlation from demonstrated cause.
- Prefer reversible mitigations while root cause remains uncertain.
- Require human approval before destructive repair, data deletion, topology destruction, or security-control weakening.

## MUST NOT
- Run unbounded diagnostic queries on an already degraded production cluster.
- Modify or delete evidence needed for root-cause analysis.
- Declare root cause solely because a restart temporarily restores service.

## SHOULD
- Reproduce failures in an isolated environment when feasible.
- Record hypotheses and evidence that confirm or reject them.

## Exceptions
Emergency mitigation may precede full diagnosis when user or data harm is ongoing, but actions, evidence, risk, and authorization MUST be recorded.

## Verification
Review incident timeline, telemetry, query profiles, change history, hypotheses, mitigation evidence, and post-incident tests demonstrating that the failure mode is addressed or bounded.