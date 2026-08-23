# Incident Investigation Rules
## Purpose
Use telemetry as evidence to bound and identify production failures.
## Scope
Incident triage, hypothesis testing, timelines, and root-cause investigation.
## MUST
- Build conclusions from logs, metrics, traces, alerts, changes, or equivalent evidence.
- Record key timestamps, hypotheses, observations, and disproving evidence for significant incidents.
- Distinguish correlation from demonstrated causation.
## MUST NOT
- Alter or delete evidence to fit a preferred hypothesis.
- Treat agent confidence as incident evidence.
## SHOULD
- Compare healthy and unhealthy cohorts or time windows.
## Exceptions
When evidence is incomplete, state uncertainty and bound likely causes instead of inventing certainty.
## Verification
Review incident timeline, queries, linked evidence, hypothesis transitions, and final causal claims.