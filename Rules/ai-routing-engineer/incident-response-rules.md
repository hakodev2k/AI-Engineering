# Incident Response Rules

## Purpose
Restore safe routing quickly while preserving evidence and preventing uncontrolled mitigation.

## Scope
Provider outages, quality regressions, policy failures, cost anomalies, capacity incidents, and route misconfiguration.

## MUST
- Routing incidents MUST identify impact, affected route versions, models/providers, traffic classes, and start time as evidence becomes available.
- Mitigation MUST prioritize safety and containment before optimization.
- High-risk manual overrides MUST be time-bounded, auditable, and assigned an owner.
- Incident conclusions MUST use logs, metrics, traces, provider status, evaluations, or equivalent evidence.
- Confirmed failure modes MUST produce corrective actions and regression coverage where practical.

## MUST NOT
- MUST NOT weaken mandatory safety, privacy, or authorization controls to improve availability without explicit authorized approval.
- MUST NOT destroy configuration or telemetry evidence needed for investigation.
- MUST NOT claim root cause from correlation alone.

## SHOULD
- Maintain runbooks for common provider, quota, latency, and quality failures.
- Prefer reversible mitigations with clear success criteria.

## Exceptions
Emergency actions require incident authority, minimized scope, documentation, and post-incident review.

## Verification
Review incident timelines, override logs, route diffs, telemetry evidence, corrective actions, and regression tests.