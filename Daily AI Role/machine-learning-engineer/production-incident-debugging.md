# Production ML Incident Debugging

## Purpose
Diagnose and mitigate production ML failures systematically across data, model, service and downstream decision layers.

## When to use
Use for quality drops, anomalous predictions, latency spikes, missing outputs, drift alerts or user-reported model failures.

## Inputs
Incident timeline, model versions, deployments, logs, metrics, traces, feature samples, predictions and labels when available.

## Context to inspect
Recent code/data/model/config changes, upstream incidents, traffic shifts, feature freshness and experiment allocation.

## Core knowledge
ML incidents often cross system boundaries. Separate service correctness from predictive correctness and establish the first bad point in time before theorizing.

## Procedure
1. Define impact, scope and severity.
2. Stabilize service using rollback/fallback when warranted.
3. Identify first known bad timestamp.
4. Correlate deployments, model promotions and upstream changes.
5. Check request volume, latency, errors and saturation.
6. Validate feature schemas, freshness and distributions.
7. Compare prediction distributions by model version and slice.
8. Reproduce representative failures offline using captured inputs.
9. Test hypotheses with evidence, changing one variable at a time.
10. Document root cause, remediation and regression monitor/test.

## Decision points
Rollback before root-cause completion when impact is material and rollback is safe. Retraining is not a default fix for pipeline defects.

## Common failure patterns
Guess-driven debugging, blaming drift without labels, changing multiple components, missing timestamps/version IDs and destroying forensic evidence.

## Verification
Confirm mitigation restores metrics, reproduce the root cause and prove the added test/monitor detects recurrence.

## Expected output
Evidence-backed incident diagnosis, mitigation and prevention action.

## Stop conditions
Escalate when production access/permissions are insufficient, evidence is being lost, or safety/security impact is suspected.