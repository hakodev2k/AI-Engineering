# Performance Root Cause Analysis Rules
## Purpose
Resolve performance incidents through evidence rather than speculative tuning.
## Scope
Regressions, saturation, latency spikes, memory growth, and throughput collapse.
## MUST
- Establish symptom, timeline, affected scope, and reproducible or observable evidence.
- Form hypotheses and test them against metrics, traces, profiles, changes, and dependency behavior.
- Distinguish root cause, contributing factors, and symptoms.
## MUST NOT
- Make broad corrective changes solely from correlation or intuition.
- Close an investigation because a symptom disappeared without validating the cause when risk is material.
## SHOULD
- Preserve diagnostic artifacts and document eliminated hypotheses.
## Exceptions
Emergency mitigation may precede root-cause confirmation.
## Verification
Review incident timeline, evidence, hypotheses, experiments, fix validation, and recurrence controls.