# NLP Production Debugging

## Purpose
Diagnose production NLP failures by isolating whether the root cause lies in input data, preprocessing, retrieval, model behavior, serving infrastructure, or downstream integration.

## When to use
Use for quality regressions, unexplained output changes, latency spikes, missing results, malformed outputs, or user-reported model failures.

## Inputs
Incident description, model/version metadata, logs, traces, representative inputs, expected outputs, recent changes, serving metrics.

## Preconditions
Enough evidence exists to reproduce or narrow the failure without exposing prohibited production data.

## Context to inspect
Input transformations, tokenizer versions, model artifacts, retrieval results, prompt versions, feature flags, latency traces, dependency errors, rollout history.

## Core knowledge
NLP incidents often cross multiple boundaries. A fluent wrong answer may originate from stale retrieval, truncation, preprocessing mismatch, bad prompt state, model drift, or downstream postprocessing rather than the model itself.

## Procedure
1. Define the observed failure precisely and its blast radius.
2. Capture the exact model, prompt, tokenizer, retrieval, and configuration versions.
3. Reproduce with a privacy-safe representative input.
4. Compare against the previous known-good release.
5. Inspect preprocessing and tokenized input for truncation or corruption.
6. Inspect retrieval or external context independently.
7. Run the model with controlled inputs to isolate model behavior.
8. Trace downstream parsing and business-rule handling.
9. Correlate with deployment, data, and dependency changes.
10. Form one falsifiable hypothesis at a time and test it.
11. Mitigate first when user impact is active; then complete root-cause analysis.
12. Convert the confirmed failure into a regression test.

## Decision points
Rollback when impact is high and a known-good version exists. Hotfix only when the failure mechanism is understood and regression risk is bounded.

## Common failure patterns
Changing multiple variables at once, blaming the model before inspecting context, debugging with different preprocessing than production, and losing exact version metadata.

## Verification
The failure is reproducible, the root cause is isolated by evidence, mitigation removes impact, and a regression test fails before the fix and passes after it.

## Expected output
Incident timeline, root cause, evidence, mitigation, permanent fix, regression test, and residual risks.

## Stop conditions
Escalate when production access or sensitive data is required beyond authorization, evidence contradicts the working hypothesis, or mitigation creates greater risk.