# Production Debugging and Root Cause Analysis

## Purpose
Diagnose recommendation-quality and serving incidents systematically using evidence rather than speculative model changes.

## When to use
Use for sudden metric drops, bad recommendations, latency spikes, missing inventory, or cohort-specific regressions.

## Inputs
Incident window, deployments, model versions, logs, traces, metrics, feature snapshots, candidate outputs, and data-pipeline status.

## Context to inspect
Recent changes, dependency health, event freshness, model/config rollout, cache state, cohort boundaries, and fallback rates.

## Core knowledge
Recommendation failures can originate in data, retrieval, features, ranking, policy, serving, experimentation, or telemetry. Localize the stage before changing the model.

## Procedure
1. Define symptom, affected cohorts, start time, and severity.
2. Compare against recent deploy/config/data changes.
3. Trace representative requests through candidate, feature, score, and final-list stages.
4. Check data freshness and schema health.
5. Compare current model/config with last-known-good behavior.
6. Quantify fallback, timeout, empty-result, and source-mix changes.
7. Form falsifiable hypotheses and test highest-likelihood causes first.
8. Mitigate safely, then document root cause and prevention.

## Decision points
Rollback when a recent reversible change strongly correlates with severe impact; continue diagnosis when evidence points to upstream/shared dependencies.

## Common failure patterns
Retraining immediately, debugging only aggregate metrics, changing multiple variables, ignoring telemetry corruption, and declaring root cause without reproduction.

## Verification
Reproduce the failure or explain it with traceable evidence; verify mitigation restores affected metrics and add regression detection.

## Expected output
Incident timeline, proven root cause, mitigation, validation evidence, and preventive actions.

## Stop conditions
Escalate when production access/permissions are required, mitigation is destructive, or evidence implicates a dependency outside ownership.