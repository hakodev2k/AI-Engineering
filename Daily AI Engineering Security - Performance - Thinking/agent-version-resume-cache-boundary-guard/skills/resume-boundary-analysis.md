# Skill — Resume Boundary Analysis

## Purpose
Determine whether a resumed agent session is expected to reuse its prompt prefix and identify structural causes of a cold resume.

## Trigger
Before resume, or after a first resumed turn shows unexpectedly high cache creation.

## Inputs
Checkpoint/current manifests; provider cache usage; pause duration; configured cache TTL.

## Preconditions
No raw secrets in manifests. Usage telemetry must identify cache read/create tokens when available.

## Allowed tools
Read-only session metadata, configuration inspection, `scripts/cache_boundary.py`, provider usage logs.

## Constraints
Do not mutate runtime configuration during diagnosis. Do not infer TTL expiry when pause < known TTL and structural drift is present.

## Procedure
1. Record baseline from last warm pre-pause turn: cache read/create, model, effort, host version.
2. Run boundary comparison.
3. Classify changed fields as runtime, model/effort, system/policy, tool schema, or hook context.
4. Measure first resumed turn and compute cache-read ratio = read/(read+create) when denominator > 0.
5. Form one causal hypothesis per changed component; prefer a controlled replay where safe.
6. If no fields changed, investigate TTL/provider-side causes without weakening correctness context.
7. Hand findings to verifier.

## Expected output
Facts, changed fields, baseline, resumed metrics, hypothesis, confidence, verification status.

## Metrics
First-resume cache creation, cache-read ratio, avoidable rewrite estimate, added latency.

## Failure handling
Malformed manifests block diagnosis. Missing provider usage is recorded as unmeasured, not guessed.

## Stop conditions
Stop after two controlled replays or once a single component change reproduces the cold/warm transition.