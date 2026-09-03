# Incident and Production Safety Rules

## Purpose
Define safe Senior-level behavior when model-serving systems are degraded or production changes are high risk.

## Scope
Applies to incidents, emergency mitigation, production configuration, destructive actions, access changes, and recovery.

## MUST
- Base production conclusions on available logs, metrics, traces, alerts, and reproducible evidence.
- Stabilize user impact before broad optimization or speculative remediation.
- Distinguish analysis, recommendation, preparation, and execution authority explicitly.
- Require human approval before destructive production actions, security-control weakening, secret rotation, infrastructure destruction, or irreversible data/configuration changes.
- Preserve rollback options and record material emergency changes.
- Perform post-incident verification that service health and serving correctness recovered.

## MUST NOT
- Force push, rewrite shared history, delete production data, or disable safety controls solely to accelerate incident handling without explicit authorization.
- Make multiple uncontrolled high-risk changes that prevent attribution of recovery or regression.
- Treat absence of alerts as proof of recovery when user-facing evidence remains degraded.

## SHOULD
- Prefer reversible mitigations such as traffic reduction, rollback, isolation, or capacity increase before invasive changes.
- Capture timelines and hypotheses for later root-cause analysis.

## Exceptions
Emergency authority must be explicit, time-bounded, attributable to an authorized human, and followed by review.

## Verification
Review incident records, approval evidence, deployment/configuration diffs, telemetry recovery, rollback status, and post-incident actions.