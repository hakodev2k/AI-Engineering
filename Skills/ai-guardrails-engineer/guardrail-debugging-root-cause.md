# Guardrail Debugging and Root-Cause Analysis

## Purpose
Diagnose incorrect behavior across policy, model, data, code, configuration, runtime.

## When to use
Use for unexpected blocks/misses/inconsistency/latency.

## Inputs
Reproduction, trace, versions, scores, config, deployment, expected outcome.

## Context to inspect
Inspect preprocessing, truncation, policy, classifier input, thresholds, caches, authorization, retries.

## Core knowledge
Pipeline failures often masquerade as model failures. Reproduce exact versions and distinguish deterministic defects, ambiguity, stochastic variance, drift, infrastructure faults.

## Procedure
1. State expected/observed.
2. Capture versions.
3. Reproduce.
4. Trace layers.
5. Compare decisions/thresholds.
6. Check normalization/cache.
7. Measure variance.
8. Falsify hypotheses.
9. Fix earliest cause.
10. Add regression/telemetry.

## Decision points
Resolve policy ambiguity first; fix authorization at boundary.

## Common failure patterns
Premature prompt changes, ignored versions, anecdotal tuning, stale cache, missing negatives.

## Verification
Minimal regression fails before/passes after without adjacent regressions.

## Expected output
Root cause and verified fix.

## Stop conditions
Stop speculation without evidence.