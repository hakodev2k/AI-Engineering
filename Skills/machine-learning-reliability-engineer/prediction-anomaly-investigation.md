# Prediction Anomaly Investigation

## Purpose
Investigate abnormal prediction distributions, score collapses, spikes, or unexpected decision patterns and determine whether the cause is data, model, configuration, or serving behavior.

## When to use
Use when prediction distributions shift abruptly, a segment receives implausible outputs, downstream actions spike, or quality alerts lack an obvious infrastructure cause.

## Inputs
- Prediction samples and distributions
- Model version and configuration
- Feature values and freshness
- Request traces
- Historical reference windows
- Downstream decision logs

## Context to inspect
Inspect score histograms, class frequencies, confidence, thresholds, segment mix, missing features, preprocessing, model routing, deployment changes, and upstream data anomalies.

## Core knowledge
Prediction anomalies can result from real population change, feature corruption, threshold/configuration changes, numerical instability, wrong model loading, preprocessing skew, or distribution shift. Investigation should localize the first point where expected behavior diverges.

## Procedure
1. Define the anomaly precisely in time, scope, and affected cohorts.
2. Compare prediction distributions with a known-good reference.
3. Split results by model version, route, region, client, and key cohorts.
4. Trace anomalous requests through raw inputs, transformed features, model output, and final decision logic.
5. Compare feature distributions and missingness for anomalous versus normal requests.
6. Check thresholds, calibration, preprocessing artifacts, and model-loading metadata.
7. Reproduce representative cases against the expected model offline.
8. Test ranked hypotheses one at a time.
9. Contain impact if the anomaly is harmful.
10. Add targeted monitoring or regression tests for the discovered failure mode.

## Decision points
Treat widespread synchronous shifts as likely pipeline/configuration incidents before assuming natural drift. Treat isolated cohorts as potential segment or upstream-source issues. Roll back when reproduction demonstrates a release-induced regression.

## Common failure patterns
- Looking only at aggregate averages.
- Assuming drift without tracing feature values.
- Ignoring decision thresholds after model output.
- Comparing different traffic mixes without normalization.
- Losing anomalous request examples before investigation.

## Verification
Verify the anomaly can be reproduced or explained from evidence, remediation restores expected distributions, and downstream outcomes stabilize without masking legitimate population changes.

## Expected output
A scoped anomaly report with evidence, root cause, remediation, and new detection or regression checks.

## Stop conditions
Stop and escalate if anomalous predictions create safety-critical actions, required request evidence is unavailable, or investigation requires unauthorized production data access.