# Release Signal Assessment

## Purpose
Build an evidence-backed view of post-release health without mixing facts, guesses, or authorization.

## When to use
After a production release, canary, infrastructure change, feature activation, or during a release-related incident.

## Inputs
- Release identifier and deployment time
- Policy file
- Baseline metric values
- Current metric samples and timestamps
- Incident/alert references
- Smoke/integration test results
- Business KPI signals when relevant

## Preconditions
- Release identity is known.
- Observation timestamps use UTC or explicitly declared timezone.
- Metrics include source and unit.

## Required context
Monitoring evidence, deployment metadata, recent relevant changes, known maintenance/dependency incidents, and current incident notes.

## Allowed tools
Read-only repository, monitoring, logs, deployment metadata, status pages, test reports, calculators, and deterministic scripts in this package.

## Constraints
- Do not execute rollback or mutate production.
- Do not convert missing data into a healthy signal.
- Do not claim causality from temporal correlation alone.

## Process
1. Record release ID, environment, version, started/finished timestamps, and observation start.
2. Load policy thresholds and required critical metrics.
3. Capture baseline values from the defined comparison window.
4. Capture current metric samples with timestamps and source identifiers.
5. Normalize units before comparison.
6. Mark missing/stale critical metrics explicitly.
7. Record alert, incident, test, and business-signal evidence separately.
8. Identify coincident external events that could explain degradation.
9. Separate facts, hypotheses, and open questions.
10. Produce `release-evidence.json` matching the schema.
11. Run `scripts/validate-release-evidence.py`.
12. Hand valid evidence to Decision Analyst.

## Expected output
A schema-valid evidence manifest with traceable metrics and no production mutation.

## Verification
Validator exits 0; all required critical metrics exist; observation window is internally consistent; every metric has source, timestamp, unit, baseline, and current value.

## Failure handling
Retry a transient read/collection failure once. If a critical metric remains unavailable or stale, stop with `blocked` rather than infer health.

## Stop conditions
Stop on invalid release identity, unavailable required policy, missing critical evidence after one retry, or permission escalation requirement.